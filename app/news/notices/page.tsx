import Link from "next/link";
import { Edit3, Search } from "lucide-react";
import { CommunityPageLayout } from "@/components/community-page-layout";
import { communityCategoryMeta, getCommunityPosts, isAdminMock } from "@/content/community";

export default function NoticesPage() {
  const posts = getCommunityPosts("notices");
  const meta = communityCategoryMeta.notices;

  return (
    <CommunityPageLayout title={meta.label} summary={meta.summary} activeHref="/news/notices">
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold text-leaf">Notice</p>
          <h2 className="mt-2 text-2xl font-bold text-forest">공지사항</h2>
        </div>
        <div className="flex gap-2">
          <label className="focus-within:ring-2 focus-within:ring-leaf/35 flex min-w-0 items-center gap-2 rounded-md bg-white px-4 py-3 shadow-[0_12px_34px_rgba(47,80,61,0.08)]">
            <Search size={18} className="text-muted" aria-hidden="true" />
            <input className="w-44 bg-transparent text-sm outline-none placeholder:text-muted/70" placeholder="검색어 입력" />
          </label>
          {isAdminMock ? (
            <Link
              href="/news/notices/write"
              className="focus-ring inline-flex items-center gap-2 rounded-md bg-forest px-4 py-3 text-sm font-bold text-white transition hover:bg-leaf"
            >
              <Edit3 size={16} aria-hidden="true" />
              글쓰기
            </Link>
          ) : null}
        </div>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow-[0_18px_55px_rgba(47,80,61,0.08)]">
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
              {posts.map((post, index) => (
                <tr key={post.id} className="border-b border-forest/8 last:border-0">
                  <td className="px-5 py-5 text-sm text-muted">{posts.length - index}</td>
                  <td className="px-5 py-5">
                    <Link href={`/news/notices/${post.id}`} className="focus-ring rounded-sm text-base font-medium text-forest transition hover:text-leaf">
                      {post.title}
                    </Link>
                  </td>
                  <td className="px-5 py-5 text-sm text-muted">{post.date}</td>
                  <td className="px-5 py-5 text-sm text-muted">{post.author}</td>
                  <td className="px-5 py-5 text-right text-sm text-muted">{post.views}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 flex justify-center gap-2" aria-label="페이지 이동">
        {[1, 2, 3].map((page) => (
          <button
            key={page}
            className={[
              "size-10 rounded-md text-sm font-bold transition",
              page === 1 ? "bg-forest text-white" : "bg-white text-muted shadow-[0_8px_24px_rgba(47,80,61,0.06)] hover:text-forest",
            ].join(" ")}
            type="button"
          >
            {page}
          </button>
        ))}
      </div>
    </CommunityPageLayout>
  );
}
