import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/server/current-user";
import {
  findCommentById,
  findPostById,
  getPostPageForCategory,
  insertPostComment,
  softDeleteComment,
} from "@/lib/server/supabase-admin";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ message: "로그인 후 댓글을 작성할 수 있습니다." }, { status: 401 });
    }

    const body = (await request.json()) as { category?: string; content?: string; isPrivate?: boolean };
    const category = body.category?.trim() ?? "";
    const content = body.content?.trim() ?? "";
    const page = getPostPageForCategory(category);
    const post = await findPostById(id);

    if (category !== "qna" || page !== "qna" || !post || post.is_deleted || post.page !== page) {
      return NextResponse.json({ message: "댓글을 작성할 게시글을 찾을 수 없습니다." }, { status: 404 });
    }

    if (!content) {
      return NextResponse.json({ message: "댓글 내용을 입력해주세요." }, { status: 400 });
    }

    if (content.length > 1000) {
      return NextResponse.json({ message: "댓글은 1000자 이하로 입력해주세요." }, { status: 400 });
    }

    await insertPostComment({
      postId: id,
      content,
      isPrivate: body.isPrivate === true,
      authorId: currentUser.id,
      authorName: currentUser.name,
    });

    return NextResponse.json({ message: "댓글이 등록되었습니다." });
  } catch (error) {
    const message = error instanceof Error ? error.message : "댓글 저장 중 오류가 발생했습니다.";

    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ message: "로그인 후 댓글을 삭제할 수 있습니다." }, { status: 401 });
    }

    const body = (await request.json()) as { commentId?: string };
    const commentId = body.commentId?.trim() ?? "";
    const comment = commentId ? await findCommentById(commentId) : null;

    if (!comment || String(comment.post_id) !== id || comment.is_deleted) {
      return NextResponse.json({ message: "댓글을 찾을 수 없습니다." }, { status: 404 });
    }

    if (currentUser.role !== "admin" && comment.author_id !== currentUser.id) {
      return NextResponse.json({ message: "댓글 삭제 권한이 없습니다." }, { status: 403 });
    }

    await softDeleteComment(commentId);

    return NextResponse.json({ message: "댓글이 삭제되었습니다." });
  } catch (error) {
    const message = error instanceof Error ? error.message : "댓글 삭제 중 오류가 발생했습니다.";

    return NextResponse.json({ message }, { status: 500 });
  }
}
