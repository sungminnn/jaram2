"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, KeyRound, Mail, X } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isRecoveryOpen, setIsRecoveryOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingRecovery, setIsSendingRecovery] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submitLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(data.message ?? "로그인에 실패했습니다.");
      }

      setMessage(data.message ?? "로그인되었습니다.");
      router.push("/");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "로그인에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function sendRecovery(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setIsSendingRecovery(true);

    try {
      const response = await fetch("/api/auth/password/recovery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: recoveryEmail || email }),
      });
      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(data.message ?? "비밀번호 재설정 메일 발송에 실패했습니다.");
      }

      setMessage(data.message ?? "비밀번호 재설정 메일을 발송했습니다.");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "비밀번호 재설정 메일 발송에 실패했습니다.",
      );
    } finally {
      setIsSendingRecovery(false);
    }
  }

  return (
    <div className="grid gap-6 rounded-lg border border-forest/10 bg-white p-6 shadow-soft sm:p-8">
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
        <p className="text-sm font-bold tracking-[0.18em] text-leaf">LOGIN</p>
        <h1 className="text-3xl font-bold text-forest sm:text-4xl">로그인</h1>
      </div>

      <form onSubmit={submitLogin} className="grid gap-4">
        <label className="grid gap-2 text-sm font-semibold text-forest">
          이메일
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-2xl border border-forest/12 bg-cream px-4 py-3 pl-11 text-base font-medium text-ink outline-none transition focus:border-leaf"
              placeholder="gildong@email.com"
            />
          </div>
        </label>

        <label className="grid gap-2 text-sm font-semibold text-forest">
          비밀번호
          <div className="relative">
            <KeyRound className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input
              required
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-2xl border border-forest/12 bg-cream px-4 py-3 pl-11 pr-12 text-base font-medium text-ink outline-none transition focus:border-leaf"
              placeholder="비밀번호"
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

        <div className="flex items-center justify-between gap-3 text-sm">
          <button
            type="button"
            onClick={() => {
              setRecoveryEmail(email);
              setIsRecoveryOpen((current) => !current);
            }}
            className="font-bold text-leaf underline underline-offset-4"
          >
            비밀번호 재설정
          </button>
          <Link href="/signup" className="font-bold text-forest underline underline-offset-4">
            회원가입
          </Link>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="focus-ring mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-forest px-6 py-4 text-base font-bold text-white transition hover:bg-leaf disabled:cursor-not-allowed disabled:bg-forest/45"
        >
          {isSubmitting ? "로그인 중..." : "로그인"}
          <ArrowRight className="size-5" aria-hidden="true" />
        </button>
      </form>

      {isRecoveryOpen ? (
        <form onSubmit={sendRecovery} className="grid gap-3 rounded-lg border border-leaf/15 bg-mint/60 p-4">
          <label className="grid gap-2 text-sm font-semibold text-forest">
            재설정 메일 받을 이메일
            <input
              required
              type="email"
              value={recoveryEmail}
              onChange={(event) => setRecoveryEmail(event.target.value)}
              className="rounded-lg border border-forest/12 bg-white px-4 py-3 text-base font-medium text-ink outline-none transition focus:border-leaf"
              placeholder="gildong@email.com"
            />
          </label>
          <button
            type="submit"
            disabled={isSendingRecovery}
            className="focus-ring rounded-lg border border-leaf/22 bg-white px-4 py-3 text-sm font-bold text-forest transition hover:border-leaf hover:bg-mint disabled:cursor-not-allowed disabled:border-forest/10 disabled:bg-cream disabled:text-muted"
          >
            {isSendingRecovery ? "발송 중..." : "재설정 메일 발송"}
          </button>
        </form>
      ) : null}
    </div>
  );
}
