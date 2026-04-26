"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, LockKeyhole, Loader2, MessageSquareText, Trash2, X } from "lucide-react";

type PostComment = {
  id: string;
  postId: string;
  content: string;
  isPrivate: boolean;
  isMine: boolean;
  canDelete: boolean;
  authorName: string;
  createdAt: string;
};

type QnaCommentsProps = {
  postId: string;
  category: string;
  comments: PostComment[];
  canWrite: boolean;
  currentUserName?: string;
};

export function QnaComments({ postId, category, comments, canWrite, currentUserName }: QnaCommentsProps) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function showToast(message: string) {
    setToastMessage(message);
    window.setTimeout(() => setToastMessage(null), 2400);
  }

  async function submitComment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setToastMessage(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, content, isPrivate }),
      });
      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(data.message ?? "댓글 등록에 실패했습니다.");
      }

      setContent("");
      setIsPrivate(false);
      showToast(data.message ?? "댓글이 등록되었습니다.");
      router.refresh();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "댓글 등록에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function deleteComment(commentId: string) {
    setError(null);
    setToastMessage(null);
    setDeletingId(commentId);

    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId }),
      });
      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(data.message ?? "댓글 삭제에 실패했습니다.");
      }

      showToast(data.message ?? "댓글이 삭제되었습니다.");
      router.refresh();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "댓글 삭제에 실패했습니다.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="mt-10 border-t border-forest/10 pt-8">
      {toastMessage ? (
        <div className="fixed right-5 top-24 z-[1100] inline-flex max-w-sm items-center gap-2 rounded-lg bg-forest px-4 py-3 text-sm font-bold text-white shadow-soft">
          <CheckCircle2 className="size-4 text-leaf" aria-hidden="true" />
          {toastMessage}
        </div>
      ) : null}

      <div className="flex items-center justify-between gap-3">
        <h3 className="inline-flex items-center gap-2 text-lg font-bold text-forest">
          <MessageSquareText size={20} aria-hidden="true" />
          댓글 {comments.length}
        </h3>
        {currentUserName ? <span className="text-sm font-semibold text-muted">{currentUserName}</span> : null}
      </div>

      {error ? (
        <div className="mt-4 flex items-start justify-between gap-4 rounded-2xl border border-[#f2b1a8] bg-[#fff4f1] px-4 py-3 text-sm font-semibold text-[#a13a29]">
          <span>{error}</span>
          <button type="button" onClick={() => setError(null)} aria-label="오류 메시지 닫기">
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
      ) : null}

      <div className="mt-5 grid gap-3">
        {comments.length ? (
          comments.map((comment) => (
            <article key={comment.id} className="rounded-lg border border-forest/10 bg-cream/70 px-4 py-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="font-bold text-forest">{comment.authorName}</span>
                  <span className="text-muted">{comment.createdAt}</span>
                  {comment.isPrivate ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 text-xs font-bold text-muted">
                      <LockKeyhole size={12} aria-hidden="true" />
                      비밀댓글
                    </span>
                  ) : null}
                </div>
                {comment.canDelete ? (
                  <button
                    type="button"
                    onClick={() => deleteComment(comment.id)}
                    disabled={deletingId === comment.id}
                    className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-bold text-[#a13a29] transition hover:bg-[#fff4f1] disabled:cursor-not-allowed disabled:text-muted"
                  >
                    {deletingId === comment.id ? <Loader2 className="size-3 animate-spin" aria-hidden="true" /> : <Trash2 size={13} aria-hidden="true" />}
                    삭제
                  </button>
                ) : null}
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-forest/82">{comment.content}</p>
            </article>
          ))
        ) : (
          <p className="rounded-lg bg-cream/70 px-4 py-5 text-sm text-muted">등록된 댓글이 없습니다.</p>
        )}
      </div>

      <div className="mt-6">
        {canWrite ? (
          <form onSubmit={submitComment} className="grid gap-3 rounded-lg border border-forest/10 bg-white p-4">
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              rows={4}
              maxLength={1000}
              placeholder="댓글을 입력해주세요."
              className="resize-y rounded-2xl border border-forest/12 bg-cream px-4 py-3 text-base outline-none focus:border-leaf"
            />
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <label className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-forest">
                <input
                  type="checkbox"
                  checked={isPrivate}
                  onChange={(event) => setIsPrivate(event.target.checked)}
                  className="size-4 accent-forest"
                />
                비밀댓글
              </label>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-md bg-forest px-4 py-3 text-sm font-bold text-white transition hover:bg-leaf disabled:cursor-not-allowed disabled:bg-forest/45"
              >
                {isSubmitting ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                    등록 중...
                  </span>
                ) : (
                  "댓글 등록"
                )}
              </button>
            </div>
          </form>
        ) : (
          <p className="rounded-lg border border-forest/10 bg-cream/70 px-4 py-5 text-sm font-semibold text-muted">
            로그인한 회원만 댓글을 작성할 수 있습니다.
          </p>
        )}
      </div>
    </section>
  );
}
