# Jaram Renewal

A full-stack renewal project for the Jaram organization website. The application modernizes a legacy Spring/JSP-based site into a Next.js App Router architecture with structured content pages, authentication, community boards, file access routes, editor image uploads, email verification, and migration tooling for legacy users.

## Live Site

[www.seoul-jaram.com](https://www.seoul-jaram.com)

## Highlights

- Rebuilt a legacy public website as a modern Next.js 15 application with TypeScript and React 19.
- Implemented organization pages, facility detail pages, news categories, FAQ, gallery, Q&A, and community post workflows.
- Built API routes for authentication, email verification, login/logout, password recovery, posts, comments, file downloads, view counts, access checks, and editor image uploads.
- Integrated Supabase-style server utilities and database scripts for auth, profile management, post data, comments, file metadata, and row-level security policy setup.
- Added a migration script to move legacy users into the new authentication/profile model while preserving existing password hashes where available.
- Included SEO infrastructure through dynamic sitemap and robots routes.

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Supabase-oriented database/auth integration
- Nodemailer
- Lucide React

## Project Structure

```text
app/
  api/                 # Auth, posts, comments, files, editor images
  about/               # Organization introduction pages
  facilities/          # Facility detail pages
  news/                # Notices, stories, gallery, Q&A, FAQ, post CRUD
components/            # Shared UI and feature components
content/               # Page copy and structured content
docs/db/               # Database schema, migration, and security SQL
lib/                   # Server utilities and community post logic
scripts/               # Legacy migration tooling
```

## Environment Variables

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

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Database Setup

Run the SQL files in `docs/db/` for the target database environment. The key files cover signup/auth tables, post migration, comments, file metadata, and security policies.

## Legacy User Migration

```bash
node --env-file=.env.local scripts/migrate-legacy-users.mjs --dry-run docs/db/legacy-users.sample.json
node --env-file=.env.local scripts/migrate-legacy-users.mjs docs/db/legacy-users.sample.json
```

The migration reuses existing auth users when possible, upserts profile records, and keeps `profiles.id` aligned with the authentication user id.

## Overview

This project covers the renewal of a legacy organization website into a production Next.js application, including public content pages, community workflows, authentication support, database planning, SEO routes, and operational migration tooling.
