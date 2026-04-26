"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Loader2, Trash2, X } from "lucide-react";

type DeletePostDialogProps = {
  postId: string;
  category: string;
  requirePassword?: boolean;
};

export function DeletePostDialog({ postId, category, requirePassword = false }: DeletePostDialogProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [guestPassword, setGuestPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function deletePost() {
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category,
          guestPassword,
        }),
      });
      const data = (await response.json()) as { message?: string; href?: string };

      if (!response.ok) {
        throw new Error(data.message ?? "게시글 삭제에 실패했습니다.");
      }

      router.push(data.href ?? `/news/${category}`);
      router.refresh();
      return;
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "게시글 삭제에 실패했습니다.");
      setIsSubmitting(false);
    }
  }

  const dialog = isOpen ? (
    <div className="fixed inset-0 z-[1000] grid min-h-dvh place-items-center bg-forest/35 px-5 py-8" role="dialog" aria-modal="true">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-soft">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-lg font-bold text-forest">게시글을 삭제할까요?</p>
            <p className="mt-2 text-sm leading-6 text-muted">삭제한 글은 목록에서 표시되지 않습니다.</p>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="focus-ring grid size-8 place-items-center rounded-md text-muted"
            aria-label="삭제 확인 닫기"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>

        {requirePassword ? (
          <label className="mt-5 grid gap-2 text-sm font-semibold text-forest">
            글 비밀번호
            <input
              type="password"
              value={guestPassword}
              onChange={(event) => setGuestPassword(event.target.value)}
              className="rounded-2xl border border-forest/12 bg-cream px-4 py-3 text-base outline-none focus:border-leaf"
            />
          </label>
        ) : null}

        {error ? (
          <div className="mt-4 rounded-xl border border-[#f2b1a8] bg-[#fff4f1] px-4 py-3 text-sm font-semibold text-[#a13a29]">
            {error}
          </div>
        ) : null}

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="focus-ring rounded-md bg-mint px-4 py-3 text-sm font-bold text-forest transition hover:bg-leaf hover:text-white"
          >
            취소
          </button>
          <button
            type="button"
            onClick={deletePost}
            disabled={isSubmitting}
            className="rounded-md bg-[#a13a29] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#7f2d20] disabled:cursor-not-allowed disabled:bg-[#a13a29]/45"
          >
            {isSubmitting ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                삭제 중...
              </span>
            ) : (
              "삭제"
            )}
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-3 text-sm font-bold text-muted shadow-[0_8px_24px_rgba(47,80,61,0.08)]"
      >
        <Trash2 size={16} aria-hidden="true" />
        삭제
      </button>

      {typeof document === "undefined" ? dialog : createPortal(dialog, document.body)}
    </>
  );
}
