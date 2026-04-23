import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Download, Eye, Pencil, Trash2, UserRound } from "lucide-react";
import { CommunityPageLayout } from "@/components/community-page-layout";
import {
  communityCategoryMeta,
  communityPosts,
  isAdminMock,
  isPostCategory,
  type CommunityPost,
} from "@/content/community";
import { getCommunityPost } from "@/lib/community-posts";

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
            <span className="inline-flex items-center gap-2">
              <Eye size={16} aria-hidden="true" />
              {post.views}
            </span>
          </div>
        </div>

        {post.image ? (
          <a href={post.image} target="_blank" rel="noreferrer" className="focus-ring relative mt-8 block aspect-[16/9] overflow-hidden rounded-lg bg-mint/60">
            <Image src={post.image} alt="" fill className="object-contain" sizes="(min-width: 1024px) 840px, 100vw" priority />
          </a>
        ) : null}

        <div className="mt-8 space-y-5 text-base leading-8 text-forest/82">
          {content.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
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
          {isAdminMock ? (
            <div className="flex gap-2">
              <Link href={`${backHref}/${post.id}/edit`} className="focus-ring inline-flex items-center gap-2 rounded-md bg-forest px-4 py-3 text-sm font-bold text-white">
                <Pencil size={16} aria-hidden="true" />
                수정
              </Link>
              <button type="button" className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-3 text-sm font-bold text-muted shadow-[0_8px_24px_rgba(47,80,61,0.08)]">
                <Trash2 size={16} aria-hidden="true" />
                삭제
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </CommunityPageLayout>
  );
}

function NewBadge() {
  return <span className="shrink-0 rounded-full bg-leaf px-2 py-1 text-xs font-bold leading-none text-white">NEW</span>;
}
