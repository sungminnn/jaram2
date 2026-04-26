import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { ArrowLeft, CalendarDays, Download, Pencil, UserRound } from "lucide-react";
import { CommunityPageLayout } from "@/components/community-page-layout";
import { DeletePostDialog } from "@/components/delete-post-dialog";
import { PostViewCount } from "@/components/post-view-count";
import { PrivatePostUnlockForm } from "@/components/private-post-unlock-form";
import { QnaComments } from "@/components/qna-comments";
import {
  communityCategoryMeta,
  communityPosts,
  isPostCategory,
  type CommunityPost,
} from "@/content/community";
import { getCommunityPost } from "@/lib/community-posts";
import { canWritePost, getCurrentUser } from "@/lib/server/current-user";
import { findPostById, listPostComments } from "@/lib/server/supabase-admin";

type PageProps = {
  params: Promise<{ category: string; id: string }>;
};

export function generateStaticParams() {
  return communityPosts.map((post) => ({
    category: post.category,
    id: post.id,
  }));
}

function categoryHref(category: CommunityPost["category"]) {
  return `/news/${category}`;
}

function isPreviewableImage(fileName: string) {
  return /\.(avif|gif|jpe?g|png|webp)$/i.test(fileName);
}

function downloadHref(file: { name: string; url?: string }) {
  if (!file.url || isPreviewableImage(file.name)) {
    return file.url;
  }

  try {
    const url = new URL(file.url);
    url.searchParams.set("download", file.name);
    return url.toString();
  } catch {
    return file.url;
  }
}

function readPostAccess(value: string | undefined) {
  if (!value) {
    return {};
  }

  try {
    const parsed = JSON.parse(value) as Record<string, number>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export default async function CommunityDetailPage({ params }: PageProps) {
  const { category, id } = await params;

  if (!isPostCategory(category)) {
    notFound();
  }

  const post = await getCommunityPost(category, id);

  if (!post) {
    notFound();
  }

  const meta = communityCategoryMeta[category];
  const backHref = categoryHref(category);
  const content = Array.isArray(post.content) ? post.content : [];
  const currentUser = await getCurrentUser();
  const dbPost = await findPostById(post.id);
  const cookieStore = await cookies();
  const postAccess = readPostAccess(cookieStore.get("jaram_post_access")?.value);
  const isOwner = Boolean(currentUser && dbPost?.author_id === currentUser.id);
  const canViewPrivatePost =
    !post.isPrivate ||
    category !== "qna" ||
    currentUser?.role === "admin" ||
    isOwner ||
    Boolean(postAccess[post.id]);
  const canManagePost =
    category === "qna" ||
    currentUser?.role === "admin" ||
    isOwner ||
    (category !== "qna" && currentUser ? canWritePost(currentUser.role, category) : false);
  const requireDeletePassword = category === "qna" && currentUser?.role !== "admin";
  const comments =
    category === "qna"
      ? await listPostComments({
          postId: post.id,
          viewerId: currentUser?.id,
          viewerRole: currentUser?.role,
        }).catch(() => [])
      : [];

  if (!canViewPrivatePost) {
    return (
      <CommunityPageLayout title={meta.label} summary={meta.summary} activeHref={backHref}>
        <PrivatePostUnlockForm postId={post.id} category={category} />
      </CommunityPageLayout>
    );
  }

  return (
    <CommunityPageLayout title={meta.label} summary={meta.summary} activeHref={backHref}>
      <div className="rounded-lg bg-white p-6 shadow-[0_18px_55px_rgba(47,80,61,0.08)] sm:p-8">
        <div className="border-b border-forest/10 pb-7">
          <p className="text-sm font-bold text-leaf">{meta.label}</p>
          <h2 className="mt-3 flex flex-wrap items-center gap-2 text-2xl font-bold leading-tight text-forest sm:text-3xl">
            <span>{post.title}</span>
            {post.isNew ? <NewBadge /> : null}
          </h2>
          {post.subtitle ? <p className="mt-3 text-base leading-7 text-muted">{post.subtitle}</p> : null}
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
            <span className="inline-flex items-center gap-2">
              <UserRound size={16} aria-hidden="true" />
              {post.author}
            </span>
            <span className="inline-flex items-center gap-2">
              <CalendarDays size={16} aria-hidden="true" />
              {post.date}
            </span>
            <PostViewCount postId={post.id} category={category} initialViews={post.views} />
          </div>
        </div>

        <div className="mt-8 text-base leading-8 text-forest/82">
          {post.contentHtml ? (
            <div className="ck-content" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
          ) : (
            <div className="space-y-5">
              {content.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          )}
          {!content.length && !post.image ? <p>본문 내용이 없습니다.</p> : null}
        </div>

        {post.files?.length ? (
          <div className="mt-10 rounded-lg bg-mint/70 p-5">
            <p className="mb-3 text-sm font-bold text-forest">첨부파일</p>
            <div className="grid gap-2">
              {post.files.map((file) => (
                <a
                  key={file.name}
                  href={downloadHref(file) ?? "#"}
                  target={file.url && isPreviewableImage(file.name) ? "_blank" : undefined}
                  rel={file.url && isPreviewableImage(file.name) ? "noreferrer" : undefined}
                  download={file.url && !isPreviewableImage(file.name) ? file.name : undefined}
                  className="flex items-center justify-between rounded-md bg-white px-4 py-3 text-left text-sm text-muted transition hover:text-forest"
                >
                  <span className="inline-flex min-w-0 items-center gap-2">
                    <Download size={16} className="shrink-0 text-leaf" aria-hidden="true" />
                    <span className="truncate">{file.name}</span>
                  </span>
                  <span className="shrink-0 pl-4">{file.size}</span>
                </a>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-10 flex flex-col gap-3 border-t border-forest/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Link href={backHref} className="focus-ring inline-flex items-center gap-2 rounded-md bg-mint px-4 py-3 text-sm font-bold text-forest transition hover:bg-leaf hover:text-white">
            <ArrowLeft size={16} aria-hidden="true" />
            목록으로
          </Link>
          {canManagePost ? (
            <div className="flex gap-2">
              <Link href={`${backHref}/${post.id}/edit`} className="focus-ring inline-flex items-center gap-2 rounded-md bg-forest px-4 py-3 text-sm font-bold text-white">
                <Pencil size={16} aria-hidden="true" />
                수정
              </Link>
              <DeletePostDialog postId={post.id} category={category} requirePassword={requireDeletePassword} />
            </div>
          ) : null}
        </div>

        {category === "qna" ? (
          <QnaComments
            postId={post.id}
            category={category}
            comments={comments}
            canWrite={Boolean(currentUser)}
            currentUserName={currentUser ? `${currentUser.name}님` : undefined}
          />
        ) : null}
      </div>
    </CommunityPageLayout>
  );
}

function NewBadge() {
  return <span className="shrink-0 rounded-full bg-leaf px-2 py-1 text-xs font-bold leading-none text-white">NEW</span>;
}
