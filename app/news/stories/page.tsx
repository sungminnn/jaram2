import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Edit3 } from "lucide-react";
import { CommunityPageLayout } from "@/components/community-page-layout";
import { communityCategoryMeta, getCommunityPosts, isAdminMock } from "@/content/community";

export default function StoriesPage() {
  const posts = getCommunityPosts("stories");
  const meta = communityCategoryMeta.stories;

  return (
    <CommunityPageLayout title={meta.label} summary={meta.summary} activeHref="/news/stories">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-leaf">Stories</p>
          <h2 className="mt-2 text-2xl font-bold text-forest">뉴스 및 소식</h2>
        </div>
        {isAdminMock ? (
          <Link href="/news/stories/write" className="focus-ring inline-flex items-center gap-2 rounded-md bg-forest px-4 py-3 text-sm font-bold text-white transition hover:bg-leaf">
            <Edit3 size={16} aria-hidden="true" />
            글쓰기
          </Link>
        ) : null}
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {posts.map((post) => (
          <Link key={post.id} href={`/news/stories/${post.id}`} className="focus-ring group block rounded-lg bg-white shadow-[0_18px_55px_rgba(47,80,61,0.08)] transition hover:-translate-y-1">
            <div className="relative aspect-[16/10] overflow-hidden rounded-t-lg">
              <Image src={post.image ?? "/images/community-care.jpg"} alt="" fill className="object-cover transition duration-500 group-hover:scale-105" sizes="(min-width: 1024px) 430px, 100vw" />
            </div>
            <div className="p-6">
              <p className="text-sm font-medium text-muted">{post.date}</p>
              <h3 className="mt-3 text-xl font-bold leading-8 text-forest">{post.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted">{post.subtitle}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-leaf">
                자세히 보기
                <ArrowRight size={16} className="transition group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <button type="button" className="rounded-md bg-white px-5 py-3 text-sm font-bold text-muted shadow-[0_8px_24px_rgba(47,80,61,0.06)]">
          1
        </button>
      </div>
    </CommunityPageLayout>
  );
}
