-- =========================================================
-- JARAM SUPABASE SECURITY POLICIES
-- schema: jaram
-- 목적:
--   - 프론트는 publishable key만 사용한다.
--   - public 스키마 대신 jaram 스키마만 Data API에 노출한다.
--   - anon/authenticated는 공개 게시글 조회만 가능하다.
--   - 관리자 등록/수정/삭제는 프론트 직접 접근이 아니라 서버 Route Handler 또는 권한 기반 경로로만 처리한다.
-- =========================================================

-- 1. API 노출 전제
-- Supabase Dashboard > Project Settings > API
--   Exposed schemas: jaram
--   Extra search path: public, extensions
--   Data API 노출 테이블: posts만 우선 사용
-- legacy_users는 절대 Data API 노출 대상에 포함하지 않는다.

-- 2. 최소 권한 GRANT
grant usage on schema jaram to anon, authenticated, service_role;

revoke all on jaram.posts from anon, authenticated;
grant select on jaram.posts to anon, authenticated;
grant select, insert, update, delete on jaram.posts to service_role;

revoke all on jaram.file_info from anon, authenticated;
grant select on jaram.file_info to anon, authenticated;
grant select, insert, update, delete on jaram.file_info to service_role;
revoke all on jaram.legacy_users from anon, authenticated;

-- 3. RLS 활성화
alter table jaram.posts enable row level security;
alter table jaram.posts force row level security;

alter table jaram.file_info enable row level security;
alter table jaram.file_info force row level security;

alter table jaram.legacy_users enable row level security;
alter table jaram.legacy_users force row level security;

-- 4. posts 공개 조회 정책
drop policy if exists "public read visible posts" on jaram.posts;

create policy "public read visible posts"
on jaram.posts
for select
to anon, authenticated
using (
  is_deleted = false
  and is_private = false
);

drop policy if exists "public read visible post files" on jaram.file_info;

create policy "public read visible post files"
on jaram.file_info
for select
to anon, authenticated
using (
  exists (
    select 1
    from jaram.posts
    where posts.id = file_info.post_id
      and posts.is_deleted = false
      and posts.is_private = false
  )
);

-- 5. 관리자 쓰기 정책은 운영 권한 설계 후에만 추가
-- 임시 allow all 정책 금지.
-- 권장 방식:
--   - Supabase Auth 사용자별 profile/role 테이블 구성
--   - 서버 Route Handler에서 관리자 권한 검증
--   - insert/update/delete는 service_role을 서버 환경변수에서만 사용하거나,
--     RLS admin policy를 별도로 좁게 설계

-- 6. Storage 버킷 생성
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('editor-images', 'editor-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('attachment', 'attachment', true, 10485760, array['application/pdf', 'image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- 7. Storage 공개 조회 정책
drop policy if exists "public read editor images" on storage.objects;
drop policy if exists "public read attachment files" on storage.objects;

create policy "public read editor images"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'editor-images');

create policy "public read attachment files"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'attachment');

-- 8. Storage 업로드/수정/삭제 정책
-- 현재 운영 관리자 권한 모델이 확정되지 않았으므로 anon/authenticated 업로드 정책을 만들지 않는다.
-- 관리자 업로드는 서버 Route Handler에서 파일 확장자, MIME, 용량, 경로를 검증한 뒤 처리한다.
