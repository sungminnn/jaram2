import { Sprout } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-forest/10 bg-forest text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:px-6 lg:grid-cols-[1.2fr_1fr] lg:px-8">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-2xl border border-white/28 bg-white/12 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]">
              <Sprout size={22} aria-hidden="true" />
            </span>
            <div>
              <p className="font-bold">자람</p>
              <p className="text-sm text-white/70">아이와 가족, 지역사회가 함께 자라는 돌봄</p>
            </div>
          </div>
          <p className="max-w-xl text-sm leading-7 text-white/70">
            자람은 어린이집, 키움센터 등 아동 돌봄과 성장 관련 시설을 운영하며
            신뢰할 수 있는 지역 돌봄 환경을 만들어갑니다.
          </p>
        </div>
        <div className="grid gap-2 text-sm text-white/70 lg:justify-end lg:text-right">
          <p>비영리민간단체 자람</p>
          <p>후원계좌: 하나은행 303-910024-16404 자람</p>
          <p>Copyright © Jaram. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
