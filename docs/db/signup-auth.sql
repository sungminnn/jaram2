-- =========================================================
-- JARAM SIGNUP / EMAIL VERIFICATION
-- schema: jaram
-- description:
--   - 커스텀 이메일 인증번호 저장용 테이블
--   - 회원가입 전 인증 성공 여부와 사용 여부를 서버에서 관리
-- =========================================================

create schema if not exists jaram;

create table if not exists jaram.email_verifications (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  purpose text not null default 'signup',
  code_hash text not null,
  attempt_count integer not null default 0,
  expires_at timestamptz not null,
  resend_available_at timestamptz not null,
  verified_at timestamptz,
  consumed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_email_verifications_email_purpose_created_at
  on jaram.email_verifications (email, purpose, created_at desc);

grant usage on schema jaram to anon, authenticated, service_role;

revoke all on jaram.email_verifications from anon, authenticated;
grant select, insert, update, delete
on jaram.email_verifications
to service_role;

do $$
begin
  if to_regclass('jaram.profiles') is not null then
    alter table jaram.profiles
    add column if not exists role text not null default 'user';

    if not exists (
      select 1
      from pg_constraint
      where conname = 'profiles_role_check'
        and conrelid = 'jaram.profiles'::regclass
    ) then
      alter table jaram.profiles
      add constraint profiles_role_check
      check (role in ('user', 'admin'))
      not valid;

      alter table jaram.profiles
      validate constraint profiles_role_check;
    end if;

    grant select, insert, update, delete
    on jaram.profiles
    to service_role;
  end if;
end $$;

alter table jaram.email_verifications enable row level security;
alter table jaram.email_verifications force row level security;

drop policy if exists "deny email verifications direct access" on jaram.email_verifications;

create policy "deny email verifications direct access"
on jaram.email_verifications
for all
to anon, authenticated
using (false)
with check (false);

comment on table jaram.email_verifications is '회원가입 이메일 인증번호 저장 테이블';
comment on column jaram.email_verifications.email is '인증 대상 이메일';
comment on column jaram.email_verifications.purpose is '인증 목적(signup)';
comment on column jaram.email_verifications.code_hash is '인증번호 SHA-256 해시';
comment on column jaram.email_verifications.attempt_count is '인증 실패 횟수';
comment on column jaram.email_verifications.expires_at is '인증번호 만료 시각';
comment on column jaram.email_verifications.resend_available_at is '재발송 가능 시각';
comment on column jaram.email_verifications.verified_at is '인증 성공 시각';
comment on column jaram.email_verifications.consumed_at is '회원가입에 사용된 시각';
