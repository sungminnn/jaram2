import "server-only";

import type { CommunityPost } from "@/content/community";

type PostRow = Record<string, unknown>;
type FileRow = Record<string, unknown>;
type NormalizedFile = NonNullable<CommunityPost["files"]>[number];
type DbPostPage = "notice" | "notices" | "news" | "stories" | "gallery" | "qna";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const categoryToPage = {
  notices: ["notice", "notices"],
  stories: ["news", "stories"],
  gallery: ["gallery"],
  qna: ["qna"],
} satisfies Record<CommunityPost["category"], DbPostPage[]>;
const pageToCategory = {
  notice: "notices",
  notices: "notices",
  news: "stories",
  stories: "stories",
  gallery: "gallery",
  qna: "qna",
} satisfies Record<DbPostPage, CommunityPost["category"]>;
const newPostWindowMs = 3 * 24 * 60 * 60 * 1000;
const isBuildPhase = process.env.NEXT_PHASE === "phase-production-build";

function asString(value: unknown) {
  return typeof value === "string" ? value : undefined;
}

function asNumber(value: unknown) {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
}

function stripHtml(value: string) {
  return value
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function firstImageSrc(value: unknown) {
  if (typeof value !== "string") {
    return undefined;
  }

  return value.match(/<img[^>]+src=["']([^"']+)["']/i)?.[1]?.replace(/&amp;/g, "&");
}

function formatDate(value: unknown) {
  const raw = asString(value);

  if (!raw) {
    return "";
  }

  const date = new Date(raw);

  if (Number.isNaN(date.getTime())) {
    return raw;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}.${month}.${day}`;
}

function isNewPost(value: unknown) {
  const raw = asString(value);

  if (!raw) {
    return false;
  }

  const time = new Date(raw).getTime();

  if (Number.isNaN(time)) {
    return false;
  }

  const age = Date.now() - time;

  return age >= 0 && age <= newPostWindowMs;
}

function normalizeContent(value: unknown) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item)).filter(Boolean);
  }

  if (typeof value === "string") {
    return stripHtml(value)
      .split(/\n{2,}/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean);
  }

  return [];
}

function normalizeFiles(value: unknown): CommunityPost["files"] {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const files = value
    .map((file): NormalizedFile | null => {
      if (!file || typeof file !== "object") {
        return null;
      }

      const entry = file as PostRow;
      const name = asString(entry.name) ?? asString(entry.filename);

      if (!name) {
        return null;
      }

      const normalizedFile: NormalizedFile = {
        name,
        size: asString(entry.size) ?? "",
      };

      const url = asString(entry.url);
      const storedPath = asString(entry.storedPath);

      if (url) {
        normalizedFile.url = url;
      }

      if (storedPath) {
        normalizedFile.storedPath = storedPath;
      }

      return normalizedFile;
    })
    .filter((file): file is NormalizedFile => Boolean(file));

  return files.length ? files : undefined;
}

function encodeStoragePath(path: string) {
  return path
    .replace(/\\/g, "/")
    .replace(/^\/+/, "")
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

function storagePublicUrl(bucket: "editor-images" | "attachment", path: string | undefined) {
  if (!path || !supabaseUrl) {
    return undefined;
  }

  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${encodeStoragePath(path)}`;
}

function normalizeStoragePath(path: string) {
  return path.replace(/\\/g, "/").replace(/^\/+/, "");
}

function resolveStorageUrl(value: string | undefined, defaultBucket: "editor-images" | "attachment" = "editor-images") {
  if (!value || !supabaseUrl) {
    return value;
  }

  if (/^https?:\/\//i.test(value) || value.startsWith("/images/") || value.startsWith("/ckeditor/upload/")) {
    return value;
  }

  if (value.startsWith("/storage/v1/")) {
    return `${supabaseUrl}${value}`;
  }

  const bucketPathMatch = value.match(/^(editor-images|attachment)\/(.+)$/);

  if (bucketPathMatch) {
    return storagePublicUrl(bucketPathMatch[1] as "editor-images" | "attachment", bucketPathMatch[2]);
  }

  return storagePublicUrl(defaultBucket, value);
}

function formatFileSize(value: unknown) {
  const size = asNumber(value);

  if (!size) {
    return "";
  }

  if (size < 1024 * 1024) {
    return `${Math.round(size / 1024)}KB`;
  }

  return `${(size / 1024 / 1024).toFixed(1)}MB`;
}

function storageDateFolder(value: unknown) {
  const raw = asString(value);

  if (!raw) {
    return undefined;
  }

  const dateParts = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);

  if (dateParts) {
    return `${dateParts[1].slice(2)}${dateParts[2]}${dateParts[3]}`;
  }

  const date = new Date(raw);

  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  return `${String(date.getFullYear()).slice(2)}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
}

function resolveAttachmentPath(storedName: string, createdAt: unknown) {
  const normalizedName = normalizeStoragePath(storedName);

  if (normalizedName.startsWith("attachment/")) {
    return normalizedName.replace(/^attachment\//, "");
  }

  if (normalizedName.startsWith("uploadfile/")) {
    return normalizedName;
  }

  if (normalizedName.includes("/")) {
    return `uploadfile/${normalizedName}`;
  }

  const folder = storageDateFolder(createdAt);

  return folder ? `uploadfile/${folder}/${normalizedName}` : `uploadfile/${normalizedName}`;
}

function normalizeFileInfo(row: FileRow): NormalizedFile | null {
  const storedName = asString(row.stored_file_name);
  const originalName = asString(row.original_file_name) ?? storedName;

  if (!storedName || !originalName) {
    return null;
  }

  const attachmentPath = resolveAttachmentPath(storedName, row.created_at);

  const file: NormalizedFile = {
    name: originalName,
    size: formatFileSize(row.file_size),
    storedPath: `attachment/${attachmentPath}`,
  };

  if (row.id !== undefined && row.id !== null) {
    file.id = String(row.id);
  }

  const url = storagePublicUrl("attachment", attachmentPath);

  if (url) {
    file.url = url;
  }

  return file;
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

function normalizePost(row: PostRow, fallbackCategory: CommunityPost["category"]): CommunityPost {
  const id = row.slug ?? row.id;
  const createdAt = row.created_at ?? row.createdAt ?? row.date ?? row.published_at;
  const rawContent = row.content ?? row.body ?? row.description;

  return {
    id: String(id),
    category: fallbackCategory,
    title: asString(row.title) ?? "제목 없음",
    subtitle: asString(row.sub_title) ?? asString(row.subtitle) ?? asString(row.summary) ?? asString(row.excerpt),
    author: asString(row.author_name) ?? asString(row.author) ?? asString(row.writer) ?? "관리자",
    date: formatDate(createdAt),
    views: asNumber(row.views) ?? asNumber(row.view_count) ?? 0,
    isPrivate: row.is_private === true,
    image: resolveStorageUrl(asString(row.main_image_url) ?? asString(row.image) ?? asString(row.image_url) ?? asString(row.thumbnail_url) ?? firstImageSrc(rawContent)),
    content: normalizeContent(rawContent),
    contentHtml: typeof rawContent === "string" ? sanitizeHtml(rawContent) : undefined,
    files: normalizeFiles(row.files ?? row.attachments),
    hasFiles: normalizeFiles(row.files ?? row.attachments)?.length ? true : undefined,
    isNew: isNewPost(createdAt),
  };
}

function rowTime(row: PostRow) {
  const raw = asString(row.created_at ?? row.createdAt ?? row.date ?? row.published_at);

  if (!raw) {
    return 0;
  }

  const time = new Date(raw).getTime();
  return Number.isNaN(time) ? 0 : time;
}

export async function getCommunityPosts(category: CommunityPost["category"]) {
  if (isBuildPhase) {
    return [];
  }

  if (!supabaseUrl || !supabaseKey) {
    console.warn("Supabase environment variables are not configured.");
    return [];
  }

  const url = new URL(`${supabaseUrl}/rest/v1/posts`);
  url.searchParams.set("select", "id,title,sub_title,content,main_image_url,view_count,page,is_private,author_name,created_at,updated_at");
  url.searchParams.set("page", `in.(${categoryToPage[category].join(",")})`);
  url.searchParams.set("is_deleted", "eq.false");
  if (category !== "qna") {
    url.searchParams.set("is_private", "eq.false");
  }
  url.searchParams.set("order", "created_at.desc");

  try {
    const response = await fetch(url, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Accept-Profile": "jaram",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(`Supabase posts query failed: ${response.status} ${message}`);
    }

    const rows = (await response.json()) as PostRow[];

    const posts = rows
      .sort((a, b) => rowTime(b) - rowTime(a))
      .map((row) => normalizePost(row, category));
    const postIds = posts.map((post) => post.id);
    const [postIdsWithFiles, commentCounts] = await Promise.all([
      getPostIdsWithFiles(postIds),
      category === "qna" ? getPostCommentCounts(postIds) : Promise.resolve(new Map<string, number>()),
    ]);

    return posts.map((post) => ({
      ...post,
      hasFiles: post.hasFiles || postIdsWithFiles.has(post.id) ? true : undefined,
      commentCount: commentCounts.get(post.id) ?? 0,
    }));
  } catch (error) {
    console.warn(error);
    return [];
  }
}

export async function getRecentCommunityCategories() {
  const result = new Set<CommunityPost["category"]>();

  if (isBuildPhase) {
    return result;
  }

  if (!supabaseUrl || !supabaseKey) {
    return result;
  }

  const since = new Date(Date.now() - newPostWindowMs).toISOString();
  const url = new URL(`${supabaseUrl}/rest/v1/posts`);
  url.searchParams.set("select", "page,created_at");
  url.searchParams.set("page", `in.(${Object.keys(pageToCategory).join(",")})`);
  url.searchParams.set("is_deleted", "eq.false");
  url.searchParams.set("is_private", "eq.false");
  url.searchParams.set("created_at", `gte.${since}`);

  try {
    const response = await fetch(url, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Accept-Profile": "jaram",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(`Supabase recent posts query failed: ${response.status} ${message}`);
    }

    const rows = (await response.json()) as PostRow[];

    rows.forEach((row) => {
      const page = asString(row.page) as DbPostPage | undefined;

      if (page && page in pageToCategory && isNewPost(row.created_at)) {
        result.add(pageToCategory[page]);
      }
    });
  } catch (error) {
    console.warn(error);
  }

  return result;
}

export async function getCommunityPost(category: CommunityPost["category"], id: string) {
  const posts = await getCommunityPosts(category);
  const post = posts.find((post) => post.id === id);

  if (!post) {
    return undefined;
  }

  return {
    ...post,
    files: (await getPostFiles(post.id)) ?? post.files,
  };
}

async function getPostFiles(postId: string): Promise<CommunityPost["files"]> {
  if (!supabaseUrl || !supabaseKey) {
    return undefined;
  }

  const url = new URL(`${supabaseUrl}/rest/v1/file_info`);
  url.searchParams.set("select", "id,post_id,original_file_name,stored_file_name,file_size,created_at");
  url.searchParams.set("post_id", `eq.${postId}`);
  url.searchParams.set("order", "created_at.asc");

  try {
    const response = await fetch(url, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Accept-Profile": "jaram",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(`Supabase file_info query failed: ${response.status} ${message}`);
    }

    const rows = (await response.json()) as FileRow[];
    const files = rows
      .map(normalizeFileInfo)
      .filter((file): file is NormalizedFile => Boolean(file));

    return files.length ? files : undefined;
  } catch (error) {
    console.warn(error);
    return undefined;
  }
}

async function getPostIdsWithFiles(postIds: string[]) {
  const ids = postIds.filter((id) => /^\d+$/.test(id));
  const result = new Set<string>();

  if (!supabaseUrl || !supabaseKey || !ids.length) {
    return result;
  }

  const url = new URL(`${supabaseUrl}/rest/v1/file_info`);
  url.searchParams.set("select", "post_id");
  url.searchParams.set("post_id", `in.(${ids.join(",")})`);

  try {
    const response = await fetch(url, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Accept-Profile": "jaram",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(`Supabase file_info count query failed: ${response.status} ${message}`);
    }

    const rows = (await response.json()) as FileRow[];

    rows.forEach((row) => {
      const postId = row.post_id;

      if (typeof postId === "number" || typeof postId === "string") {
        result.add(String(postId));
      }
    });
  } catch (error) {
    console.warn(error);
  }

  return result;
}

async function getPostCommentCounts(postIds: string[]) {
  const ids = postIds.filter((id) => /^\d+$/.test(id));
  const result = new Map<string, number>();

  if (!supabaseUrl || !supabaseKey || !ids.length) {
    return result;
  }

  const url = new URL(`${supabaseUrl}/rest/v1/comments`);
  url.searchParams.set("select", "post_id");
  url.searchParams.set("post_id", `in.(${ids.join(",")})`);
  url.searchParams.set("is_deleted", "eq.false");

  try {
    const response = await fetch(url, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Accept-Profile": "jaram",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(`Supabase comments count query failed: ${response.status} ${message}`);
    }

    const rows = (await response.json()) as Array<{ post_id?: number | string | null }>;

    rows.forEach((row) => {
      if (row.post_id === undefined || row.post_id === null) {
        return;
      }

      const postId = String(row.post_id);
      result.set(postId, (result.get(postId) ?? 0) + 1);
    });
  } catch (error) {
    console.warn(error);
  }

  return result;
}
