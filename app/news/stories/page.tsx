import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Edit3 } from "lucide-react";
import { CommunityPageLayout } from "@/components/community-page-layout";
import { Pagination } from "@/components/pagination";
import { communityCategoryMeta, isAdminMock } from "@/content/community";
import { getCommunityPosts } from "@/lib/community-posts";

type StoriesPageProps = {
  searchParams: Promise<{ page?: string }>;
};

const pageSize = 4;

function pageHref(page: number) {
  return page === 1 ? "/news/stories" : `/news/stories?page=${page}`;
}

export default async function StoriesPage({ searchParams }: StoriesPageProps) {
  const { page } = await searchParams;
  const posts = await getCommunityPosts("stories");
  const meta = communityCategoryMeta.stories;
  const totalPages = Math.max(1, Math.ceil(posts.length / pageSize));
  const currentPage = Math.min(Math.max(Number(page) || 1, 1), totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const pagedPosts = posts.slice(startIndex, startIndex + pageSize);

  return (
    <CommunityPageLayout title={meta.label} summary={meta.summary} activeHref="/news/stories">
      <div className="mb-8 flex items-end justify-end gap-4">
        {isAdminMock ? (
          <Link href="/news/stories/write" className="focus-ring inline-flex items-center gap-2 rounded-md bg-forest px-4 py-3 text-sm font-bold text-white transition hover:bg-leaf">
            <Edit3 size={16} aria-hidden="true" />
            글쓰기
          </Link>
        ) : null}
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {pagedPosts.map((post) => (
          <Link key={post.id} href={`/news/stories/${post.id}`} className="focus-ring group block rounded-lg bg-white shadow-[0_18px_55px_rgba(47,80,61,0.08)] transition hover:-translate-y-1">
            <div className="relative aspect-[16/10] overflow-hidden rounded-t-lg">
              <Image src={post.image ?? "/images/community-care.jpg"} alt="" fill className="object-cover transition duration-500 group-hover:scale-105" sizes="(min-width: 1024px) 430px, 100vw" />
            </div>
            <div className="p-6">
              <p className="text-sm font-medium text-muted">{post.date}</p>
              <h3 className="mt-3 flex items-center gap-2 text-xl font-bold leading-8 text-forest">
                <span>{post.title}</span>
                {post.isNew ? <NewBadge /> : null}
              </h3>
              {post.subtitle ? <p className="mt-3 text-sm leading-6 text-muted">{post.subtitle}</p> : null}
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-leaf">
                자세히 보기
                <ArrowRight size={16} className="transition group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </div>
          </Link>
        ))}
        {!posts.length ? (
          <div className="rounded-lg bg-white px-5 py-14 text-center text-sm font-medium text-muted shadow-[0_18px_55px_rgba(47,80,61,0.08)] md:col-span-2">
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
