# jaram2
jaram renewal site

## Signup setup

회원가입 기능은 다음 환경변수를 사용합니다.

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=

SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=
SMTP_PASS=
MAIL_FROM=
```

필요 작업:

1. `docs/db/signup-auth.sql`을 Supabase SQL Editor에서 실행
2. `jaram` 스키마가 API Exposed Schema에 포함되어 있는지 확인
3. `profiles` 테이블이 현재 운영 스키마와 동일한지 확인
4. `nodemailer`, `@types/nodemailer` 설치

## Legacy user migration

기존 `jaram.legacy_users` 또는 별도 추출 데이터에서 Supabase Auth + `jaram.profiles`로 사용자를 이관할 수 있습니다.

입력 예시는 `docs/db/legacy-users.sample.json`을 참고합니다.

```bash
node --env-file=.env.local scripts/migrate-legacy-users.mjs --dry-run docs/db/legacy-users.sample.json
node --env-file=.env.local scripts/migrate-legacy-users.mjs docs/db/legacy-users.sample.json
```

TLS 프록시/사내 인증서 환경에서 `fetch failed` 또는 `SELF_SIGNED_CERT_IN_CHAIN`가 나오면:

```bash
SUPABASE_MIGRATION_INSECURE_TLS=1 node --env-file=.env.local scripts/migrate-legacy-users.mjs --dry-run docs/db/legacy-users.sample.json
```

위 방법은 임시 우회용입니다. 가능하면 사내 루트 인증서를 설치하고 `NODE_EXTRA_CA_CERTS`로 해결하는 편이 안전합니다.

규칙:

1. `password_hash`가 있으면 Supabase Auth의 `password_hash`로 그대로 넣습니다. bcrypt 해시 이관 가능.
2. 동일 이메일 Auth 사용자가 이미 있으면 재사용하고 `profiles`만 upsert 합니다.
3. `profiles.id`는 반드시 Auth user id와 동일하게 저장됩니다.
