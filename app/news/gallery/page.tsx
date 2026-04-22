import Image from "next/image";
import Link from "next/link";
import { Edit3 } from "lucide-react";
import { CommunityPageLayout } from "@/components/community-page-layout";
import { communityCategoryMeta, getCommunityPosts, isAdminMock } from "@/content/community";

export default function GalleryPage() {
  const posts = getCommunityPosts("gallery");
  const meta = communityCategoryMeta.gallery;

  return (
    <CommunityPageLayout title={meta.label} summary={meta.summary} activeHref="/news/gallery">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-leaf">Gallery</p>
          <h2 className="mt-2 text-2xl font-bold text-forest">갤러리</h2>
        </div>
        {isAdminMock ? (
          <Link href="/news/gallery/write" className="focus-ring inline-flex items-center gap-2 rounded-md bg-forest px-4 py-3 text-sm font-bold text-white transition hover:bg-leaf">
            <Edit3 size={16} aria-hidden="true" />
            글쓰기
          </Link>
        ) : null}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {posts.map((post) => (
          <Link key={post.id} href={`/news/gallery/${post.id}`} className="focus-ring group block overflow-hidden rounded-lg bg-white shadow-[0_18px_55px_rgba(47,80,61,0.08)] transition hover:-translate-y-1">
            <div className="relative aspect-[4/3]">
              <Image src={post.image ?? "/images/marquee-1.jpg"} alt="" fill className="object-cover transition duration-500 group-hover:scale-105" sizes="(min-width: 1280px) 280px, (min-width: 640px) 45vw, 100vw" />
            </div>
            <div className="p-5">
              <p className="text-xs font-bold text-leaf">{post.date}</p>
              <h3 className="mt-2 text-lg font-bold leading-7 text-forest">{post.title}</h3>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">{post.subtitle}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-10 flex justify-center gap-2" aria-label="페이지 이동">
        {[1, 2].map((page) => (
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
