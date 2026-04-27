import Image from "next/image";
import Link from "next/link";
import { Edit3 } from "lucide-react";
import { CommunityPageLayout } from "@/components/community-page-layout";
import { Pagination } from "@/components/pagination";
import { communityCategoryMeta } from "@/content/community";
import { getCommunityPosts } from "@/lib/community-posts";
import { canWritePost, getCurrentUser } from "@/lib/server/current-user";

type GalleryPageProps = {
  searchParams: Promise<{ page?: string }>;
};

export const dynamic = "force-dynamic";

const pageSize = 6;

function pageHref(page: number) {
  return page === 1 ? "/news/gallery" : `/news/gallery?page=${page}`;
}

export default async function GalleryPage({ searchParams }: GalleryPageProps) {
  const { page } = await searchParams;
  const posts = await getCommunityPosts("gallery");
  const meta = communityCategoryMeta.gallery;
  const totalPages = Math.max(1, Math.ceil(posts.length / pageSize));
  const currentPage = Math.min(Math.max(Number(page) || 1, 1), totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const pagedPosts = posts.slice(startIndex, startIndex + pageSize);
  const currentUser = await getCurrentUser();
  const canWrite = currentUser ? canWritePost(currentUser.role, "gallery") : false;

  return (
    <CommunityPageLayout title={meta.label} summary={meta.summary} activeHref="/news/gallery">
      <div className="mb-8 flex items-end justify-end gap-4">
        {canWrite ? (
          <Link href="/news/gallery/write" className="focus-ring inline-flex items-center gap-2 rounded-md bg-forest px-4 py-3 text-sm font-bold text-white transition hover:bg-leaf">
            <Edit3 size={16} aria-hidden="true" />
            글쓰기
          </Link>
        ) : null}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {pagedPosts.map((post) => (
          <Link key={post.id} href={`/news/gallery/${post.id}`} className="focus-ring group block overflow-hidden rounded-lg bg-white shadow-[0_18px_55px_rgba(47,80,61,0.08)] transition hover:-translate-y-1">
            <div className="relative aspect-[4/3]">
              <Image src={post.image ?? "/images/marquee-1.jpg"} alt="" fill className="object-cover transition duration-500 group-hover:scale-105" sizes="(min-width: 1280px) 280px, (min-width: 640px) 45vw, 100vw" />
            </div>
            <div className="p-5">
              <p className="text-xs font-bold text-leaf">{post.date}</p>
              <h3 className="mt-2 flex items-center gap-2 text-lg font-bold leading-7 text-forest">
                <span>{post.title}</span>
                {post.isNew ? <NewBadge /> : null}
              </h3>
              {post.subtitle ? <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">{post.subtitle}</p> : null}
            </div>
          </Link>
        ))}
        {!posts.length ? (
          <div className="rounded-lg bg-white px-5 py-14 text-center text-sm font-medium text-muted shadow-[0_18px_55px_rgba(47,80,61,0.08)] sm:col-span-2 xl:col-span-3">
            등록된 게시글이 없습니다.
          </div>
        ) : null}
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} getHref={pageHref} />
    </CommunityPageLayout>
  );
}

function NewBadge() {
  return <span className="shrink-0 rounded-full bg-leaf px-2 py-0.5 text-[10px] font-bold leading-none text-white">NEW</span>;
}
