import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/server/current-user";
import {
  findPostById,
  getPostPageForCategory,
  incrementPostViewCount,
} from "@/lib/server/supabase-admin";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const viewedPostsCookie = "jaram_viewed_posts";
const accessCookieName = "jaram_post_access";
const viewCooldownMs = 24 * 60 * 60 * 1000;

function readViewedPosts(value: string | undefined) {
  if (!value) {
    return {};
  }

  try {
    const parsed = JSON.parse(value) as Record<string, number>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function readAccessMap(value: string | undefined) {
  if (!value) {
    return {};
  }

  try {
    const parsed = JSON.parse(value) as Record<string, number>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function compactViewedPosts(viewedPosts: Record<string, number>, now: number) {
  return Object.fromEntries(
    Object.entries(viewedPosts)
      .filter(([, viewedAt]) => now - viewedAt < viewCooldownMs)
      .slice(-200),
  );
}

export async function POST(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = (await request.json().catch(() => ({}))) as { category?: string };
    const category = body.category?.trim() ?? "";
    const page = getPostPageForCategory(category);
    const post = await findPostById(id);
    const currentUser = await getCurrentUser();

    if (!page || !post || post.is_deleted || post.page !== page) {
      return NextResponse.json({ message: "게시글을 찾을 수 없습니다." }, { status: 404 });
    }

    const cookieStore = await cookies();
    const accessMap = readAccessMap(cookieStore.get(accessCookieName)?.value);

    if (
      post.is_private &&
      category === "qna" &&
      currentUser?.role !== "admin" &&
      currentUser?.id !== post.author_id &&
      !accessMap[id]
    ) {
      return NextResponse.json({ counted: false }, { status: 403 });
    }

    const now = Date.now();
    const viewedPosts = compactViewedPosts(readViewedPosts(cookieStore.get(viewedPostsCookie)?.value), now);
    const lastViewedAt = viewedPosts[id] ?? 0;

    if (now - lastViewedAt < viewCooldownMs) {
      return NextResponse.json({ counted: false });
    }

    const views = await incrementPostViewCount(id);
    viewedPosts[id] = now;

    const response = NextResponse.json({ counted: true, views });
    response.cookies.set(viewedPostsCookie, JSON.stringify(viewedPosts), {
      httpOnly: true,
      maxAge: viewCooldownMs / 1000,
      path: "/",
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "조회수 처리 중 오류가 발생했습니다.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
