"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { galleryItems, noticeItems, storyItems } from "@/content/home";

type TabKey = "stories" | "notices" | "gallery";

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: "stories", label: "뉴스 및 소식" },
  { key: "notices", label: "공지사항" },
  { key: "gallery", label: "갤러리" },
];

export function CommunityTabs() {
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
  const pagedStories = storyItems.slice(storyPage * 2, storyPage * 2 + 2);
  const pagedNotices = noticeItems.slice(noticePage * 5, noticePage * 5 + 5);
  const pagedGallery = galleryItems.slice(galleryPage * 3, galleryPage * 3 + 3);
  const storyTotal = Math.ceil(storyItems.length / 2);
  const noticeTotal = Math.ceil(noticeItems.length / 5);
  const galleryTotal = Math.ceil(galleryItems.length / 3);

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
                <h3 className="text-xl font-bold text-forest">뉴스 및 소식</h3>
                <Pager current={storyPage + 1} total={storyTotal} onPrev={() => movePage("stories", -1)} onNext={() => movePage("stories", 1)} />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                {pagedStories.map((item) => (
                  <article key={item.title} className="overflow-hidden rounded-lg border border-forest/10 bg-white">
                    <div className="relative aspect-[4/3] bg-mint">
                      <Image src={item.image} alt="" fill sizes="(min-width: 640px) 50vw, 100vw" className="object-cover" />
                    </div>
                    <div className="p-5">
                      <p className="text-xs font-bold text-leaf">{item.date}</p>
                      <h4 className="mt-2 text-lg font-bold leading-7 text-forest">{item.title}</h4>
                      <p className="mt-3 text-sm leading-6 text-muted">{item.summary}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
            ) : null}

            {activeTab === "notices" ? (
            <div>
              <div className="mb-5 flex items-center justify-between gap-3">
                <h3 className="text-xl font-bold text-forest">공지사항</h3>
                <Pager current={noticePage + 1} total={noticeTotal} onPrev={() => movePage("notices", -1)} onNext={() => movePage("notices", 1)} />
              </div>
              <div className="overflow-hidden rounded-lg border border-forest/10 bg-white">
                <table className="w-full table-fixed border-collapse text-sm">
                  <caption className="sr-only">공지사항 목록</caption>
                  <thead className="bg-mint text-forest">
                    <tr>
                      <th scope="col" className="w-[52%] px-4 py-3 text-left font-bold">제목</th>
                      <th scope="col" className="px-4 py-3 text-left font-bold">작성일</th>
                      <th scope="col" className="hidden px-4 py-3 text-left font-bold sm:table-cell">조회</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-forest/10">
                    {pagedNotices.map((item) => (
                      <tr key={item.title} className="transition hover:bg-mint/60">
                        <td className="truncate px-4 py-4 font-semibold text-forest">{item.title}</td>
                        <td className="px-4 py-4 text-muted">{item.date}</td>
                        <td className="hidden px-4 py-4 text-muted sm:table-cell">{item.views}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            ) : null}

            {activeTab === "gallery" ? (
          <div>
            <div className="mb-5 flex items-center justify-between gap-3">
              <h3 className="text-xl font-bold text-forest">갤러리</h3>
              <Pager current={galleryPage + 1} total={galleryTotal} onPrev={() => movePage("gallery", -1)} onNext={() => movePage("gallery", 1)} />
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {pagedGallery.map((item) => (
                <article key={item.title} className="group overflow-hidden rounded-lg border border-forest/10 bg-white">
                  <div className="relative aspect-[5/3] bg-mint">
                    <Image src={item.image} alt="" fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-forest">{item.title}</h4>
                  </div>
                </article>
              ))}
            </div>
          </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
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
