"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, Eye, EyeOff, MailCheck, ShieldCheck, X } from "lucide-react";
import { signupPolicies } from "@/content/signup";

type FormState = {
  userName: string;
  email: string;
  code: string;
  phone: string;
  password: string;
  confirmPassword: string;
  privacyAccepted: boolean;
  termsAccepted: boolean;
  marketingAccepted: boolean;
  smsAgree: boolean;
  emailAgree: boolean;
};

const initialState: FormState = {
  userName: "",
  email: "",
  code: "",
  phone: "",
  password: "",
  confirmPassword: "",
  privacyAccepted: false,
  termsAccepted: false,
  marketingAccepted: false,
  smsAgree: false,
  emailAgree: false,
};

function normalizePhoneInput(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 3) {
    return digits;
  }

  if (digits.length <= 7) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  }

  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

export function SignupForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialState);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [debugCode, setDebugCode] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!expiresAt || isEmailVerified) {
      setRemainingSeconds(null);
      return;
    }

    const updateRemaining = () => {
      const seconds = Math.max(
        0,
        Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000),
      );
      setRemainingSeconds(seconds);
    };

    updateRemaining();
    const timer = window.setInterval(updateRemaining, 1000);

    return () => window.clearInterval(timer);
  }, [expiresAt, isEmailVerified]);

  useEffect(() => {
    if (!message && !error) {
      return;
    }

    const timer = window.setTimeout(() => {
      setMessage(null);
      setError(null);
    }, 5000);

    return () => window.clearTimeout(timer);
  }, [message, error]);

  function resetEmailVerification(nextEmail?: string) {
    setIsEmailVerified(false);
    setIsCodeSent(false);
    setDebugCode(null);
    setExpiresAt(null);
    setRemainingSeconds(null);
    setForm((current) => ({
      ...current,
      email: nextEmail ?? current.email,
      code: "",
    }));
  }

  function unlockEmail() {
    setIsEmailVerified(false);
    setIsCodeSent(false);
    setMessage(null);
    setError(null);
    setDebugCode(null);
    setExpiresAt(null);
    setRemainingSeconds(null);
    setForm((current) => ({
      ...current,
      code: "",
    }));
  }

  async function sendCode() {
    setError(null);
    setMessage(null);
    setIsSendingCode(true);

    try {
      const response = await fetch("/api/auth/email/send-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: form.email }),
      });

      const data = (await response.json()) as {
        message?: string;
        debugCode?: string;
        expiresAt?: string;
      };

      if (!response.ok) {
        throw new Error(data.message ?? "인증번호 발송에 실패했습니다.");
      }

      setIsCodeSent(true);
      setIsEmailVerified(false);
      setDebugCode(data.debugCode ?? null);
      setExpiresAt(data.expiresAt ?? null);
      setMessage(data.message ?? "인증번호를 발송했습니다.");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "인증번호 발송에 실패했습니다.",
      );
    } finally {
      setIsSendingCode(false);
    }
  }

  async function verifyCode() {
    setError(null);
    setMessage(null);
    setIsVerifyingCode(true);

    try {
      const response = await fetch("/api/auth/email/verify-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          code: form.code,
        }),
      });

      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(data.message ?? "이메일 인증에 실패했습니다.");
      }

      setIsEmailVerified(true);
      setDebugCode(null);
      setMessage(data.message ?? "이메일 인증이 완료되었습니다.");
    } catch (requestError) {
      setIsEmailVerified(false);
      setError(
        requestError instanceof Error
          ? requestError.message
          : "이메일 인증에 실패했습니다.",
      );
    } finally {
      setIsVerifyingCode(false);
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (!isEmailVerified) {
      setError("이메일 인증을 먼저 완료해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: form.userName,
          email: form.email,
          phone: form.phone,
          password: form.password,
          confirmPassword: form.confirmPassword,
          privacyAccepted: form.privacyAccepted,
          termsAccepted: form.termsAccepted,
          marketingAccepted: form.marketingAccepted,
          smsAgree: form.smsAgree,
          emailAgree: form.emailAgree,
        }),
      });

      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(data.message ?? "회원가입에 실패했습니다.");
      }

      setForm(initialState);
      setIsCodeSent(false);
      setIsEmailVerified(false);
      setDebugCode(null);
      setExpiresAt(null);
      setRemainingSeconds(null);
      setMessage(data.message ?? "회원가입이 완료되었습니다.");
      router.push("/");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "회원가입에 실패했습니다.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const isExpired = remainingSeconds !== null && remainingSeconds <= 0;
  const remainingMinutes = remainingSeconds !== null ? Math.floor(remainingSeconds / 60) : 0;
  const remainingDisplaySeconds = remainingSeconds !== null ? remainingSeconds % 60 : 0;

  return (
    <>
      {error ? (
        <div className="fixed inset-x-0 top-24 z-[130] flex justify-center px-4">
          <div className="flex w-full max-w-lg items-start justify-between gap-4 rounded-2xl border border-[#f2b1a8] bg-[#fff4f1] px-5 py-4 text-sm font-semibold text-[#a13a29] shadow-soft">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setError(null)}
              className="shrink-0 text-[#a13a29]"
              aria-label="오류 메시지 닫기"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      ) : null}

      {message ? (
        <div className="fixed inset-x-0 top-24 z-[130] flex justify-center px-4">
          <div className="flex w-full max-w-lg items-start justify-between gap-4 rounded-2xl border border-[#c9e7bf] bg-[#f5fff2] px-5 py-4 text-sm font-semibold text-[#25653f] shadow-soft">
            <span>{message}</span>
            <button
              type="button"
              onClick={() => setMessage(null)}
              className="shrink-0 text-[#25653f]"
              aria-label="안내 메시지 닫기"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="grid gap-6">
        <div className="grid gap-6 rounded-[2rem] border border-forest/10 bg-white p-6 shadow-soft sm:p-8">
        <div className="grid gap-2">
          <p className="text-sm font-bold tracking-[0.18em] text-leaf">SIGN UP</p>
          <h2 className="text-3xl font-bold text-forest sm:text-4xl">회원가입</h2>
          <p className="text-sm leading-7 text-muted sm:text-base">
            가입에 필요한 기본 정보만 입력해주세요. 이메일 인증이 완료되면 계정이 생성됩니다.
          </p>
        </div>

        <label className="grid gap-2 text-sm font-semibold text-forest">
          이름
          <input
            required
            value={form.userName}
            onChange={(event) =>
              setForm((current) => ({ ...current, userName: event.target.value }))
            }
            className="rounded-2xl border border-forest/12 bg-cream px-4 py-3 text-base font-medium text-ink outline-none transition focus:border-leaf"
            placeholder="홍길동"
          />
        </label>

        <div className="grid gap-3">
          <label className="grid gap-2 text-sm font-semibold text-forest">
            이메일
            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_9rem]">
              <input
                required
                type="email"
                value={form.email}
                onChange={(event) => {
                  const nextEmail = event.target.value;
                  resetEmailVerification(nextEmail);
                }}
                className="rounded-2xl border border-forest/12 bg-cream px-4 py-3 text-base font-medium text-ink outline-none transition focus:border-leaf"
                placeholder="gildong@email.com"
                disabled={isCodeSent}
              />
              <button
                type="button"
                onClick={sendCode}
                disabled={isSendingCode || !form.email || isCodeSent}
                className="focus-ring rounded-2xl bg-forest px-4 py-3 text-sm font-bold text-white transition hover:bg-leaf disabled:cursor-not-allowed disabled:bg-forest/45"
              >
                {isEmailVerified
                  ? "인증완료"
                  : isSendingCode
                    ? "발송 중..."
                    : "인증번호 발송"}
              </button>
            </div>
          </label>

          {isCodeSent && !isEmailVerified ? (
            <div className="grid gap-3 rounded-2xl border border-leaf/15 bg-mint/60 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-forest">
                  인증번호를 발송했습니다. 메일을 확인한 뒤 아래에 입력해주세요.
                </p>
                {!isEmailVerified ? (
                  <button
                    type="button"
                    onClick={unlockEmail}
                    className="text-sm font-bold text-leaf underline underline-offset-4"
                  >
                    이메일 변경
                  </button>
                ) : null}
              </div>

              {debugCode ? (
                <p className="rounded-xl border border-amber/35 bg-white px-4 py-3 text-sm font-semibold text-forest">
                  개발환경 인증번호: <span className="font-bold tracking-[0.24em]">{debugCode}</span>
                </p>
              ) : null}

              <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_8rem]">
                <input
                  value={form.code}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      code: event.target.value.replace(/\D/g, "").slice(0, 6),
                    }))
                  }
                  className="rounded-2xl border border-forest/12 bg-white px-4 py-3 text-base font-medium text-ink outline-none transition focus:border-leaf"
                  placeholder="인증번호 6자리"
                  inputMode="numeric"
                  disabled={isEmailVerified}
                />
                <button
                  type="button"
                  onClick={verifyCode}
                  disabled={
                    isVerifyingCode || form.code.length !== 6 || isEmailVerified || isExpired
                  }
                  className="focus-ring rounded-2xl border border-leaf/22 bg-white px-4 py-3 text-sm font-bold text-forest transition hover:border-leaf hover:bg-mint disabled:cursor-not-allowed disabled:border-forest/10 disabled:bg-cream disabled:text-muted"
                >
                  {isVerifyingCode ? "확인 중..." : isEmailVerified ? "인증 완료" : "인증 확인"}
                </button>
              </div>

              <div className="text-sm font-medium text-muted">
                {isExpired ? (
                  <span className="text-[#a13a29]">인증 시간이 만료되었습니다. 이메일을 다시 입력해 재발송해주세요.</span>
                ) : remainingSeconds !== null ? (
                  <span>
                    남은 시간 {remainingMinutes}:{String(remainingDisplaySeconds).padStart(2, "0")}
                  </span>
                ) : null}
              </div>
            </div>
          ) : null}

          <div className="flex items-center gap-2 text-sm font-medium text-muted">
            {isEmailVerified ? (
              <>
                <CheckCircle2 className="size-4 text-leaf" aria-hidden="true" />
                이메일 인증이 완료되었습니다.
              </>
            ) : (
              <>
                <MailCheck className="size-4 text-leaf" aria-hidden="true" />
                인증번호는 5분 동안 유효합니다.
              </>
            )}
          </div>
        </div>

        <label className="grid gap-2 text-sm font-semibold text-forest">
          연락처
          <input
            required
            value={form.phone}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                phone: normalizePhoneInput(event.target.value),
              }))
            }
            className="rounded-2xl border border-forest/12 bg-cream px-4 py-3 text-base font-medium text-ink outline-none transition focus:border-leaf"
            placeholder="010-1234-5678"
            inputMode="numeric"
          />
        </label>

        <label className="grid gap-2 text-sm font-semibold text-forest">
          비밀번호
          <div className="relative">
            <input
              required
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(event) =>
                setForm((current) => ({ ...current, password: event.target.value }))
              }
              className="w-full rounded-2xl border border-forest/12 bg-cream px-4 py-3 pr-12 text-base font-medium text-ink outline-none transition focus:border-leaf"
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
          비밀번호 확인
          <div className="relative">
            <input
              required
              type={showConfirmPassword ? "text" : "password"}
              value={form.confirmPassword}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  confirmPassword: event.target.value,
                }))
              }
              className="w-full rounded-2xl border border-forest/12 bg-cream px-4 py-3 pr-12 text-base font-medium text-ink outline-none transition focus:border-leaf"
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
        </div>

        <div className="grid gap-5 rounded-[2rem] border border-forest/10 bg-white p-6 shadow-soft sm:p-8">
        <div className="flex items-center gap-2 text-forest">
          <ShieldCheck className="size-5 text-leaf" aria-hidden="true" />
          <h3 className="text-xl font-bold">약관 동의</h3>
        </div>

        <label className="grid gap-3 rounded-2xl border border-forest/10 bg-cream p-5">
          <span className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={form.privacyAccepted}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  privacyAccepted: event.target.checked,
                }))
              }
              className="mt-1 size-4 accent-leaf"
            />
            <span>
              <span className="text-sm font-bold text-forest">
                {signupPolicies.privacy.title} (필수)
              </span>
              <span className="mt-2 block text-sm leading-7 text-muted">
                {signupPolicies.privacy.content}
              </span>
            </span>
          </span>
        </label>

        <label className="grid gap-3 rounded-2xl border border-forest/10 bg-cream p-5">
          <span className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={form.termsAccepted}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  termsAccepted: event.target.checked,
                }))
              }
              className="mt-1 size-4 accent-leaf"
            />
            <span>
              <span className="text-sm font-bold text-forest">
                {signupPolicies.terms.title} (필수)
              </span>
              <span className="mt-2 block text-sm leading-7 text-muted">
                {signupPolicies.terms.content}
              </span>
            </span>
          </span>
        </label>

        <label className="grid gap-3 rounded-2xl border border-forest/10 bg-cream p-5">
          <span className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={form.marketingAccepted}
              onChange={(event) => {
                const checked = event.target.checked;
                setForm((current) => ({
                  ...current,
                  marketingAccepted: checked,
                  smsAgree: checked ? current.smsAgree : false,
                  emailAgree: checked ? current.emailAgree : false,
                }));
              }}
              className="mt-1 size-4 accent-leaf"
            />
            <span>
              <span className="text-sm font-bold text-forest">
                {signupPolicies.marketing.title} (선택)
              </span>
              <span className="mt-2 block text-sm leading-7 text-muted">
                {signupPolicies.marketing.content}
              </span>
            </span>
          </span>
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex items-center gap-3 rounded-2xl border border-forest/10 px-4 py-4 text-sm font-semibold text-forest">
            <input
              type="checkbox"
              checked={form.emailAgree}
              disabled={!form.marketingAccepted}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  emailAgree: event.target.checked,
                }))
              }
              className="size-4 accent-leaf"
            />
            이메일 수신 동의
          </label>
          <label className="flex items-center gap-3 rounded-2xl border border-forest/10 px-4 py-4 text-sm font-semibold text-forest">
            <input
              type="checkbox"
              checked={form.smsAgree}
              disabled={!form.marketingAccepted}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  smsAgree: event.target.checked,
                }))
              }
              className="size-4 accent-leaf"
            />
            SMS 수신 동의
          </label>
        </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="focus-ring inline-flex items-center justify-center gap-2 rounded-2xl bg-forest px-6 py-4 text-base font-bold text-white transition hover:bg-leaf disabled:cursor-not-allowed disabled:bg-forest/45"
        >
          {isSubmitting ? "가입 처리 중..." : "회원가입"}
          <ArrowRight className="size-5" aria-hidden="true" />
        </button>
      </form>
    </>
  );
}
