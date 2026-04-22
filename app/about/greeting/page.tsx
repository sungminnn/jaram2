import type { Metadata } from "next";
import { Quote } from "lucide-react";
import { AboutPageLayout } from "@/components/about-page-layout";
import { greetingContent } from "@/content/about";

export const metadata: Metadata = {
  title: "대표 소개",
  description: "비영리민간단체 자람 대표 소개 페이지입니다.",
};

export default function GreetingPage() {
  return (
    <AboutPageLayout
      title={greetingContent.title}
      eyebrow={greetingContent.eyebrow}
      summary="아이와 가족, 지역사회가 함께 성장할 수 있는 돌봄 환경을 만들어갑니다."
      activeHref="/about/greeting"
    >
      <Quote className="mb-6 text-leaf" size={36} aria-hidden="true" />
      <h2 className="text-3xl font-bold leading-tight text-forest sm:text-4xl">
        {greetingContent.headline}
      </h2>

      <div className="mt-9 grid gap-5 text-lg leading-9 text-ink/78">
        {greetingContent.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <div className="mt-12 grid gap-8">
        {greetingContent.goals.map((goal) => (
          <section key={goal.title} className="border-l-2 border-leaf pl-5">
            <h3 className="text-xl font-bold text-forest">{goal.title}</h3>
            <p className="mt-3 text-lg leading-9 text-muted">{goal.description}</p>
          </section>
        ))}
      </div>

      <p className="mt-12 text-xl font-semibold leading-9 text-forest">
        {greetingContent.closing}
      </p>
      <p className="mt-10 text-right text-base font-bold text-forest">{greetingContent.signature}</p>
    </AboutPageLayout>
  );
}
