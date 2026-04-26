"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, Loader2 } from "lucide-react";

type PrivatePostUnlockFormProps = {
  postId: string;
  category: string;
  title?: string;
  description?: string;
  buttonLabel?: string;
  pendingLabel?: string;
};

export function PrivatePostUnlockForm({
  postId,
  category,
  title = "비밀글입니다",
  description = "작성 시 입력한 비밀번호를 확인하면 내용을 볼 수 있습니다.",
  buttonLabel = "확인",
  pendingLabel = "확인 중...",
}: PrivatePostUnlockFormProps) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function unlockPost(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/posts/${postId}/access`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category,
          password,
        }),
      });
      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(data.message ?? "비밀번호 확인에 실패했습니다.");
      }

      router.refresh();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "비밀번호 확인에 실패했습니다.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-[0_18px_55px_rgba(47,80,61,0.08)] sm:p-8">
      <div className="mx-auto grid max-w-md gap-5 text-center">
        <LockKeyhole className="mx-auto size-10 text-leaf" aria-hidden="true" />
        <div>
          <h2 className="text-2xl font-bold text-forest">{title}</h2>
          <p className="mt-3 text-sm leading-7 text-muted">{description}</p>
        </div>
        <form onSubmit={unlockPost} className="grid gap-3 text-left">
          <label className="grid gap-2 text-sm font-semibold text-forest">
            글 비밀번호
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="rounded-2xl border border-forest/12 bg-cream px-4 py-3 text-base outline-none focus:border-leaf"
            />
          </label>
          {error ? (
            <p className="rounded-xl border border-[#f2b1a8] bg-[#fff4f1] px-4 py-3 text-sm font-semibold text-[#a13a29]">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-forest px-4 py-3 text-sm font-bold text-white transition hover:bg-leaf disabled:cursor-not-allowed disabled:bg-forest/45"
          >
            {isSubmitting ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                {pendingLabel}
              </span>
            ) : (
              buttonLabel
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
