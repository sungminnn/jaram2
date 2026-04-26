import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/server/current-user";
import {
  findPostById,
  getPostPageForCategory,
  verifyGuestPostPassword,
} from "@/lib/server/supabase-admin";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const accessCookieName = "jaram_post_access";
const accessMaxAgeSeconds = 60 * 60;

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

export async function POST(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = (await request.json()) as { category?: string; password?: string };
    const category = body.category?.trim() ?? "";
    const password = body.password?.trim() ?? "";
    const page = getPostPageForCategory(category);
    const post = await findPostById(id);
    const currentUser = await getCurrentUser();

    if (!page || !post || post.is_deleted || post.page !== page) {
      return NextResponse.json({ message: "게시글을 찾을 수 없습니다." }, { status: 404 });
    }

    const allowed =
      currentUser?.role === "admin" ||
      (currentUser && post.author_id === currentUser.id) ||
      verifyGuestPostPassword(password, post.password);

    if (!allowed) {
      return NextResponse.json({ message: "비밀번호가 일치하지 않습니다." }, { status: 403 });
    }

    const cookieStore = await cookies();
    const accessMap = readAccessMap(cookieStore.get(accessCookieName)?.value);
    accessMap[id] = Date.now();

    const response = NextResponse.json({ ok: true });
    response.cookies.set(accessCookieName, JSON.stringify(accessMap), {
      httpOnly: true,
      maxAge: accessMaxAgeSeconds,
      path: "/",
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "비밀번호 확인 중 오류가 발생했습니다.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
