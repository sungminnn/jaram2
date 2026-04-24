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
