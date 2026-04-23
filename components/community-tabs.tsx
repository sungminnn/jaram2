"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { ReactNode } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Paperclip } from "lucide-react";
import type { CommunityPost } from "@/content/community";

type TabKey = "stories" | "notices" | "gallery";

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: "stories", label: "뉴스 및 소식" },
  { key: "notices", label: "공지사항" },
  { key: "gallery", label: "갤러리" },
];

type CommunityTabsProps = {
  stories: CommunityPost[];
  notices: CommunityPost[];
  gallery: CommunityPost[];
};

export function CommunityTabs({ stories, notices, gallery }: CommunityTabsProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("stories");
  const [pageByTab, setPageByTab] = useState<Record<TabKey, number>>({
    stories: 0,
    notices: 0,
    gallery: 0,
  });

  const activeIndex = tabs.findIndex((tab) => tab.key === activeTab);
  const storyPage = pageByTab.stories;
  const noticePage = pageByTab.notices;
  const galleryPage = pageByTab.gallery;
  const pagedStories = stories.slice(storyPage * 2, storyPage * 2 + 2);
  const pagedNotices = notices.slice(noticePage * 5, noticePage * 5 + 5);
  const pagedGallery = gallery.slice(galleryPage * 3, galleryPage * 3 + 3);
  const storyTotal = Math.max(1, Math.ceil(stories.length / 2));
  const noticeTotal = Math.max(1, Math.ceil(notices.length / 5));
  const galleryTotal = Math.max(1, Math.ceil(gallery.length / 3));

  function movePage(tab: TabKey, direction: -1 | 1) {
    const maxByTab = {
      stories: storyTotal,
      notices: noticeTotal,
      gallery: galleryTotal,
    };
    setPageByTab((prev) => {
      const next = (prev[tab] + direction + maxByTab[tab]) % maxByTab[tab];
      return { ...prev, [tab]: next };
    });
  }

  return (
    <section id="news" className="bg-white py-24 sm:py-28" aria-labelledby="news-title">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-sm font-bold text-leaf">COMMUNITY</p>
            <h2 id="news-title" className="text-3xl font-bold text-forest sm:text-4xl">
              자람 소통공간
            </h2>
          </div>
          <Link href="/news" className="focus-ring inline-flex items-center gap-2 rounded-md text-sm font-bold text-leaf">
            전체 소식 보기
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>

        <div className="rounded-lg bg-cream p-4 shadow-soft">
          <div className="flex gap-8 border-b border-forest/10" role="tablist" aria-label="소통공간 탭">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                className={[
                  "focus-ring relative -mb-px px-1 pb-4 pt-2 text-left transition",
                  tab.key === activeTab
                    ? "text-forest after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-leaf"
                    : "text-forest/58 hover:text-forest",
                ].join(" ")}
                role="tab"
                aria-selected={tab.key === activeTab}
                onClick={() => setActiveTab(tab.key)}
              >
                <span className="block text-base font-bold">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="p-3 lg:p-6" role="tabpanel" aria-label={tabs[activeIndex]?.label}>
            {activeTab === "stories" ? (
            <div>
              <div className="mb-5 flex items-center justify-between gap-3">
                <SectionHeading>뉴스 및 소식</SectionHeading>
                {stories.length ? <Pager current={storyPage + 1} total={storyTotal} onPrev={() => movePage("stories", -1)} onNext={() => movePage("stories", 1)} /> : null}
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                {pagedStories.map((item) => (
                  <Link key={item.id} href={`/news/stories/${item.id}`} className="focus-ring overflow-hidden rounded-lg border border-forest/10 bg-white transition hover:-translate-y-1">
                    <div className="relative aspect-[4/3] bg-mint">
                      <Image src={item.image ?? "/images/community-care.jpg"} alt="" fill sizes="(min-width: 640px) 50vw, 100vw" className="object-cover" />
                    </div>
                    <div className="p-5">
                      <p className="text-xs font-bold text-leaf">{item.date}</p>
                      <h4 className="mt-2 flex items-center gap-2 text-lg font-bold leading-7 text-forest">
                        <span>{item.title}</span>
                        {item.isNew ? <NewBadge /> : null}
                      </h4>
                      <p className="mt-3 text-sm leading-6 text-muted">{item.subtitle ?? item.content[0]}</p>
                    </div>
                  </Link>
                ))}
                {!pagedStories.length ? <EmptyState /> : null}
              </div>
            </div>
            ) : null}

            {activeTab === "notices" ? (
            <div>
              <div className="mb-5 flex items-center justify-between gap-3">
                <SectionHeading>공지사항</SectionHeading>
                {notices.length ? <Pager current={noticePage + 1} total={noticeTotal} onPrev={() => movePage("notices", -1)} onNext={() => movePage("notices", 1)} /> : null}
              </div>
              <div className="overflow-hidden rounded-lg border border-forest/10 bg-white">
                <table className="w-full table-fixed border-collapse text-sm">
                  <caption className="sr-only">공지사항 목록</caption>
                  <thead className="bg-mint text-forest">
                    <tr>
                      <th scope="col" className="w-[70%] px-4 py-3 text-center font-bold">제목</th>
                      <th scope="col" className="px-4 py-3 text-center font-bold">작성일</th>
                      <th scope="col" className="hidden px-4 py-3 text-center font-bold sm:table-cell">조회</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-forest/10">
                    {pagedNotices.map((item) => (
                      <tr key={item.id} className="transition hover:bg-mint/60">
                        <td className="px-6 py-4 font-semibold text-forest">
                          <Link href={`/news/notices/${item.id}`} className="focus-ring inline-flex max-w-full items-center gap-2 rounded-sm transition hover:text-leaf">
                            <span className="truncate">{item.title}</span>
                            {item.hasFiles ? <Paperclip size={14} className="shrink-0 text-muted" aria-label="첨부파일 있음" /> : null}
                            {item.isNew ? <NewBadge /> : null}
                          </Link>
                        </td>
                        <td className="px-4 py-4 text-muted text-center">{item.date}</td>
                        <td className="hidden px-4 py-4 text-muted sm:table-cell text-center">{item.views}</td>
                      </tr>
                    ))}
                    {!pagedNotices.length ? (
                      <tr>
                        <td colSpan={3} className="px-4 py-10 text-center text-sm font-medium text-muted">
                          등록된 게시글이 없습니다.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </div>
            ) : null}

            {activeTab === "gallery" ? (
          <div>
            <div className="mb-5 flex items-center justify-between gap-3">
              <SectionHeading>갤러리</SectionHeading>
              {gallery.length ? <Pager current={galleryPage + 1} total={galleryTotal} onPrev={() => movePage("gallery", -1)} onNext={() => movePage("gallery", 1)} /> : null}
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {pagedGallery.map((item) => (
                <Link key={item.id} href={`/news/gallery/${item.id}`} className="focus-ring group overflow-hidden rounded-lg border border-forest/10 bg-white transition hover:-translate-y-1">
                  <div className="relative aspect-[5/3] bg-mint">
                    <Image src={item.image ?? "/images/marquee-1.jpg"} alt="" fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-4">
                    <h4 className="flex items-center gap-2 font-bold text-forest">
                      <span>{item.title}</span>
                      {item.isNew ? <NewBadge /> : null}
                    </h4>
                  </div>
                </Link>
              ))}
              {!pagedGallery.length ? <EmptyState /> : null}
            </div>
          </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

function EmptyState() {
  return (
    <div className="rounded-lg border border-forest/10 bg-white px-5 py-10 text-center text-sm font-medium text-muted">
      등록된 게시글이 없습니다.
    </div>
  );
}

function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <div>
      <span className="mb-3 block h-0.5 w-10 rounded-full bg-leaf" aria-hidden="true" />
      <h3 className="text-xl font-bold text-forest">{children}</h3>
    </div>
  );
}

function NewBadge() {
  return <span className="shrink-0 rounded-full bg-leaf px-2 py-0.5 text-[10px] font-bold leading-none text-white">NEW</span>;
}

function Pager({
  current,
  total,
  onPrev,
  onNext,
}: {
  current: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex items-center gap-2 text-sm font-bold text-muted" aria-label="페이지 이동">
      <button type="button" onClick={onPrev} className="focus-ring grid size-8 place-items-center rounded-md border border-forest/10 bg-white text-forest">
        <ChevronLeft size={16} aria-hidden="true" />
        <span className="sr-only">이전 페이지</span>
      </button>
      <span>
        {current} / {total}
      </span>
      <button type="button" onClick={onNext} className="focus-ring grid size-8 place-items-center rounded-md border border-forest/10 bg-white text-forest">
        <ChevronRight size={16} aria-hidden="true" />
        <span className="sr-only">다음 페이지</span>
      </button>
    </div>
  );
}
