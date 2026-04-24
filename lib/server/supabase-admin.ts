import "server-only";
import { getSupabaseConfig } from "@/lib/server/auth-config";
import type { SignupPayload } from "@/lib/server/signup-utils";
import {
  SIGNUP_PURPOSE,
  getVerifiedSessionDeadline,
  normalizeEmail,
  normalizePhone,
} from "@/lib/server/signup-utils";

type VerificationRecord = {
  id: string;
  email: string;
  purpose: string;
  code_hash: string;
  attempt_count: number;
  expires_at: string;
  resend_available_at: string;
  verified_at: string | null;
  consumed_at: string | null;
  created_at: string;
  updated_at: string;
};

type ProfileRecord = {
  id: string;
  email: string;
};

function createRestUrl(path: string) {
  const { url } = getSupabaseConfig();
  return new URL(`${url}/rest/v1/${path}`);
}

function createRestHeaders(contentType = true) {
  const { serviceRoleKey, schema } = getSupabaseConfig();

  return {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    "Accept-Profile": schema,
    "Content-Profile": schema,
    ...(contentType ? { "Content-Type": "application/json" } : {}),
  };
}

async function parseJsonResponse(response: Response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function findProfileByEmail(email: string) {
  const normalizedEmail = normalizeEmail(email);
  const url = createRestUrl("profiles");

  url.searchParams.set("select", "id,email");
  url.searchParams.set("email", `eq.${normalizedEmail}`);
  url.searchParams.set("limit", "1");

  const response = await fetch(url, {
    headers: createRestHeaders(false),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("profiles 조회에 실패했습니다.");
  }

  const rows = (await response.json()) as ProfileRecord[];
  return rows[0] ?? null;
}

export async function getLatestVerification(email: string) {
  const normalizedEmail = normalizeEmail(email);
  const url = createRestUrl("email_verifications");

  url.searchParams.set(
    "select",
    "id,email,purpose,code_hash,attempt_count,expires_at,resend_available_at,verified_at,consumed_at,created_at,updated_at",
  );
  url.searchParams.set("email", `eq.${normalizedEmail}`);
  url.searchParams.set("purpose", `eq.${SIGNUP_PURPOSE}`);
  url.searchParams.set("order", "created_at.desc");
  url.searchParams.set("limit", "1");

  const response = await fetch(url, {
    headers: createRestHeaders(false),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("이메일 인증 정보 조회에 실패했습니다.");
  }

  const rows = (await response.json()) as VerificationRecord[];
  return rows[0] ?? null;
}

export async function insertVerification(input: {
  email: string;
  codeHash: string;
  expiresAt: Date;
  resendAvailableAt: Date;
}) {
  const url = createRestUrl("email_verifications");
  const response = await fetch(url, {
    method: "POST",
    headers: {
      ...createRestHeaders(),
      Prefer: "return=representation",
    },
    body: JSON.stringify({
      email: normalizeEmail(input.email),
      purpose: SIGNUP_PURPOSE,
      code_hash: input.codeHash,
      expires_at: input.expiresAt.toISOString(),
      resend_available_at: input.resendAvailableAt.toISOString(),
      attempt_count: 0,
    }),
  });

  if (!response.ok) {
    throw new Error("이메일 인증 정보 저장에 실패했습니다.");
  }

  const rows = (await response.json()) as VerificationRecord[];
  return rows[0];
}

export async function updateVerification(
  id: string,
  patch: Partial<Pick<VerificationRecord, "attempt_count" | "verified_at" | "consumed_at">>,
) {
  const url = createRestUrl("email_verifications");
  url.searchParams.set("id", `eq.${id}`);

  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      ...createRestHeaders(),
      Prefer: "return=representation",
    },
    body: JSON.stringify({
      ...patch,
      updated_at: new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    throw new Error("이메일 인증 정보 갱신에 실패했습니다.");
  }

  const rows = (await response.json()) as VerificationRecord[];
  return rows[0] ?? null;
}

export async function createAuthUser(payload: SignupPayload) {
  const { url, serviceRoleKey } = getSupabaseConfig();
  const response = await fetch(`${url}/auth/v1/admin/users`, {
    method: "POST",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: normalizeEmail(payload.email),
      password: payload.password,
      email_confirm: true,
      user_metadata: {
        user_name: payload.userName.trim(),
        phone: normalizePhone(payload.phone),
        sms_agree: payload.smsAgree,
        email_agree: payload.emailAgree,
      },
    }),
  });

  const body = await parseJsonResponse(response);

  if (!response.ok) {
    const message =
      typeof body === "object" &&
      body &&
      "msg" in body &&
      typeof body.msg === "string"
        ? body.msg
        : "회원 계정 생성에 실패했습니다.";

    throw new Error(message);
  }

  if (!body || typeof body !== "object" || !("user" in body)) {
    throw new Error("Supabase 사용자 생성 응답이 올바르지 않습니다.");
  }

  const user = body.user as { id: string; email: string };
  return user;
}

export async function insertProfile(input: {
  id: string;
  email: string;
  userName: string;
  phone: string;
  smsAgree: boolean;
  emailAgree: boolean;
}) {
  const url = createRestUrl("profiles");
  const response = await fetch(url, {
    method: "POST",
    headers: {
      ...createRestHeaders(),
      Prefer: "return=representation",
    },
    body: JSON.stringify({
      id: input.id,
      email: normalizeEmail(input.email),
      user_name: input.userName.trim(),
      phone: normalizePhone(input.phone),
      sms_agree: input.smsAgree,
      email_agree: input.emailAgree,
      oauth_type: null,
      oauth_key: null,
    }),
  });

  if (!response.ok) {
    throw new Error("profiles 저장에 실패했습니다.");
  }

  return response.json();
}

export async function deleteAuthUser(userId: string) {
  const { url, serviceRoleKey } = getSupabaseConfig();

  await fetch(`${url}/auth/v1/admin/users/${userId}`, {
    method: "DELETE",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
    },
  });
}

export async function assertVerifiedSignupEmail(email: string) {
  const latest = await getLatestVerification(email);

  if (!latest) {
    throw new Error("이메일 인증을 먼저 진행해주세요.");
  }

  if (latest.consumed_at) {
    throw new Error("이미 사용된 인증 정보입니다. 다시 인증을 진행해주세요.");
  }

  if (!latest.verified_at) {
    throw new Error("이메일 인증을 완료해주세요.");
  }

  if (new Date(latest.expires_at).getTime() < Date.now()) {
    throw new Error("인증번호가 만료되었습니다. 다시 요청해주세요.");
  }

  if (new Date(latest.verified_at).getTime() < getVerifiedSessionDeadline().getTime()) {
    throw new Error("인증 완료 시간이 지나 다시 인증이 필요합니다.");
  }

  return latest;
}
