import type { Metadata } from "next";
import { Quote } from "lucide-react";
import { AboutPageLayout } from "@/components/about-page-layout";
import { foundingContent } from "@/content/about";

export const metadata: Metadata = {
  title: "설립취지문",
  description: "비영리민간단체 자람의 연혁과 설립취지를 소개합니다.",
};

export default function FoundingPage() {
  return (
    <AboutPageLayout
      title={foundingContent.title}
      eyebrow={foundingContent.eyebrow}
      summary={foundingContent.summary}
      activeHref="/about/founding"
    >
      <h2 className="text-3xl font-bold leading-tight text-forest sm:text-4xl">
        {foundingContent.headline}
      </h2>

      <div className="mt-10 grid gap-7">
        {foundingContent.history.map((item) => (
          <section key={`${item.year}-${item.title}`} className="grid gap-3 border-l-2 border-leaf pl-5 sm:grid-cols-[8rem_1fr] sm:border-l-0 sm:pl-0">
            <p className="font-bold text-leaf">{item.year}</p>
            <h3 className="text-xl font-bold text-forest">{item.title}</h3>
          </section>
        ))}
      </div>

      <div className="my-14 h-px bg-forest/12" />

      <h2 className="text-3xl font-bold text-forest">비영리민간단체 자람의 설립취지</h2>
      <div className="mt-8 grid gap-4 text-lg leading-9 text-ink/78">
        {foundingContent.purpose.map((item) => (
          <p key={item} className="border-l-2 border-mint pl-5">
            {item}
          </p>
        ))}
      </div>

      <figure className="mt-14 border-l-4 border-leaf pl-6">
        <Quote className="mb-4 text-leaf" size={32} aria-hidden="true" />
        <blockquote className="text-xl font-semibold leading-9 text-forest">
          {foundingContent.quote}
        </blockquote>
        <figcaption className="mt-5 text-base text-muted">
          <span className="font-bold text-forest">{foundingContent.quoteAuthor}</span>
          <span className="ml-2">{foundingContent.quoteMeta}</span>
        </figcaption>
      </figure>
    </AboutPageLayout>
  );
}
