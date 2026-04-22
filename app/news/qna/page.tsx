import { LockKeyhole } from "lucide-react";
import { CommunityPageLayout } from "@/components/community-page-layout";
import { communityCategoryMeta } from "@/content/community";

export default function QnaPage() {
  const meta = communityCategoryMeta.qna;

  return (
    <CommunityPageLayout title={meta.label} summary={meta.summary} activeHref="/news/qna">
      <div className="rounded-lg bg-white p-8 shadow-[0_18px_55px_rgba(47,80,61,0.08)]">
        <span className="grid size-12 place-items-center rounded-xl bg-mint text-leaf">
          <LockKeyhole size={22} aria-hidden="true" />
        </span>
        <h2 className="mt-6 text-2xl font-bold text-forest">문의게시판은 다음 단계에서 연결합니다</h2>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
          댓글 기능은 제외하고, 로그인 사용자 문의 작성과 관리자 답변 권한을 분리하는 방식으로 설계할 예정입니다. 지금은 화면 구조만 먼저 확보했습니다.
        </p>
      </div>
    </CommunityPageLayout>
  );
}
