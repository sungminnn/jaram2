import "server-only";

function getRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} 환경변수가 설정되지 않았습니다.`);
  }

  return value;
}

function getServiceRoleKey() {
  const value = getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY");

  if (value.startsWith("sb_publishable_") || value.startsWith("sb_pub")) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY에 publishable/anon key가 설정되어 있습니다. Supabase Dashboard의 service_role 또는 secret key를 설정해주세요.",
    );
  }

  if (value.startsWith("http://") || value.startsWith("https://")) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY에 URL이 설정되어 있습니다. Supabase Dashboard의 service_role 또는 secret key를 설정해주세요.",
    );
  }

  return value;
}

function getPublishableKey() {
  const value = getRequiredEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");

  if (value.startsWith("http://") || value.startsWith("https://")) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY에 URL이 설정되어 있습니다. Supabase Dashboard의 publishable key를 설정해주세요.",
    );
  }

  return value;
}

export function getSupabaseConfig() {
  return {
    url: getRequiredEnv("NEXT_PUBLIC_SUPABASE_URL"),
    publishableKey: getPublishableKey(),
    serviceRoleKey: getServiceRoleKey(),
    schema: "jaram",
  };
}

export function getMailConfig() {
  const host = process.env.SMTP_HOST ?? "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT ?? "465");
  const secure = (process.env.SMTP_SECURE ?? "true").toLowerCase() !== "false";
  const user = getRequiredEnv("SMTP_USER");
  const pass = getRequiredEnv("SMTP_PASS");
  const from = process.env.MAIL_FROM ?? user;

  return {
    host,
    port,
    secure,
    user,
    pass,
    from,
  };
}
