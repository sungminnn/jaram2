import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { canWritePost, getCurrentUser } from "@/lib/server/current-user";
import {
  deletePostAttachment,
  deleteEditorImages,
  extractEditorImagePaths,
  findPostById,
  getPostPageForCategory,
  listPostAttachments,
  softDeletePost,
  updatePost,
  uploadPostAttachment,
  verifyGuestPostPassword,
} from "@/lib/server/supabase-admin";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const maxFileSize = 10 * 1024 * 1024;
const allowedFileTypes = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
]);
const accessCookieName = "jaram_post_access";

function readAccessMap(value: string | undefined) {
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

async function hasPostAccess(postId: string) {
  const cookieStore = await cookies();
  const accessMap = readAccessMap(cookieStore.get(accessCookieName)?.value);

  return Boolean(accessMap[postId]);
}

function getText(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function getFiles(formData: FormData) {
  return formData
    .getAll("files")
    .filter((value): value is File => value instanceof File && value.size > 0);
}

function getFileKeys(formData: FormData) {
  return formData.getAll("fileKeys").map((value) => (typeof value === "string" ? value : ""));
}

function normalizeExistingMainImage(value: string) {
  if (!value.startsWith("existing:")) {
    return undefined;
  }

  const storedPath = value.slice(9).replace(/^\/+/, "");
  return storedPath || undefined;
}

function validateFiles(files: File[]) {
  if (files.length > 5) {
    return "첨부파일은 최대 5개까지 등록할 수 있습니다.";
  }

  for (const file of files) {
    if (file.size > maxFileSize) {
      return "첨부파일은 파일당 10MB 이하만 등록할 수 있습니다.";
    }

    if (!allowedFileTypes.has(file.type)) {
      return "첨부파일은 PDF, JPG, PNG, WEBP만 등록할 수 있습니다.";
    }
  }

  return null;
}

async function canManagePost(input: {
  postId: string;
  category: string;
  guestPassword: string;
  allowAccessCookie?: boolean;
}) {
  const page = getPostPageForCategory(input.category);
  const post = await findPostById(input.postId);
  const currentUser = await getCurrentUser();

  if (!page || !post || post.is_deleted || post.page !== page) {
    return { allowed: false, post: null, currentUser, status: 404 };
  }

  if (currentUser?.role === "admin") {
    return { allowed: true, post, currentUser, status: 200 };
  }

  if (input.category === "qna") {
    if (currentUser && post.author_id === currentUser.id) {
      return { allowed: true, post, currentUser, status: 200 };
    }

    if (
      verifyGuestPostPassword(input.guestPassword, post.password) ||
      (input.allowAccessCookie && (await hasPostAccess(input.postId)))
    ) {
      return { allowed: true, post, currentUser, status: 200 };
    }
  }

  if (input.category !== "qna" && currentUser && canWritePost(currentUser.role, input.category)) {
    return { allowed: true, post, currentUser, status: 200 };
  }

  return { allowed: false, post, currentUser, status: 403 };
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const formData = await request.formData();
    const category = getText(formData, "category");
    const title = getText(formData, "title");
    const subTitle = getText(formData, "subTitle");
    const content = getText(formData, "content");
    const mainImage = getText(formData, "mainImage");
    const isPrivate = getText(formData, "isPrivate") === "true";
    const guestName = getText(formData, "guestName");
    const guestPassword = getText(formData, "guestPassword");
    const files = getFiles(formData);
    const fileKeys = getFileKeys(formData);
    const fileMessage = validateFiles(files);
    const permission = await canManagePost({ postId: id, category, guestPassword, allowAccessCookie: true });

    if (!permission.allowed) {
      return NextResponse.json(
        { message: permission.status === 404 ? "게시글을 찾을 수 없습니다." : "수정 권한이 없습니다." },
        { status: permission.status },
      );
    }

    if (!title || !content) {
      return NextResponse.json({ message: "제목과 내용을 입력해주세요." }, { status: 400 });
    }

    if (fileMessage) {
      return NextResponse.json({ message: fileMessage }, { status: 400 });
    }

    const existingFiles = (await listPostAttachments(id)) ?? [];

    if (existingFiles.length + files.length > 5) {
      return NextResponse.json({ message: "첨부파일은 최대 5개까지 등록할 수 있습니다." }, { status: 400 });
    }

    const uploadedFiles = [];

    for (const [index, file] of files.entries()) {
      const uploadedFile = await uploadPostAttachment({
        postId: Number(id),
        file,
        createdBy: permission.currentUser?.id ?? guestName,
      });
      uploadedFiles.push({
        key: fileKeys[index] ?? String(index),
        isImage: file.type.startsWith("image/"),
        ...uploadedFile,
      });
    }

    const selectedKey = mainImage.startsWith("new:") ? mainImage.slice(4) : "";
    const selectedNewImage = uploadedFiles.find((file) => file.key === selectedKey && file.isImage);
    const mainImageUrl = selectedNewImage?.publicPath ?? normalizeExistingMainImage(mainImage);

    await updatePost({
      id,
      title,
      subTitle,
      content,
      isPrivate: category === "qna" ? isPrivate : undefined,
      ...(mainImageUrl !== undefined ? { mainImageUrl } : {}),
      authorName: permission.currentUser ? undefined : guestName,
    });

    return NextResponse.json({
      message: "게시글이 수정되었습니다.",
      href: `/news/${category}/${id}`,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "게시글 수정 중 오류가 발생했습니다.";

    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = (await request.json()) as { category?: string; guestPassword?: string };
    const category = body.category?.trim() ?? "";
    const guestPassword = body.guestPassword?.trim() ?? "";
    const permission = await canManagePost({ postId: id, category, guestPassword });

    if (!permission.allowed) {
      return NextResponse.json(
        { message: permission.status === 404 ? "게시글을 찾을 수 없습니다." : "삭제 권한이 없습니다." },
        { status: permission.status },
      );
    }

    const attachments = (await listPostAttachments(id)) ?? [];

    for (const attachment of attachments) {
      await deletePostAttachment(attachment.id);
    }

    await deleteEditorImages(extractEditorImagePaths(permission.post?.content));
    await softDeletePost(id);

    return NextResponse.json({
      message: "게시글이 삭제되었습니다.",
      href: `/news/${category}`,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "게시글 삭제 중 오류가 발생했습니다.";

    return NextResponse.json({ message }, { status: 500 });
  }
}
