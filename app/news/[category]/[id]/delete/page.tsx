import { notFound } from "next/navigation";
import { CommunityPageLayout } from "@/components/community-page-layout";
import { PostFormPlaceholder } from "@/components/post-form-placeholder";
import { communityCategoryMeta, isPostCategory } from "@/content/community";
import { getCommunityPost } from "@/lib/community-posts";
import { canWritePost, getCurrentUser } from "@/lib/server/current-user";

type PageProps = {
  params: Promise<{ category: string; id: string }>;
};

export default async function DeletePage({ params }: PageProps) {
  const { category, id } = await params;

  if (!isPostCategory(category)) {
    notFound();
  }

  const post = await getCommunityPost(category, id);

  if (!post) {
    notFound();
  }

  const currentUser = await getCurrentUser();
  const allowGuestPasswordCheck = category === "qna";
  const canDelete = allowGuestPasswordCheck || (currentUser ? canWritePost(currentUser.role, category) : false);

  if (!canDelete) {
    notFound();
  }

  const meta = communityCategoryMeta[category];
  const backHref = `/news/${category}`;

  return (
    <CommunityPageLayout title={meta.label} summary={meta.summary} activeHref={backHref}>
      <PostFormPlaceholder
        title={post.title}
        description={
          allowGuestPasswordCheck
            ? "문의게시판 글은 작성 시 입력한 비밀번호 또는 관리자 권한으로 삭제할 예정입니다."
            : "관리자 권한이 있는 사용자만 삭제할 수 있습니다."
        }
        backHref={`${backHref}/${post.id}`}
        mode="delete"
        category={category}
        postId={post.id}
        allowGuest={allowGuestPasswordCheck && currentUser?.role !== "admin"}
      />
    </CommunityPageLayout>
  );
}
