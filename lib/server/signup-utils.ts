import "server-only";
import { createHash, randomInt } from "crypto";

export const SIGNUP_PURPOSE = "signup";
export const VERIFICATION_CODE_LENGTH = 6;
export const VERIFICATION_EXPIRES_MINUTES = 5;
export const VERIFICATION_RESEND_SECONDS = 60;
export const VERIFICATION_MAX_ATTEMPTS = 5;
export const VERIFIED_SESSION_MINUTES = 30;

export type SignupPayload = {
  email: string;
  password: string;
  confirmPassword: string;
  userName: string;
  phone: string;
  termsAccepted: boolean;
  privacyAccepted: boolean;
  marketingAccepted: boolean;
  smsAgree: boolean;
  emailAgree: boolean;
};

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function normalizePhone(phone: string) {
  return phone.replace(/\D/g, "");
}

export function formatPhone(phone: string) {
  const digits = normalizePhone(phone);

  if (digits.length === 11) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  }

  if (digits.length === 10) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  return phone;
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPhone(phone: string) {
  return /^01\d{8,9}$/.test(normalizePhone(phone));
}

export function isValidPassword(password: string) {
  return password.length >= 8 && password.length <= 72;
}

export function createVerificationCode() {
  const min = 10 ** (VERIFICATION_CODE_LENGTH - 1);
  const max = 10 ** VERIFICATION_CODE_LENGTH;

  return String(randomInt(min, max));
}

export function hashVerificationCode(email: string, code: string) {
  return createHash("sha256")
    .update(`${normalizeEmail(email)}:${code}`)
    .digest("hex");
}

export function buildVerificationEmailHtml(code: string) {
  return `
    <div style="max-width:640px;margin:0 auto;padding:32px 16px 36px;background:#fafcf7;">
      <div style="padding-bottom:18px;border-bottom:2px solid #173B2A;">
        <div style="font-size:24px;font-weight:800;color:#173B2A;">비영리민간단체 자람</div>
      </div>
      <p style="margin:40px 0 12px;font-size:28px;line-height:1.4;font-weight:800;color:#173B2A;">이메일 인증번호를 확인해주세요.</p>
      <p style="margin:0;font-size:16px;line-height:1.7;color:#3f4b43;">아래 인증번호 6자리를 회원가입 화면에 입력하면 인증이 완료됩니다. 인증번호는 5분 동안만 유효합니다.</p>
      <div style="margin-top:28px;padding:22px;border:1px solid #d8e5d8;border-radius:16px;background:#ffffff;">
        <div style="font-size:13px;font-weight:700;letter-spacing:0.08em;color:#647067;">VERIFICATION CODE</div>
        <div style="margin-top:10px;font-size:34px;font-weight:800;letter-spacing:0.18em;color:#2F7D4E;">${code}</div>
      </div>
      <p style="margin:28px 0 0;font-size:13px;line-height:1.7;color:#647067;">본 메일은 발신전용입니다. 요청하지 않은 인증 메일이라면 이 메일을 무시하시면 됩니다.</p>
    </div>
  `;
}

export function getExpiryDate() {
  return new Date(Date.now() + VERIFICATION_EXPIRES_MINUTES * 60 * 1000);
}

export function getResendAvailableDate() {
  return new Date(Date.now() + VERIFICATION_RESEND_SECONDS * 1000);
}

export function getVerifiedSessionDeadline() {
  return new Date(Date.now() - VERIFIED_SESSION_MINUTES * 60 * 1000);
}

export function validateSignupPayload(payload: SignupPayload) {
  const email = normalizeEmail(payload.email);
  const phone = normalizePhone(payload.phone);
  const userName = payload.userName.trim();

  if (!userName) {
    return "이름을 입력해주세요.";
  }

  if (!isValidEmail(email)) {
    return "올바른 이메일 형식을 입력해주세요.";
  }

  if (!isValidPhone(phone)) {
    return "연락처는 휴대전화 번호 형식으로 입력해주세요.";
  }

  if (!isValidPassword(payload.password)) {
    return "비밀번호는 8자 이상으로 입력해주세요.";
  }

  if (payload.password !== payload.confirmPassword) {
    return "비밀번호가 일치하지 않습니다.";
  }

  if (!payload.privacyAccepted || !payload.termsAccepted) {
    return "필수 약관에 동의해주세요.";
  }

  return null;
}
