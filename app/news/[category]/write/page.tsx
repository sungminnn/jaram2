import { notFound } from "next/navigation";
import { CommunityPageLayout } from "@/components/community-page-layout";
import { PostFormPlaceholder } from "@/components/post-form-placeholder";
import { communityCategoryMeta, isPostCategory } from "@/content/community";
import { canWritePost, getCurrentUser } from "@/lib/server/current-user";

type PageProps = {
  params: Promise<{ category: string }>;
};

export default async function WritePage({ params }: PageProps) {
  const { category } = await params;

  if (!isPostCategory(category)) {
    notFound();
  }

  const currentUser = await getCurrentUser();
  const allowGuest = category === "qna";
  const canWrite = allowGuest || (currentUser ? canWritePost(currentUser.role, category) : false);

  if (!canWrite) {
    notFound();
  }

  const meta = communityCategoryMeta[category];
  const backHref = `/news/${category}`;

  return (
    <CommunityPageLayout title={meta.label} summary={meta.summary} activeHref={backHref}>
      <PostFormPlaceholder
        title={meta.label}
        description={
          allowGuest
            ? "문의게시판은 로그인 사용자와 비회원 모두 작성할 수 있습니다. 비회원 글은 이름과 비밀번호로 수정/삭제를 확인할 예정입니다."
            : "관리자 권한이 있는 사용자만 작성할 수 있습니다."
        }
        backHref={backHref}
        mode="write"
        category={category}
        allowGuest={allowGuest && !currentUser}
      />
    </CommunityPageLayout>
  );
}
