import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Download, Eye, Pencil, Trash2, UserRound } from "lucide-react";
import { CommunityPageLayout } from "@/components/community-page-layout";
import {
  communityCategoryMeta,
  communityPosts,
  getCommunityPost,
  isAdminMock,
  isPostCategory,
  type CommunityPost,
} from "@/content/community";

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

export default async function CommunityDetailPage({ params }: PageProps) {
  const { category, id } = await params;

  if (!isPostCategory(category)) {
    notFound();
  }

  const post = getCommunityPost(category, id);

  if (!post) {
    notFound();
  }

  const meta = communityCategoryMeta[category];
  const backHref = categoryHref(category);

  return (
    <CommunityPageLayout title={meta.label} summary={meta.summary} activeHref={backHref}>
      <div className="rounded-lg bg-white p-6 shadow-[0_18px_55px_rgba(47,80,61,0.08)] sm:p-8">
        <div className="border-b border-forest/10 pb-7">
          <p className="text-sm font-bold text-leaf">{meta.label}</p>
          <h2 className="mt-3 text-2xl font-bold leading-tight text-forest sm:text-3xl">{post.title}</h2>
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
          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-lg">
            <Image src={post.image} alt="" fill className="object-cover" sizes="(min-width: 1024px) 840px, 100vw" priority />
          </div>
        ) : null}

        <div className="mt-8 space-y-5 text-base leading-8 text-forest/82">
          {post.content.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        {post.files?.length ? (
          <div className="mt-10 rounded-lg bg-mint/70 p-5">
            <p className="mb-3 text-sm font-bold text-forest">첨부파일</p>
            <div className="grid gap-2">
              {post.files.map((file) => (
                <button key={file.name} type="button" className="flex items-center justify-between rounded-md bg-white px-4 py-3 text-left text-sm text-muted">
                  <span className="inline-flex min-w-0 items-center gap-2">
                    <Download size={16} className="shrink-0 text-leaf" aria-hidden="true" />
                    <span className="truncate">{file.name}</span>
                  </span>
                  <span className="shrink-0 pl-4">{file.size}</span>
                </button>
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
