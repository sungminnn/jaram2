import "server-only";
import { createHash, randomUUID } from "crypto";
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
  user_name?: string | null;
  role?: "user" | "admin" | null;
};

type AuthUserRecord = {
  id: string;
  email?: string;
  user_metadata?: {
    user_name?: string;
  };
};

type AuthUsersResponse = {
  users?: AuthUserRecord[];
};

type PostRow = {
  id: number;
  page: string;
  content: string | null;
  password: string | null;
  author_id: string | null;
  author_name: string | null;
  is_private: boolean;
  is_deleted: boolean;
};

type FileInfoRow = {
  id: number;
  post_id: number | null;
  stored_file_name: string;
  original_file_name?: string | null;
  file_size?: number | string | null;
  created_at?: string | null;
};

type CommentRow = {
  id: number;
  post_id: number;
  content: string;
  is_private: boolean;
  is_deleted: boolean;
  author_id: string;
  author_name: string;
  created_at: string;
  updated_at: string | null;
};

export type PostComment = {
  id: string;
  postId: string;
  content: string;
  isPrivate: boolean;
  isMine: boolean;
  canDelete: boolean;
  authorName: string;
  createdAt: string;
};

export type PasswordSession = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  user?: AuthUserRecord;
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

function buildSupabaseErrorMessage(prefix: string, body: unknown) {
  if (typeof body === "string" && body.trim()) {
    return `${prefix}: ${body}`;
  }

  if (body && typeof body === "object") {
    if ("message" in body && typeof body.message === "string") {
      return `${prefix}: ${body.message}`;
    }

    if ("error" in body && typeof body.error === "string") {
      return `${prefix}: ${body.error}`;
    }

    if ("hint" in body && typeof body.hint === "string") {
      return `${prefix}: ${body.hint}`;
    }
  }

  return prefix;
}

function getAuthUserRows(body: unknown) {
  if (Array.isArray(body)) {
    return body as AuthUserRecord[];
  }

  if (body && typeof body === "object" && "users" in body && Array.isArray(body.users)) {
    return (body as AuthUsersResponse).users ?? [];
  }

  return [];
}

function isAlreadyRegisteredMessage(message: string) {
  return /already been registered|already registered|already exists/i.test(message);
}

function isPasswordReuseMessage(message: string) {
  return /same password|different password|previous password|already used|reuse/i.test(message);
}

function isInvalidLoginMessage(message: string) {
  return /invalid login credentials|invalid credentials|invalid email or password/i.test(message);
}

function hashGuestPassword(password: string) {
  return createHash("sha256").update(`post:${password}`).digest("hex");
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function textToHtml(value: string) {
  if (/<[a-z][\s\S]*>/i.test(value)) {
    return sanitizeHtml(value);
  }

  return value
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, "<br />")}</p>`)
    .join("");
}

function sanitizeHtml(value: string) {
  return value
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/\s+on[a-z]+\s*=\s*(['"]).*?\1/gi, "")
    .replace(/\s+on[a-z]+\s*=\s*[^\s>]+/gi, "")
    .replace(/\s+(href|src)\s*=\s*(['"])\s*javascript:[\s\S]*?\2/gi, "")
    .trim();
}

function storageDateFolder(date = new Date()) {
  return `${String(date.getFullYear()).slice(2)}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
}

function editorImageDateFolder(date = new Date()) {
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`;
}

function sanitizeFileName(name: string) {
  return name.replace(/[^\w.\-가-힣]/g, "_").slice(0, 120) || "attachment";
}

function encodeStoragePath(path: string) {
  return path
    .replace(/\\/g, "/")
    .replace(/^\/+/, "")
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

function formatFileSize(value: unknown) {
  const size = typeof value === "number" ? value : typeof value === "string" ? Number(value) : 0;

  if (!Number.isFinite(size) || size <= 0) {
    return "";
  }

  if (size < 1024 * 1024) {
    return `${Math.round(size / 1024)}KB`;
  }

  return `${(size / 1024 / 1024).toFixed(1)}MB`;
}

function storageFolderFromDate(value: unknown) {
  if (typeof value !== "string") {
    return undefined;
  }

  const dateParts = value.match(/^(\d{4})-(\d{2})-(\d{2})/);

  if (dateParts) {
    return `${dateParts[1].slice(2)}${dateParts[2]}${dateParts[3]}`;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  return storageDateFolder(date);
}

function resolveAttachmentPath(storedName: string, createdAt: unknown) {
  const normalizedName = storedName.replace(/\\/g, "/").replace(/^\/+/, "");

  if (normalizedName.startsWith("attachment/")) {
    return normalizedName.replace(/^attachment\//, "");
  }

  if (normalizedName.startsWith("uploadfile/")) {
    return normalizedName;
  }

  if (normalizedName.includes("/")) {
    return `uploadfile/${normalizedName}`;
  }

  const folder = storageFolderFromDate(createdAt);

  return folder ? `uploadfile/${folder}/${normalizedName}` : `uploadfile/${normalizedName}`;
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
    const body = await parseJsonResponse(response);
    throw new Error(buildSupabaseErrorMessage("profiles 조회에 실패했습니다", body));
  }

  const rows = (await response.json()) as ProfileRecord[];
  return rows[0] ?? null;
}

export async function findProfileById(id: string) {
  const url = createRestUrl("profiles");

  url.searchParams.set("select", "id,email,user_name,role");
  url.searchParams.set("id", `eq.${id}`);
  url.searchParams.set("limit", "1");

  const response = await fetch(url, {
    headers: createRestHeaders(false),
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await parseJsonResponse(response);
    throw new Error(buildSupabaseErrorMessage("profiles 조회에 실패했습니다", body));
  }

  const rows = (await response.json()) as ProfileRecord[];
  return rows[0] ?? null;
}

export async function findAuthUserByEmail(email: string) {
  const normalizedEmail = normalizeEmail(email);
  const { url, serviceRoleKey } = getSupabaseConfig();
  const perPage = 1000;

  for (let page = 1; page <= 10; page += 1) {
    const requestUrl = new URL(`${url}/auth/v1/admin/users`);
    requestUrl.searchParams.set("page", String(page));
    requestUrl.searchParams.set("per_page", String(perPage));

    const response = await fetch(requestUrl, {
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
      cache: "no-store",
    });

    const body = await parseJsonResponse(response);

    if (!response.ok) {
      throw new Error(buildSupabaseErrorMessage("Auth 사용자 조회에 실패했습니다", body));
    }

    const users = getAuthUserRows(body);
    const matchedUser = users.find((user) => normalizeEmail(user.email ?? "") === normalizedEmail);

    if (matchedUser) {
      return matchedUser;
    }

    if (users.length < perPage) {
      return null;
    }
  }

  return null;
}

export async function assertSignupEmailAvailable(email: string) {
  const existingProfile = await findProfileByEmail(email);

  if (existingProfile) {
    throw new Error("이미 가입된 이메일 계정입니다.");
  }

  const existingAuthUser = await findAuthUserByEmail(email);

  if (existingAuthUser) {
    throw new Error("이미 가입된 이메일 계정입니다.");
  }
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
    const body = await parseJsonResponse(response);
    throw new Error(buildSupabaseErrorMessage("이메일 인증 정보 조회에 실패했습니다", body));
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
    const body = await parseJsonResponse(response);
    throw new Error(buildSupabaseErrorMessage("이메일 인증 정보 저장에 실패했습니다", body));
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
    const body = await parseJsonResponse(response);
    throw new Error(buildSupabaseErrorMessage("이메일 인증 정보 갱신에 실패했습니다", body));
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
        : buildSupabaseErrorMessage("회원 계정 생성에 실패했습니다", body);

    if (isAlreadyRegisteredMessage(message)) {
      throw new Error("이미 가입된 이메일 계정입니다.");
    }

    throw new Error(message);
  }

  if (!body || typeof body !== "object") {
    throw new Error("Supabase 사용자 생성 응답이 올바르지 않습니다.");
  }

  const user =
    "user" in body && body.user && typeof body.user === "object"
      ? (body.user as AuthUserRecord)
      : "id" in body && typeof body.id === "string"
        ? (body as AuthUserRecord)
        : null;

  if (!user?.id) {
    throw new Error("Supabase 사용자 생성 응답에 사용자 ID가 없습니다.");
  }

  return user;
}

export async function signInWithPassword(input: { email: string; password: string }) {
  const { url, publishableKey } = getSupabaseConfig();
  const response = await fetch(`${url}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: {
      apikey: publishableKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: normalizeEmail(input.email),
      password: input.password,
    }),
  });

  const body = await parseJsonResponse(response);

  if (!response.ok) {
    const message = buildSupabaseErrorMessage("로그인에 실패했습니다", body);

    if (isInvalidLoginMessage(message)) {
      throw new Error("비밀번호가 틀렸습니다.");
    }

    throw new Error(message);
  }

  if (!body || typeof body !== "object" || !("access_token" in body)) {
    throw new Error("로그인 응답이 올바르지 않습니다.");
  }

  return body as PasswordSession;
}

export async function getAuthUser(accessToken: string) {
  const { url, publishableKey } = getSupabaseConfig();
  const response = await fetch(`${url}/auth/v1/user`, {
    headers: {
      apikey: publishableKey,
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  const body = await parseJsonResponse(response);

  if (!response.ok) {
    return null;
  }

  if (!body || typeof body !== "object" || !("id" in body) || typeof body.id !== "string") {
    return null;
  }

  return body as AuthUserRecord;
}

export async function sendPasswordRecoveryEmail(input: {
  email: string;
  redirectTo: string;
}) {
  const { url, publishableKey } = getSupabaseConfig();
  const requestUrl = new URL(`${url}/auth/v1/recover`);
  requestUrl.searchParams.set("redirect_to", input.redirectTo);

  const response = await fetch(requestUrl, {
    method: "POST",
    headers: {
      apikey: publishableKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: normalizeEmail(input.email),
      redirect_to: input.redirectTo,
    }),
  });

  const body = await parseJsonResponse(response);

  if (!response.ok) {
    throw new Error(buildSupabaseErrorMessage("비밀번호 재설정 메일 발송에 실패했습니다", body));
  }
}

export async function updateAuthUserPassword(input: {
  accessToken: string;
  password: string;
}) {
  const { url, publishableKey } = getSupabaseConfig();
  const response = await fetch(`${url}/auth/v1/user`, {
    method: "PUT",
    headers: {
      apikey: publishableKey,
      Authorization: `Bearer ${input.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      password: input.password,
    }),
  });

  const body = await parseJsonResponse(response);

  if (!response.ok) {
    const message = buildSupabaseErrorMessage("비밀번호 변경에 실패했습니다", body);

    if (isPasswordReuseMessage(message)) {
      throw new Error("이전 비밀번호로 변경할 수 없습니다.");
    }

    throw new Error(message);
  }
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
    const body = await parseJsonResponse(response);
    throw new Error(buildSupabaseErrorMessage("profiles 저장에 실패했습니다", body));
  }

  return response.json();
}

export function getPostPageForCategory(category: string) {
  const pages: Record<string, string> = {
    notices: "notice",
    stories: "news",
    gallery: "gallery",
    qna: "qna",
  };

  return pages[category] ?? null;
}

export function getGuestPostPasswordHash(password: string) {
  return hashGuestPassword(password);
}

export function verifyGuestPostPassword(password: string, hash: string | null) {
  return Boolean(password && hash && hashGuestPassword(password) === hash);
}

export async function findPostById(id: string) {
  const url = createRestUrl("posts");

  url.searchParams.set("select", "id,page,content,password,author_id,author_name,is_private,is_deleted");
  url.searchParams.set("id", `eq.${id}`);
  url.searchParams.set("limit", "1");

  const response = await fetch(url, {
    headers: createRestHeaders(false),
    cache: "no-store",
  });

  const body = await parseJsonResponse(response);

  if (!response.ok) {
    throw new Error(buildSupabaseErrorMessage("게시글 조회에 실패했습니다", body));
  }

  const rows = body as PostRow[] | null;
  return rows?.[0] ?? null;
}

export async function insertPost(input: {
  title: string;
  subTitle?: string | null;
  content: string;
  page: string;
  authorId: string | null;
  authorName: string;
  isPrivate?: boolean;
  mainImageUrl?: string | null;
  passwordHash?: string | null;
}) {
  const url = createRestUrl("posts");
  const now = new Date().toISOString();
  const response = await fetch(url, {
    method: "POST",
    headers: {
      ...createRestHeaders(),
      Prefer: "return=representation",
    },
    body: JSON.stringify({
      title: input.title,
      sub_title: input.subTitle || null,
      content: textToHtml(input.content),
      main_image_url: input.mainImageUrl || null,
      page: input.page,
      author_id: input.authorId,
      author_name: input.authorName,
      password: input.passwordHash ?? null,
      is_private: input.isPrivate ?? false,
      is_deleted: false,
      view_count: 0,
      created_at: now,
      updated_at: now,
    }),
  });

  const body = await parseJsonResponse(response);

  if (!response.ok) {
    throw new Error(buildSupabaseErrorMessage("게시글 저장에 실패했습니다", body));
  }

  const rows = body as Array<{ id: number }> | null;
  const id = rows?.[0]?.id;

  if (!id) {
    throw new Error("게시글 저장 응답이 올바르지 않습니다.");
  }

  return id;
}

export async function updatePost(input: {
  id: string;
  title: string;
  subTitle?: string | null;
  content: string;
  isPrivate?: boolean;
  mainImageUrl?: string | null;
  authorName?: string;
}) {
  const url = createRestUrl("posts");
  url.searchParams.set("id", `eq.${input.id}`);

  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      ...createRestHeaders(),
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      title: input.title,
      sub_title: input.subTitle || null,
      content: textToHtml(input.content),
      ...(input.isPrivate !== undefined ? { is_private: input.isPrivate } : {}),
      ...(input.mainImageUrl !== undefined ? { main_image_url: input.mainImageUrl || null } : {}),
      ...(input.authorName ? { author_name: input.authorName } : {}),
      updated_at: new Date().toISOString(),
    }),
  });

  const body = await parseJsonResponse(response);

  if (!response.ok) {
    throw new Error(buildSupabaseErrorMessage("게시글 수정에 실패했습니다", body));
  }
}

export async function incrementPostViewCount(id: string) {
  const selectUrl = createRestUrl("posts");
  selectUrl.searchParams.set("select", "id,view_count");
  selectUrl.searchParams.set("id", `eq.${id}`);
  selectUrl.searchParams.set("is_deleted", "eq.false");
  selectUrl.searchParams.set("limit", "1");

  const selectResponse = await fetch(selectUrl, {
    headers: createRestHeaders(false),
    cache: "no-store",
  });
  const selectBody = await parseJsonResponse(selectResponse);

  if (!selectResponse.ok) {
    throw new Error(buildSupabaseErrorMessage("조회수 조회에 실패했습니다", selectBody));
  }

  const rows = (selectBody as Array<{ id: number; view_count: number | null }> | null) ?? [];
  const currentPost = rows[0];

  if (!currentPost) {
    throw new Error("게시글을 찾을 수 없습니다.");
  }

  const nextViewCount = (currentPost.view_count ?? 0) + 1;
  const updateUrl = createRestUrl("posts");
  updateUrl.searchParams.set("id", `eq.${id}`);

  const updateResponse = await fetch(updateUrl, {
    method: "PATCH",
    headers: {
      ...createRestHeaders(),
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      view_count: nextViewCount,
    }),
  });
  const updateBody = await parseJsonResponse(updateResponse);

  if (!updateResponse.ok) {
    throw new Error(buildSupabaseErrorMessage("조회수 저장에 실패했습니다", updateBody));
  }

  return nextViewCount;
}

export async function softDeletePost(id: string) {
  const url = createRestUrl("posts");
  url.searchParams.set("id", `eq.${id}`);

  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      ...createRestHeaders(),
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      is_deleted: true,
      updated_at: new Date().toISOString(),
    }),
  });

  const body = await parseJsonResponse(response);

  if (!response.ok) {
    throw new Error(buildSupabaseErrorMessage("게시글 삭제에 실패했습니다", body));
  }
}

function formatCommentDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");

  return `${year}.${month}.${day} ${hour}:${minute}`;
}

export async function listPostComments(input: {
  postId: string;
  viewerId?: string | null;
  viewerRole?: "user" | "admin" | null;
}) {
  const url = createRestUrl("comments");

  url.searchParams.set("select", "id,post_id,content,is_private,is_deleted,author_id,author_name,created_at,updated_at");
  url.searchParams.set("post_id", `eq.${input.postId}`);
  url.searchParams.set("is_deleted", "eq.false");
  url.searchParams.set("order", "created_at.asc");

  const response = await fetch(url, {
    headers: createRestHeaders(false),
    cache: "no-store",
  });
  const body = await parseJsonResponse(response);

  if (!response.ok) {
    throw new Error(buildSupabaseErrorMessage("댓글 조회에 실패했습니다", body));
  }

  const rows = (body as CommentRow[] | null) ?? [];

  return rows.map((row): PostComment => {
    const isMine = Boolean(input.viewerId && row.author_id === input.viewerId);
    const canViewPrivate = !row.is_private || input.viewerRole === "admin" || isMine;
    const canDelete = input.viewerRole === "admin" || isMine;

    return {
      id: String(row.id),
      postId: String(row.post_id),
      content: canViewPrivate ? row.content : "비밀댓글입니다.",
      isPrivate: row.is_private,
      isMine,
      canDelete,
      authorName: row.author_name,
      createdAt: formatCommentDate(row.created_at),
    };
  });
}

export async function insertPostComment(input: {
  postId: string;
  content: string;
  isPrivate: boolean;
  authorId: string;
  authorName: string;
}) {
  const url = createRestUrl("comments");
  const now = new Date().toISOString();
  const response = await fetch(url, {
    method: "POST",
    headers: {
      ...createRestHeaders(),
      Prefer: "return=representation",
    },
    body: JSON.stringify({
      post_id: Number(input.postId),
      content: input.content,
      is_private: input.isPrivate,
      is_deleted: false,
      author_id: input.authorId,
      author_name: input.authorName,
      created_at: now,
      updated_at: now,
    }),
  });
  const body = await parseJsonResponse(response);

  if (!response.ok) {
    throw new Error(buildSupabaseErrorMessage("댓글 저장에 실패했습니다", body));
  }

  const rows = body as Array<{ id: number }> | null;
  return rows?.[0]?.id;
}

export async function findCommentById(id: string) {
  const url = createRestUrl("comments");

  url.searchParams.set("select", "id,post_id,content,is_private,is_deleted,author_id,author_name,created_at,updated_at");
  url.searchParams.set("id", `eq.${id}`);
  url.searchParams.set("limit", "1");

  const response = await fetch(url, {
    headers: createRestHeaders(false),
    cache: "no-store",
  });
  const body = await parseJsonResponse(response);

  if (!response.ok) {
    throw new Error(buildSupabaseErrorMessage("댓글 조회에 실패했습니다", body));
  }

  const rows = body as CommentRow[] | null;
  return rows?.[0] ?? null;
}

export async function softDeleteComment(id: string) {
  const url = createRestUrl("comments");
  url.searchParams.set("id", `eq.${id}`);

  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      ...createRestHeaders(),
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      is_deleted: true,
      updated_at: new Date().toISOString(),
    }),
  });
  const body = await parseJsonResponse(response);

  if (!response.ok) {
    throw new Error(buildSupabaseErrorMessage("댓글 삭제에 실패했습니다", body));
  }
}

export async function uploadPostAttachment(input: {
  postId: number;
  file: File;
  createdBy: string | null;
}) {
  const { url, serviceRoleKey } = getSupabaseConfig();
  const storedPath = `uploadfile/${storageDateFolder()}/${randomUUID()}-${sanitizeFileName(input.file.name)}`;
  const uploadUrl = `${url}/storage/v1/object/attachment/${encodeURIComponent(storedPath).replace(/%2F/g, "/")}`;
  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": input.file.type || "application/octet-stream",
      "x-upsert": "false",
    },
    body: await input.file.arrayBuffer(),
  });

  const uploadBody = await parseJsonResponse(response);

  if (!response.ok) {
    throw new Error(buildSupabaseErrorMessage("첨부파일 업로드에 실패했습니다", uploadBody));
  }

  const fileInfoUrl = createRestUrl("file_info");
  const fileInfoResponse = await fetch(fileInfoUrl, {
    method: "POST",
    headers: {
      ...createRestHeaders(),
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      post_id: input.postId,
      original_file_name: input.file.name,
      stored_file_name: storedPath,
      file_size: input.file.size,
      created_by: input.createdBy,
    }),
  });

  const fileInfoBody = await parseJsonResponse(fileInfoResponse);

  if (!fileInfoResponse.ok) {
    throw new Error(buildSupabaseErrorMessage("첨부파일 정보 저장에 실패했습니다", fileInfoBody));
  }
  return {
    originalName: input.file.name,
    storedPath,
    publicPath: `attachment/${storedPath}`,
    contentType: input.file.type,
  };
}

export async function uploadEditorImage(file: File) {
  if (!file.type.startsWith("image/")) {
    throw new Error("이미지 파일만 업로드할 수 있습니다.");
  }

  const { url, serviceRoleKey } = getSupabaseConfig();
  const publicPath = `${editorImageDateFolder()}/${randomUUID()}-${sanitizeFileName(file.name)}`;
  const storedPath = `ckeditor/upload/${publicPath}`;
  const uploadUrl = `${url}/storage/v1/object/editor-images/${encodeURIComponent(storedPath).replace(/%2F/g, "/")}`;
  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": file.type || "application/octet-stream",
      "x-upsert": "false",
    },
    body: await file.arrayBuffer(),
  });
  const body = await parseJsonResponse(response);

  if (!response.ok) {
    throw new Error(buildSupabaseErrorMessage("에디터 이미지 업로드에 실패했습니다", body));
  }

  return {
    storedPath,
    url: `/ckeditor/upload/${publicPath}`,
  };
}

export function resolveEditorImageStoragePath(path: string) {
  return path.replace(/\\/g, "/").replace(/^\/+/, "");
}

export function editorImageStoragePathCandidates(path: string) {
  const normalizedPath = resolveEditorImageStoragePath(path);
  const withoutLegacyPrefix = normalizedPath.replace(/^ckeditor\/upload\//, "");
  const candidates = [
    normalizedPath,
    `ckeditor/upload/${withoutLegacyPrefix}`,
    withoutLegacyPrefix,
  ];

  return Array.from(new Set(candidates.filter(Boolean)));
}

export function editorImagePublicUrl(path: string) {
  const { url } = getSupabaseConfig();
  const storagePath = editorImageStoragePathCandidates(path)[0];

  return `${url}/storage/v1/object/public/editor-images/${encodeStoragePath(storagePath)}`;
}

export function editorImagePublicUrlCandidates(path: string) {
  const { url } = getSupabaseConfig();

  return editorImageStoragePathCandidates(path).map(
    (storagePath) => `${url}/storage/v1/object/public/editor-images/${encodeStoragePath(storagePath)}`,
  );
}

export function extractEditorImagePaths(html: string | null | undefined) {
  if (!html) {
    return [];
  }

  const paths = new Set<string>();
  const imagePattern = /<img[^>]+src=["']([^"']+)["']/gi;
  let match: RegExpExecArray | null;

  while ((match = imagePattern.exec(html))) {
    const src = match[1].replace(/&amp;/g, "&");
    let pathname = src;

    try {
      pathname = new URL(src, "https://seoul-jaram.local").pathname;
    } catch {
      pathname = src;
    }

    const legacyPathMatch = pathname.match(/^\/ckeditor\/upload\/(.+)$/);
    const storagePathMatch = pathname.match(/\/storage\/v1\/object\/public\/editor-images\/(.+)$/);
    const path = legacyPathMatch?.[1] ?? storagePathMatch?.[1];

    if (path) {
      paths.add(decodeURIComponent(path).replace(/^\/+/, ""));
    }
  }

  return Array.from(paths);
}

export async function deleteEditorImages(paths: string[]) {
  if (!paths.length) {
    return;
  }

  const { url, serviceRoleKey } = getSupabaseConfig();

  for (const path of new Set(paths.flatMap(editorImageStoragePathCandidates))) {
    const storageUrl = `${url}/storage/v1/object/editor-images/${encodeURIComponent(path).replace(/%2F/g, "/")}`;

    await fetch(storageUrl, {
      method: "DELETE",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
    });
  }
}

export async function listPostAttachments(postId: string) {
  const { url } = getSupabaseConfig();
  const fileInfoUrl = createRestUrl("file_info");

  fileInfoUrl.searchParams.set("select", "id,post_id,original_file_name,stored_file_name,file_size,created_at");
  fileInfoUrl.searchParams.set("post_id", `eq.${postId}`);
  fileInfoUrl.searchParams.set("order", "created_at.asc");

  const response = await fetch(fileInfoUrl, {
    headers: createRestHeaders(false),
    cache: "no-store",
  });
  const body = await parseJsonResponse(response);

  if (!response.ok) {
    throw new Error(buildSupabaseErrorMessage("첨부파일 조회에 실패했습니다", body));
  }

  const rows = (body as FileInfoRow[] | null) ?? [];
  const files = rows
    .map((row) => {
      const storedName = row.stored_file_name;
      const name = row.original_file_name ?? storedName;

      if (!storedName || !name) {
        return null;
      }

      const attachmentPath = resolveAttachmentPath(storedName, row.created_at);
      const storedPath = `attachment/${attachmentPath}`;

      return {
        id: String(row.id),
        name,
        size: formatFileSize(row.file_size),
        url: `${url}/storage/v1/object/public/attachment/${encodeStoragePath(attachmentPath)}`,
        storedPath,
      };
    })
    .filter((file): file is { id: string; name: string; size: string; url: string; storedPath: string } => Boolean(file));

  return files.length ? files : undefined;
}

export async function findFileInfoById(id: string) {
  const url = createRestUrl("file_info");

  url.searchParams.set("select", "id,post_id,stored_file_name");
  url.searchParams.set("id", `eq.${id}`);
  url.searchParams.set("limit", "1");

  const response = await fetch(url, {
    headers: createRestHeaders(false),
    cache: "no-store",
  });
  const body = await parseJsonResponse(response);

  if (!response.ok) {
    throw new Error(buildSupabaseErrorMessage("첨부파일 조회에 실패했습니다", body));
  }

  const rows = body as FileInfoRow[] | null;
  return rows?.[0] ?? null;
}

export async function deletePostAttachment(fileId: string) {
  const file = await findFileInfoById(fileId);

  if (!file) {
    throw new Error("첨부파일을 찾을 수 없습니다.");
  }

  const fileInfoUrl = createRestUrl("file_info");
  fileInfoUrl.searchParams.set("id", `eq.${fileId}`);

  const fileInfoResponse = await fetch(fileInfoUrl, {
    method: "DELETE",
    headers: {
      ...createRestHeaders(false),
      Prefer: "return=minimal",
    },
  });
  const fileInfoBody = await parseJsonResponse(fileInfoResponse);

  if (!fileInfoResponse.ok) {
    throw new Error(buildSupabaseErrorMessage("첨부파일 정보 삭제에 실패했습니다", fileInfoBody));
  }

  const { url, serviceRoleKey } = getSupabaseConfig();
  const storagePath = file.stored_file_name.replace(/^attachment\//, "");
  const storageUrl = `${url}/storage/v1/object/attachment/${encodeURIComponent(storagePath).replace(/%2F/g, "/")}`;

  await fetch(storageUrl, {
    method: "DELETE",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
    },
  });

  return file;
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

  if (new Date(latest.verified_at).getTime() < getVerifiedSessionDeadline().getTime()) {
    throw new Error("인증 완료 시간이 지났습니다. 다시 인증이 필요합니다.");
  }

  return latest;
}
