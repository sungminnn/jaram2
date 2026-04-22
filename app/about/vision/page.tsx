import type { Metadata } from "next";
import { Baby, HandHeart, Leaf } from "lucide-react";
import { AboutPageLayout } from "@/components/about-page-layout";
import { visionMissionContent } from "@/content/about";

export const metadata: Metadata = {
  title: "비전과 미션",
  description: "비영리민간단체 자람의 비전과 미션을 소개합니다.",
};

const missionIcons = [Baby, Leaf, HandHeart];

export default function VisionPage() {
  return (
    <AboutPageLayout
      title={visionMissionContent.title}
      eyebrow={visionMissionContent.eyebrow}
      summary={visionMissionContent.summary}
      activeHref="/about/vision"
    >
      <section>
        <p className="text-sm font-bold text-leaf">VISION</p>
        <h2 className="mt-3 text-3xl font-bold leading-tight text-forest sm:text-4xl">
          {visionMissionContent.vision.headline}
        </h2>
        <div className="mt-10 grid gap-6">
          {visionMissionContent.vision.points.map((point, index) => (
            <div key={point} className="grid gap-3 border-l-2 border-leaf pl-5 sm:grid-cols-[4rem_1fr] sm:border-l-0 sm:pl-0">
              <p className="text-2xl font-bold text-leaf">0{index + 1}</p>
              <p className="text-xl font-semibold leading-8 text-forest">{point}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="my-14 h-px bg-forest/12" />

      <section>
        <p className="text-sm font-bold text-leaf">MISSION</p>
        <h2 className="mt-3 text-3xl font-bold text-forest">미션</h2>
        <p className="mt-5 text-lg leading-9 text-muted">{visionMissionContent.missionIntro}</p>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {visionMissionContent.missions.map((mission, index) => {
            const Icon = missionIcons[index] ?? Leaf;

            return (
              <section key={mission.title} className="px-1 py-2">
                <span className="mb-5 grid size-12 place-items-center rounded-2xl bg-mint text-leaf">
                  <Icon size={24} aria-hidden="true" />
                </span>
                <h3 className="text-xl font-bold text-forest">{mission.title}</h3>
                <div className="my-5 h-0.5 w-[calc(100%-10px)] max-w-64 bg-leaf" aria-hidden="true" />
                <ul className="grid gap-3 text-base leading-7 text-ink/78">
                  {mission.items.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-3 size-1.5 shrink-0 rounded-full bg-leaf" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </section>
    </AboutPageLayout>
  );
}
