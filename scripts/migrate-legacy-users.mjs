import { readFile } from "node:fs/promises";
import path from "node:path";

if (process.env.SUPABASE_MIGRATION_INSECURE_TLS === "1") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

function normalizeEmail(value) {
  return String(value ?? "").trim().toLowerCase();
}

function normalizePhone(value) {
  const digits = String(value ?? "").replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 3) {
    return digits;
  }

  if (digits.length <= 7) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  }

  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

function getEnv(name) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name} 환경변수가 비어 있습니다.`);
  }

  return value;
}

function parseArgs(argv) {
  const args = {
    input: "",
    dryRun: false,
    defaultRole: "user",
  };

  for (let index = 0; index < argv.length; index += 1) {
    const current = argv[index];

    if (current === "--dry-run") {
      args.dryRun = true;
      continue;
    }

    if (current === "--input") {
      args.input = argv[index + 1] ?? "";
      index += 1;
      continue;
    }

    if (current === "--default-role") {
      args.defaultRole = argv[index + 1] ?? "user";
      index += 1;
      continue;
    }

    if (!args.input) {
      args.input = current;
    }
  }

  if (!args.input) {
    throw new Error("입력 파일 경로가 필요합니다. 예: node --env-file=.env.local scripts/migrate-legacy-users.mjs docs/db/legacy-users.sample.json");
  }

  if (!["user", "admin"].includes(args.defaultRole)) {
    throw new Error("--default-role 값은 user 또는 admin 이어야 합니다.");
  }

  return args;
}

async function parseJsonFile(inputPath) {
  const absolutePath = path.resolve(process.cwd(), inputPath);
  const content = await readFile(absolutePath, "utf8");
  const parsed = JSON.parse(content);

  if (!Array.isArray(parsed)) {
    throw new Error("입력 JSON은 배열이어야 합니다.");
  }

  return parsed;
}

async function fetchJson(url, options) {
  let response;

  try {
    response = await fetch(url, options);
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "cause" in error &&
      error.cause &&
      typeof error.cause === "object" &&
      "code" in error.cause &&
      error.cause.code === "SELF_SIGNED_CERT_IN_CHAIN"
    ) {
      throw new Error(
        [
          `TLS 인증서 검증 실패: ${String(url)}`,
          "현재 환경에 자체 서명/사내 프록시 인증서가 끼어 있습니다.",
          "권장 해결: 사내 루트 인증서를 신뢰 저장소에 추가하고 NODE_EXTRA_CA_CERTS를 설정하세요.",
          "임시 우회: SUPABASE_MIGRATION_INSECURE_TLS=1 node --env-file=.env.local scripts/migrate-legacy-users.mjs --dry-run <input.json>",
        ].join("\n"),
      );
    }

    throw error;
  }

  const text = await response.text();
  const body = text ? JSON.parse(text) : null;

  return { response, body };
}

async function loadExistingAuthUsers({ projectUrl, serviceRoleKey }) {
  const usersByEmail = new Map();
  const perPage = 1000;

  for (let page = 1; page <= 50; page += 1) {
    const requestUrl = new URL(`${projectUrl}/auth/v1/admin/users`);
    requestUrl.searchParams.set("page", String(page));
    requestUrl.searchParams.set("per_page", String(perPage));

    const { response, body } = await fetchJson(requestUrl, {
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`기존 Auth 사용자 조회 실패: ${JSON.stringify(body)}`);
    }

    const users = Array.isArray(body?.users) ? body.users : Array.isArray(body) ? body : [];

    for (const user of users) {
      const email = normalizeEmail(user?.email);

      if (email) {
        usersByEmail.set(email, user);
      }
    }

    if (users.length < perPage) {
      break;
    }
  }

  return usersByEmail;
}

async function createAuthUser({ projectUrl, serviceRoleKey, user }) {
  const payload = {
    email: user.email,
    email_confirm: true,
    user_metadata: {
      user_name: user.user_name,
      phone: user.phone,
      sms_agree: user.sms_agree,
      email_agree: user.email_agree,
    },
  };

  if (user.password_hash) {
    payload.password_hash = user.password_hash;
  } else if (user.password) {
    payload.password = user.password;
  } else {
    throw new Error(`${user.email}: password_hash 또는 password 값이 필요합니다.`);
  }

  const { response, body } = await fetchJson(`${projectUrl}/auth/v1/admin/users`, {
    method: "POST",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`${user.email}: Auth 생성 실패: ${JSON.stringify(body)}`);
  }

  const createdUser =
    body && typeof body === "object" && body.user && typeof body.user === "object"
      ? body.user
      : body;

  if (!createdUser?.id) {
    throw new Error(`${user.email}: Auth 생성 응답에 user id가 없습니다.`);
  }

  return createdUser;
}

async function upsertProfile({ projectUrl, serviceRoleKey, authUserId, user }) {
  const requestUrl = new URL(`${projectUrl}/rest/v1/profiles`);
  requestUrl.searchParams.set("on_conflict", "id");

  const payload = {
    id: authUserId,
    email: user.email,
    user_name: user.user_name,
    phone: user.phone,
    sms_agree: user.sms_agree,
    email_agree: user.email_agree,
    oauth_type: user.oauth_type ?? null,
    oauth_key: user.oauth_key ?? null,
    role: user.role,
  };

  const { response, body } = await fetchJson(requestUrl, {
    method: "POST",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      "Accept-Profile": "jaram",
      "Content-Profile": "jaram",
      Prefer: "resolution=merge-duplicates,return=representation",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`${user.email}: profiles upsert 실패: ${JSON.stringify(body)}`);
  }
}

function toImportUser(raw, defaultRole) {
  const email = normalizeEmail(raw.email);
  const userName = String(raw.user_name ?? raw.userName ?? "").trim();
  const phone = normalizePhone(raw.phone);
  const passwordHash = String(raw.password_hash ?? raw.password ?? "").trim();
  const role = raw.role === "admin" ? "admin" : defaultRole;

  if (!email) {
    throw new Error("email 값이 비어 있는 사용자가 있습니다.");
  }

  if (!userName) {
    throw new Error(`${email}: user_name 값이 비어 있습니다.`);
  }

  if (!phone) {
    throw new Error(`${email}: phone 값이 비어 있습니다.`);
  }

  if (!passwordHash) {
    throw new Error(`${email}: password 또는 password_hash 값이 비어 있습니다.`);
  }

  return {
    email,
    password_hash: passwordHash,
    user_name: userName,
    phone,
    sms_agree: Boolean(raw.sms_agree ?? raw.smsAgree),
    email_agree: Boolean(raw.email_agree ?? raw.emailAgree),
    oauth_type: raw.oauth_type ?? null,
    oauth_key: raw.oauth_key ?? null,
    role,
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const projectUrl = getEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = getEnv("SUPABASE_SERVICE_ROLE_KEY");
  const importedUsers = (await parseJsonFile(args.input)).map((item) =>
    toImportUser(item, args.defaultRole),
  );

  const uniqueUsers = Array.from(
    new Map(importedUsers.map((user) => [user.email, user])).values(),
  );

  const existingAuthUsers = await loadExistingAuthUsers({ projectUrl, serviceRoleKey });

  const summary = {
    total: uniqueUsers.length,
    createdAuth: 0,
    reusedAuth: 0,
    upsertedProfiles: 0,
    skipped: 0,
  };

  for (const user of uniqueUsers) {
    try {
      const existingAuth = existingAuthUsers.get(user.email);

      if (args.dryRun) {
        console.log(
          `[dry-run] ${existingAuth ? "reuse-auth" : "create-auth"} -> profile-upsert :: ${user.email}`,
        );
        if (existingAuth) {
          summary.reusedAuth += 1;
        } else {
          summary.createdAuth += 1;
        }
        summary.upsertedProfiles += 1;
        continue;
      }

      const authUser = existingAuth
        ? existingAuth
        : await createAuthUser({ projectUrl, serviceRoleKey, user });

      if (existingAuth) {
        summary.reusedAuth += 1;
      } else {
        summary.createdAuth += 1;
        existingAuthUsers.set(user.email, authUser);
      }

      await upsertProfile({
        projectUrl,
        serviceRoleKey,
        authUserId: authUser.id,
        user,
      });

      summary.upsertedProfiles += 1;
      console.log(`migrated :: ${user.email}`);
    } catch (error) {
      summary.skipped += 1;
      console.error(
        `failed :: ${user.email} :: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  console.log("");
  console.log("summary");
  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
