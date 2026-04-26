import { NextResponse } from "next/server";
import { canWritePost, getCurrentUser } from "@/lib/server/current-user";
import {
  getGuestPostPasswordHash,
  getPostPageForCategory,
  insertPost,
  updatePost,
  uploadPostAttachment,
} from "@/lib/server/supabase-admin";

const maxFileSize = 10 * 1024 * 1024;
const allowedFileTypes = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

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

function isRepresentativeCategory(category: string) {
  return category === "stories" || category === "gallery";
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

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const category = getText(formData, "category");
    const page = getPostPageForCategory(category);
    const title = getText(formData, "title");
    const subTitle = getText(formData, "subTitle");
    const content = getText(formData, "content");
    const mainImage = getText(formData, "mainImage");
    const isPrivate = getText(formData, "isPrivate") === "true";
    const guestName = getText(formData, "guestName");
    const guestPassword = getText(formData, "guestPassword");
    const currentUser = await getCurrentUser();
    const isQna = category === "qna";
    const files = getFiles(formData);
    const fileKeys = getFileKeys(formData);
    const fileMessage = validateFiles(files);

    if (!page) {
      return NextResponse.json({ message: "게시판 정보가 올바르지 않습니다." }, { status: 400 });
    }

    if (!title || !content) {
      return NextResponse.json({ message: "제목과 내용을 입력해주세요." }, { status: 400 });
    }

    if (!isQna && (!currentUser || !canWritePost(currentUser.role, category))) {
      return NextResponse.json({ message: "글쓰기 권한이 없습니다." }, { status: 403 });
    }

    if (isQna && !currentUser && (!guestName || guestPassword.length < 4)) {
      return NextResponse.json(
        { message: "비회원 문의글은 이름과 4자 이상 비밀번호가 필요합니다." },
        { status: 400 },
      );
    }

    if (fileMessage) {
      return NextResponse.json({ message: fileMessage }, { status: 400 });
    }

    const postId = await insertPost({
      title,
      subTitle,
      content,
      page,
      authorId: currentUser?.id ?? null,
      authorName: currentUser?.name ?? guestName,
      isPrivate: isQna ? isPrivate : false,
      passwordHash: currentUser ? null : getGuestPostPasswordHash(guestPassword),
    });

    const uploadedFiles = [];

    for (const [index, file] of files.entries()) {
      const uploadedFile = await uploadPostAttachment({
        postId,
        file,
        createdBy: currentUser?.id ?? guestName,
      });
      uploadedFiles.push({
        key: fileKeys[index] ?? String(index),
        isImage: file.type.startsWith("image/"),
        ...uploadedFile,
      });
    }

    const selectedKey = mainImage.startsWith("new:") ? mainImage.slice(4) : "";
    const selectedImage =
      uploadedFiles.find((file) => file.key === selectedKey && file.isImage) ??
      (isRepresentativeCategory(category) ? uploadedFiles.find((file) => file.isImage) : undefined);

    if (selectedImage) {
      await updatePost({
        id: String(postId),
        title,
        subTitle,
        content,
        mainImageUrl: selectedImage.publicPath,
      });
    }

    return NextResponse.json({
      message: "게시글이 저장되었습니다.",
      id: String(postId),
      href: `/news/${category}/${postId}`,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "게시글 저장 중 오류가 발생했습니다.";

    return NextResponse.json({ message }, { status: 500 });
  }
}
