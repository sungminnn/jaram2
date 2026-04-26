"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, KeyRound, X } from "lucide-react";

function getRecoveryAccessToken() {
  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const queryParams = new URLSearchParams(window.location.search);

  return hashParams.get("access_token") ?? queryParams.get("access_token") ?? "";
}

export function ResetPasswordForm() {
  const [accessToken, setAccessToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setAccessToken(getRecoveryAccessToken());
  }, []);

  async function submitPassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/password/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accessToken,
          password,
          confirmPassword,
        }),
      });
      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(data.message ?? "비밀번호 변경에 실패했습니다.");
      }

      setPassword("");
      setConfirmPassword("");
      setIsComplete(true);
      setMessage(data.message ?? "비밀번호가 변경되었습니다.");
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : "비밀번호 변경에 실패했습니다.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid gap-6 rounded-[2rem] border border-forest/10 bg-white p-6 shadow-soft sm:p-8">
      {error ? (
        <div className="flex items-start justify-between gap-4 rounded-2xl border border-[#f2b1a8] bg-[#fff4f1] px-4 py-3 text-sm font-semibold text-[#a13a29]">
          <span>{error}</span>
          <button type="button" onClick={() => setError(null)} aria-label="오류 메시지 닫기">
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
      ) : null}

      {message ? (
        <div className="flex items-start justify-between gap-4 rounded-2xl border border-[#c9e7bf] bg-[#f5fff2] px-4 py-3 text-sm font-semibold text-[#25653f]">
          <span>{message}</span>
          <button type="button" onClick={() => setMessage(null)} aria-label="안내 메시지 닫기">
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
      ) : null}

      <div className="grid gap-2">
        <p className="text-sm font-bold tracking-[0.18em] text-leaf">RESET PASSWORD</p>
        <h1 className="text-3xl font-bold text-forest sm:text-4xl">비밀번호 재설정</h1>
      </div>

      {!accessToken && !isComplete ? (
        <div className="rounded-2xl border border-amber/35 bg-cream px-4 py-3 text-sm font-semibold text-forest">
          재설정 링크가 올바르지 않거나 만료되었습니다. 로그인 페이지에서 다시 요청해주세요.
        </div>
      ) : null}

      {isComplete ? (
        <Link
          href="/login"
          className="focus-ring rounded-2xl bg-forest px-6 py-4 text-center text-base font-bold text-white transition hover:bg-leaf"
        >
          로그인 페이지로 돌아가기
        </Link>
      ) : (
        <form onSubmit={submitPassword} className="grid gap-4">
          <label className="grid gap-2 text-sm font-semibold text-forest">
            새 비밀번호
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
              <input
                required
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-2xl border border-forest/12 bg-cream px-4 py-3 pl-11 pr-12 text-base font-medium text-ink outline-none transition focus:border-leaf"
                placeholder="숫자, 특수문자 포함 8자 이상"
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="focus-ring absolute right-3 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-md text-muted transition hover:text-forest"
                aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
              >
                {showPassword ? (
                  <EyeOff className="size-4" aria-hidden="true" />
                ) : (
                  <Eye className="size-4" aria-hidden="true" />
                )}
              </button>
            </div>
          </label>

          <label className="grid gap-2 text-sm font-semibold text-forest">
            새 비밀번호 확인
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
              <input
                required
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="w-full rounded-2xl border border-forest/12 bg-cream px-4 py-3 pl-11 pr-12 text-base font-medium text-ink outline-none transition focus:border-leaf"
                placeholder="비밀번호를 다시 입력"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((current) => !current)}
                className="focus-ring absolute right-3 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-md text-muted transition hover:text-forest"
                aria-label={showConfirmPassword ? "비밀번호 확인 숨기기" : "비밀번호 확인 보기"}
              >
                {showConfirmPassword ? (
                  <EyeOff className="size-4" aria-hidden="true" />
                ) : (
                  <Eye className="size-4" aria-hidden="true" />
                )}
              </button>
            </div>
          </label>

          <button
            type="submit"
            disabled={isSubmitting || !accessToken}
            className="focus-ring mt-2 rounded-2xl bg-forest px-6 py-4 text-base font-bold text-white transition hover:bg-leaf disabled:cursor-not-allowed disabled:bg-forest/45"
          >
            {isSubmitting ? "변경 중..." : "비밀번호 변경"}
          </button>
        </form>
      )}

      {!isComplete ? (
        <Link href="/login" className="text-sm font-bold text-leaf underline underline-offset-4">
          로그인으로 돌아가기
        </Link>
      ) : null}
    </div>
  );
}
