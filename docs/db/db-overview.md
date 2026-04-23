# JARAM Database Overview

## 1. 개요

이 프로젝트는 **비영리민간단체 자람 공식 웹사이트**를 위한 데이터베이스 구조이다.
Supabase(PostgreSQL)를 사용하며, `jaram` 스키마를 기준으로 구성되어 있다.

본 문서는 AI 및 개발자가 현재 DB 구조와 의도를 정확히 이해하도록 하기 위한 설명 문서이다.

---

## 2. 기본 원칙

### 2.1 스키마

* 모든 테이블은 `jaram` 스키마를 사용한다.
* `public` 스키마는 사용하지 않는다.

---

### 2.2 보안 원칙

* Supabase **publishable key (anon key)**만 프론트에서 사용한다.
* `service_role_key`, DB password, direct connection string은 절대 프론트에 사용하지 않는다.
* Data API에 노출되는 테이블은 최소화한다.
* 노출된 테이블은 반드시 **RLS(Row Level Security)**를 활성화한다.
* RLS는 기본적으로 **deny (차단)** 방식으로 설계한다.

---

### 2.3 역할 구분

| 구분            | 설명               |
| ------------- | ---------------- |
| public (anon) | 비로그인 사용자         |
| authenticated | 로그인 사용자          |
| 관리자           | 추후 별도 권한으로 처리 예정 |

---

## 3. 테이블 구조

---

### 3.1 jaram.posts

#### 설명

* 공지사항, 뉴스, 갤러리, Q&A 등 모든 게시글을 저장하는 테이블
* 기존 `EDT_MSG_INFO` 테이블을 리팩토링하여 사용

#### 주요 컬럼

| 컬럼             | 설명                                    |
| -------------- | ------------------------------------- |
| id             | PK                                    |
| title          | 제목                                    |
| sub_title      | 소제목                                   |
| content        | HTML 본문                               |
| main_image_url | 대표 이미지                                |
| view_count     | 조회수                                   |
| page           | 게시판 구분 (notice, news, gallery, qna 등) |
| is_private     | 비밀글 여부                                |
| password       | 비밀글 비밀번호                              |
| is_deleted     | 삭제 여부                                 |
| author_id      | 작성자 ID                                |
| author_name    | 작성자 이름                                |
| created_at     | 생성일                                   |
| updated_at     | 수정일                                   |

---

#### 접근 정책 (RLS)

현재 정책:

* **비로그인 사용자 조회 가능 조건**

  * `is_deleted = false`
  * `is_private = false`

즉:

* 삭제되지 않은 공개 글만 조회 가능
* 비밀글 및 삭제글은 접근 불가

---

### 3.2 jaram.file_info

#### 설명

* 게시글 및 댓글에 첨부된 파일의 메타 정보
* 실제 파일은 Supabase Storage에 저장 예정

#### 주요 컬럼

| 컬럼                 | 설명      |
| ------------------ | ------- |
| id                 | PK      |
| post_id            | 게시글 ID  |
| comment_id         | 댓글 ID   |
| original_file_name | 원본 파일명  |
| stored_file_name   | 저장 파일명  |
| file_size          | 파일 크기   |
| created_at         | 생성일     |
| created_by         | 업로드 사용자 |

---

#### 정책

* 공개 게시글에 연결된 첨부파일 메타만 조회 허용
* `posts.is_deleted = false` 및 `posts.is_private = false` 조건을 만족하는 게시글의 파일만 노출
* 등록/수정/삭제는 프론트에서 직접 허용하지 않음

---

### 3.3 jaram.legacy_users

#### 설명

* 기존 시스템의 회원 정보를 마이그레이션하여 보관하는 테이블
* 운영 인증에는 사용하지 않음

#### 중요

* Supabase Auth로 인증을 대체할 예정
* 해당 테이블은 **프론트에서 절대 접근하면 안 됨**

---

#### 정책

* Data API 노출 금지
* RLS 적용 안 해도 되지만 접근 권한 자체를 차단하는 것이 원칙

---

## 4. 인증 구조

현재:

* legacy_users 존재 (과거 데이터)

향후:

* Supabase Auth 사용
* 사용자 정보는 별도 `profiles` 테이블로 관리 예정

구조 예시:

* auth.users (Supabase 관리)
* jaram.profiles (사용자 추가 정보)

---

## 5. Storage 구조 (예정)

파일 업로드는 Supabase Storage 사용 예정

### 버킷 설계

| 버킷            | 용도        |
| ------------- | --------- |
| editor-images | 게시글 이미지   |
| attachment    | 첨부파일      |
| center-images | 센터 소개 이미지 |

### 첨부파일 경로 규칙

* `file_info.stored_file_name`에 폴더가 없으면 `created_at` 기준 `uploadfile/YYMMDD/stored_file_name`으로 Storage 경로를 만든다.
* 예: `created_at = 2026-04-23`, `stored_file_name = abc.pdf` -> `attachment/uploadfile/260423/abc.pdf`
* `stored_file_name`에 날짜 폴더가 포함되어 있으면 `uploadfile`을 앞에 붙여 사용한다.
* `stored_file_name`이 이미 `uploadfile/`로 시작하면 해당 경로를 그대로 사용한다.

---

### 정책 방향

* editor-images: 공개 조회 허용
* attachment: 공개 게시글 첨부파일 조회 허용
* 업로드는 관리자만 허용

---

## 6. API 노출 정책

### 노출 대상

| 테이블          | 노출 여부 |
| ------------ | ----- |
| posts        | O     |
| file_info    | O     |
| legacy_users | X     |

---

### 설정

* Exposed Schemas: `jaram`
* Exposed Tables: `posts`, `file_info` 우선

---

## 7. 개발 시 주의사항

* RLS 없는 상태에서 개발하지 말 것
* 임시 allow-all 정책은 운영에 포함 금지
* HTML content는 XSS sanitize 필요
* 파일 업로드 시 확장자/용량 검증 필수

---

## 8. 향후 확장 계획

* 관리자 CMS 기능 추가
* 댓글 시스템 (comments 테이블)
* 사용자 프로필 (profiles)
* 관리자 권한 기반 RLS

---

## 9. AI 작업 가이드

AI는 다음 규칙을 따라야 한다:

* DB 구조를 임의로 추정하지 말 것
* 반드시 schema.sql 기준으로 작업할 것
* 보안(RLS, 권한)을 고려한 코드만 생성할 것
* 프론트에서 직접 DB 쓰기 작업을 하지 않도록 설계할 것
* 관리자 기능은 서버(Route Handler) 기준으로 구현할 것
