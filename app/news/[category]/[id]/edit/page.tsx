import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { CommunityPageLayout } from "@/components/community-page-layout";
import { PostFormPlaceholder } from "@/components/post-form-placeholder";
import { PrivatePostUnlockForm } from "@/components/private-post-unlock-form";
import { communityCategoryMeta, isPostCategory } from "@/content/community";
import { getCommunityPost } from "@/lib/community-posts";
import { canWritePost, getCurrentUser } from "@/lib/server/current-user";
import { findPostById, listPostAttachments } from "@/lib/server/supabase-admin";

type PageProps = {
  params: Promise<{ category: string; id: string }>;
};

export const dynamic = "force-dynamic";

function readPostAccess(value: string | undefined) {
  if (!value) {
    return {};
  }

  try {
    const parsed = JSON.parse(value) as Record<string, number>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export default async function EditPage({ params }: PageProps) {
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
  const canEdit = allowGuestPasswordCheck || (currentUser ? canWritePost(currentUser.role, category) : false);

  if (!canEdit) {
    notFound();
  }

  const meta = communityCategoryMeta[category];
  const backHref = `/news/${category}`;
  const dbPost = await findPostById(post.id);
  const cookieStore = await cookies();
  const postAccess = readPostAccess(cookieStore.get("jaram_post_access")?.value);
  const isOwner = Boolean(currentUser && dbPost?.author_id === currentUser.id);

  if (category === "qna" && currentUser?.role !== "admin" && !isOwner && !postAccess[post.id]) {
    return (
      <CommunityPageLayout title={meta.label} summary={meta.summary} activeHref={backHref}>
        <PrivatePostUnlockForm
          postId={post.id}
          category={category}
          title="수정 비밀번호 확인"
          description="문의글을 수정하려면 작성 시 입력한 비밀번호를 먼저 확인해주세요."
          buttonLabel="수정하기"
          pendingLabel="확인 중..."
        />
      </CommunityPageLayout>
    );
  }

  const existingFiles = (await listPostAttachments(post.id)) ?? post.files;

  return (
    <CommunityPageLayout title={meta.label} summary={meta.summary} activeHref={backHref}>
      <PostFormPlaceholder
        title={post.title}
        description={
          allowGuestPasswordCheck
            ? "문의게시판 글은 작성 시 입력한 비밀번호 또는 관리자 권한으로 수정할 예정입니다."
            : "관리자 권한이 있는 사용자만 수정할 수 있습니다."
        }
        backHref={`${backHref}/${post.id}`}
        mode="edit"
        category={category}
        postId={post.id}
        initialTitle={post.title}
        initialSubTitle={post.subtitle ?? ""}
        initialContent={post.contentHtml ?? post.content.join("\n\n")}
        initialIsPrivate={post.isPrivate}
        existingFiles={existingFiles}
        allowGuest={false}
      />
    </CommunityPageLayout>
  );
}
