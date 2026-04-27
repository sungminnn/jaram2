import Link from "next/link";
import { Edit3, LockKeyhole, Paperclip } from "lucide-react";
import { CommunitySearchForm } from "@/components/community-search-form";
import { CommunityPageLayout } from "@/components/community-page-layout";
import { Pagination } from "@/components/pagination";
import { communityCategoryMeta } from "@/content/community";
import { getCommunityPosts } from "@/lib/community-posts";

type QnaPageProps = {
  searchParams: Promise<{ page?: string; q?: string }>;
};

export const dynamic = "force-dynamic";

const pageSize = 5;

function pageHref(page: number, query: string) {
  const params = new URLSearchParams();

  if (page > 1) {
    params.set("page", String(page));
  }

  if (query) {
    params.set("q", query);
  }

  const search = params.toString();
  return search ? `/news/qna?${search}` : "/news/qna";
}

function matchesQuery(post: Awaited<ReturnType<typeof getCommunityPosts>>[number], query: string) {
  if (!query) {
    return true;
  }

  const target = [
    post.isPrivate ? "비밀글입니다" : post.title,
    post.isPrivate ? undefined : post.subtitle,
    post.author,
    post.date,
    ...(post.isPrivate ? [] : post.content),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return target.includes(query.toLowerCase());
}

export default async function QnaPage({ searchParams }: QnaPageProps) {
  const { page, q } = await searchParams;
  const posts = await getCommunityPosts("qna");
  const query = q?.trim() ?? "";
  const filteredPosts = posts.filter((post) => matchesQuery(post, query));
  const meta = communityCategoryMeta.qna;
  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / pageSize));
  const currentPage = Math.min(Math.max(Number(page) || 1, 1), totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const pagedPosts = filteredPosts.slice(startIndex, startIndex + pageSize);

  return (
    <CommunityPageLayout title={meta.label} summary={meta.summary} activeHref="/news/qna">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
        <div className="flex gap-2">
          <CommunitySearchForm action="/news/qna" initialQuery={query} />
          <Link
            href="/news/qna/write"
            className="focus-ring inline-flex items-center gap-2 rounded-md bg-forest px-4 py-3 text-sm font-bold text-white transition hover:bg-leaf"
          >
            <Edit3 size={16} aria-hidden="true" />
            글쓰기
          </Link>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-forest/10 border-t-2 border-t-leaf/35 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[46rem] border-collapse text-left">
            <thead>
              <tr className="border-b border-forest/10 bg-mint/60 text-sm text-forest">
                <th className="w-20 px-5 py-4 font-bold">No</th>
                <th className="px-5 py-4 font-bold">제목</th>
                <th className="w-32 px-5 py-4 font-bold">작성일</th>
                <th className="w-28 px-5 py-4 font-bold">작성자</th>
                <th className="w-24 px-5 py-4 text-right font-bold">조회수</th>
              </tr>
            </thead>
            <tbody>
              {pagedPosts.map((post, index) => (
                <tr key={post.id} className="border-b border-forest/8 last:border-0">
                  <td className="px-5 py-5 text-sm text-muted">{filteredPosts.length - startIndex - index}</td>
                  <td className="px-5 py-5">
                    <Link href={`/news/qna/${post.id}`} className="focus-ring inline-flex max-w-full min-w-0 items-center gap-2 rounded-sm text-base font-medium text-forest transition hover:text-leaf">
                      {post.isPrivate ? <LockKeyhole size={15} className="shrink-0 text-muted" aria-label="비밀글" /> : null}
                      <span className="truncate">{post.isPrivate ? "비밀글입니다." : post.title}</span>
                      {post.commentCount ? (
                        <span className="shrink-0 text-sm font-bold text-leaf">[{post.commentCount}]</span>
                      ) : null}
                      {post.hasFiles ? <Paperclip size={15} className="shrink-0 text-muted" aria-label="첨부파일 있음" /> : null}
                      {post.isNew ? <NewBadge /> : null}
                    </Link>
                  </td>
                  <td className="px-5 py-5 text-sm text-muted">{post.date}</td>
                  <td className="px-5 py-5 text-sm text-muted">{post.author}</td>
                  <td className="px-5 py-5 text-right text-sm text-muted">{post.views}</td>
                </tr>
              ))}
              {!filteredPosts.length ? (
                <tr>
                  <td colSpan={5} className="px-5 py-14 text-center text-sm font-medium text-muted">
                    {query ? "검색 결과가 없습니다." : "등록된 게시글이 없습니다."}
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} getHref={(nextPage) => pageHref(nextPage, query)} />
    </CommunityPageLayout>
  );
}

function NewBadge() {
  return <span className="shrink-0 rounded-full bg-leaf px-2 py-0.5 text-[10px] font-bold leading-none text-white">NEW</span>;
}
