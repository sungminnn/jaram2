import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { canWritePost, getCurrentUser } from "@/lib/server/current-user";
import {
  deletePostAttachment,
  findFileInfoById,
  findPostById,
  getPostPageForCategory,
  verifyGuestPostPassword,
} from "@/lib/server/supabase-admin";

type RouteContext = {
  params: Promise<{ id: string; fileId: string }>;
};
const accessCookieName = "jaram_post_access";

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

async function hasPostAccess(postId: string) {
  const cookieStore = await cookies();
  const accessMap = readAccessMap(cookieStore.get(accessCookieName)?.value);

  return Boolean(accessMap[postId]);
}

async function canManagePost(input: {
  postId: string;
  category: string;
  guestPassword: string;
}) {
  const page = getPostPageForCategory(input.category);
  const post = await findPostById(input.postId);
  const currentUser = await getCurrentUser();

  if (!page || !post || post.is_deleted || post.page !== page) {
    return { allowed: false, post: null, currentUser, status: 404 };
  }

  if (currentUser?.role === "admin") {
    return { allowed: true, post, currentUser, status: 200 };
  }

  if (input.category === "qna") {
    if (currentUser && post.author_id === currentUser.id) {
      return { allowed: true, post, currentUser, status: 200 };
    }

    if (verifyGuestPostPassword(input.guestPassword, post.password) || (await hasPostAccess(input.postId))) {
      return { allowed: true, post, currentUser, status: 200 };
    }
  }

  if (input.category !== "qna" && currentUser && canWritePost(currentUser.role, input.category)) {
    return { allowed: true, post, currentUser, status: 200 };
  }

  return { allowed: false, post, currentUser, status: 403 };
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    const { id, fileId } = await context.params;
    const body = (await request.json()) as { category?: string; guestPassword?: string };
    const category = body.category?.trim() ?? "";
    const guestPassword = body.guestPassword?.trim() ?? "";
    const permission = await canManagePost({ postId: id, category, guestPassword });

    if (!permission.allowed) {
      return NextResponse.json(
        { message: permission.status === 404 ? "게시글을 찾을 수 없습니다." : "첨부파일 삭제 권한이 없습니다." },
        { status: permission.status },
      );
    }

    const file = await findFileInfoById(fileId);

    if (!file || String(file.post_id) !== id) {
      return NextResponse.json({ message: "첨부파일을 찾을 수 없습니다." }, { status: 404 });
    }

    await deletePostAttachment(fileId);

    return NextResponse.json({ message: "첨부파일이 삭제되었습니다." });
  } catch (error) {
    const message = error instanceof Error ? error.message : "첨부파일 삭제 중 오류가 발생했습니다.";

    return NextResponse.json({ message }, { status: 500 });
  }
}
