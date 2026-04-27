import type { Metadata } from "next";
import { MapPin, Phone } from "lucide-react";
import { AboutPageLayout } from "@/components/about-page-layout";
import { KakaoMap } from "@/components/kakao-map";
import { locationContent } from "@/content/about";

export const metadata: Metadata = {
  title: "오시는 길",
  description: "비영리민간단체 자람 위치와 방문 정보를 확인할 수 있습니다.",
};

export default function LocationPage() {
  return (
    <AboutPageLayout
      title={locationContent.title}
      eyebrow={locationContent.eyebrow}
      summary={locationContent.summary}
      activeHref="/about/location"
    >
      <div className="space-y-8">
        <KakaoMap
          appKey={process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY}
          latitude={locationContent.latitude}
          longitude={locationContent.longitude}
        />

        <section className="grid gap-4 rounded-lg border border-forest/10 bg-white p-6 shadow-[0_16px_40px_rgba(47,80,61,0.07)] sm:grid-cols-2">
          <div className="flex gap-4">
            <div className="mt-1 rounded-md bg-leaf/10 p-2 text-leaf">
              <MapPin size={18} aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-base font-bold text-forest">주소</h2>
              <p className="mt-2 text-base leading-8 text-muted">{locationContent.address}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="mt-1 rounded-md bg-leaf/10 p-2 text-leaf">
              <Phone size={18} aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-base font-bold text-forest">연락처</h2>
              <p className="mt-2 text-base leading-8 text-muted">{locationContent.phone}</p>
            </div>
          </div>
        </section>
      </div>
    </AboutPageLayout>
  );
}
