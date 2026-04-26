"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileText, ImageIcon, Loader2, Paperclip, Upload, X } from "lucide-react";
import { CKEditorField } from "@/components/ckeditor-field";

type ExistingFile = {
  id?: string;
  name: string;
  size: string;
  url?: string;
  storedPath?: string;
};

type SelectedFile = {
  id: string;
  file: File;
  name: string;
  isImage: boolean;
  previewUrl?: string;
};

type PostFormPlaceholderProps = {
  title: string;
  description: string;
  backHref: string;
  mode: "write" | "edit" | "delete";
  category: string;
  postId?: string;
  initialTitle?: string;
  initialSubTitle?: string;
  initialContent?: string;
  initialIsPrivate?: boolean;
  existingFiles?: ExistingFile[];
  allowGuest?: boolean;
};

function isImageFileName(name: string) {
  return /\.(jpe?g|png|webp|gif)$/i.test(name);
}

function isRepresentativeCategory(category: string) {
  return category === "stories" || category === "gallery";
}

export function PostFormPlaceholder({
  title,
  description,
  backHref,
  mode,
  category,
  postId,
  initialTitle = "",
  initialSubTitle = "",
  initialContent = "",
  initialIsPrivate = false,
  existingFiles = [],
  allowGuest = false,
}: PostFormPlaceholderProps) {
  const router = useRouter();
  const [titleValue, setTitleValue] = useState(initialTitle);
  const [subTitleValue, setSubTitleValue] = useState(initialSubTitle);
  const [contentValue, setContentValue] = useState(initialContent);
  const [isPrivate, setIsPrivate] = useState(initialIsPrivate);
  const [guestName, setGuestName] = useState("");
  const [guestPassword, setGuestPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const alertRef = useRef<HTMLDivElement>(null);
  const selectedFilesRef = useRef<SelectedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState(existingFiles);
  const [mainImage, setMainImage] = useState("");
  const isDelete = mode === "delete";
  const usesRepresentativeImage = isRepresentativeCategory(category);
  const maxFileCount = 5;

  async function submitPost(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);
    setIsSubmitting(true);

    try {
      const formData = new FormData(event.currentTarget);
      formData.delete("files");
      formData.delete("fileKeys");
      selectedFiles.forEach((file) => {
        formData.append("files", file.file);
        formData.append("fileKeys", file.id);
      });

      const response =
        mode === "write"
          ? await fetch("/api/posts", { method: "POST", body: formData })
          : await fetch(`/api/posts/${postId}`, { method: "PATCH", body: formData });
      const data = (await response.json()) as { message?: string; href?: string };

      if (!response.ok) {
        throw new Error(data.message ?? "게시글 저장에 실패했습니다.");
      }

      setMessage(data.message ?? "게시글이 저장되었습니다.");
      router.push(data.href ?? `/news/${category}`);
      router.refresh();
      return;
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "게시글 저장에 실패했습니다.");
      setIsSubmitting(false);
    }
  }

  async function deleteExistingFile(fileId: string) {
    setMessage(null);
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/posts/${postId}/files/${fileId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, guestPassword }),
      });
      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(data.message ?? "첨부파일 삭제에 실패했습니다.");
      }

      const deletedFile = files.find((file) => file.id === fileId);
      setFiles((current) => current.filter((file) => file.id !== fileId));
      if (deletedFile?.storedPath && mainImage === `existing:${deletedFile.storedPath}`) {
        setMainImage("");
      }
      setMessage(data.message ?? "첨부파일을 삭제했습니다.");
      router.refresh();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "첨부파일 삭제에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function deletePost() {
    setMessage(null);
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, guestPassword }),
      });
      const data = (await response.json()) as { message?: string; href?: string };

      if (!response.ok) {
        throw new Error(data.message ?? "게시글 삭제에 실패했습니다.");
      }

      setMessage(data.message ?? "게시글을 삭제했습니다.");
      router.push(data.href ?? backHref);
      router.refresh();
      return;
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "게시글 삭제에 실패했습니다.");
      setIsSubmitting(false);
    }
  }

  function updateSelectedFiles(fileList: FileList | null) {
    setError(null);

    const incomingFiles = Array.from(fileList ?? []);
    const availableSlots = maxFileCount - files.length - selectedFiles.length;

    if (incomingFiles.length > availableSlots) {
      setError(`첨부파일은 최대 ${maxFileCount}개까지 등록할 수 있습니다.`);
    }

    const nextFiles = incomingFiles.slice(0, Math.max(0, availableSlots)).map((file) => {
      const isImage = file.type.startsWith("image/") || isImageFileName(file.name);
      const id = `${Date.now()}-${crypto.randomUUID()}`;

      return {
        id,
        file,
        name: file.name,
        isImage,
        previewUrl: isImage ? URL.createObjectURL(file) : undefined,
      };
    });
    const firstImage = nextFiles.find((file) => file.isImage);

    setSelectedFiles((current) => [...current, ...nextFiles]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (usesRepresentativeImage && firstImage && (!mainImage || mainImage.startsWith("new:"))) {
      setMainImage(`new:${firstImage.id}`);
    }
  }

  function removeSelectedFile(fileId: string) {
    setSelectedFiles((current) => {
      const removedFile = current.find((item) => item.id === fileId);

      if (removedFile?.previewUrl) {
        URL.revokeObjectURL(removedFile.previewUrl);
      }

      return current.filter((item) => item.id !== fileId);
    });
    if (mainImage === `new:${fileId}`) {
      setMainImage("");
    }
  }

  useEffect(() => {
    selectedFilesRef.current = selectedFiles;
  }, [selectedFiles]);

  useEffect(() => {
    if (!error) {
      return;
    }

    alertRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [error]);

  useEffect(() => {
    return () => {
      selectedFilesRef.current.forEach((file) => {
        if (file.previewUrl) {
          URL.revokeObjectURL(file.previewUrl);
        }
      });
    };
  }, []);

  return (
    <div className="rounded-lg bg-white p-6 shadow-[0_18px_55px_rgba(47,80,61,0.08)] sm:p-8">
      {error ? (
        <div
          ref={alertRef}
          role="alert"
          className="mb-5 flex items-start justify-between gap-4 rounded-2xl border border-[#f2b1a8] bg-[#fff4f1] px-4 py-3 text-sm font-semibold text-[#a13a29]"
        >
          <span>{error}</span>
          <button type="button" onClick={() => setError(null)} aria-label="오류 메시지 닫기">
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
      ) : null}

      {message ? (
        <div className="mb-5 flex items-start justify-between gap-4 rounded-2xl border border-[#c9e7bf] bg-[#f5fff2] px-4 py-3 text-sm font-semibold text-[#25653f]">
          <span>{message}</span>
          <button type="button" onClick={() => setMessage(null)} aria-label="안내 메시지 닫기">
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
      ) : null}

      <div className="border-b border-forest/10 pb-6">
        <h2 className="text-2xl font-bold text-forest">{title}</h2>
        <p className="mt-3 text-sm font-bold text-leaf">
          {mode === "write" ? "글쓰기" : mode === "edit" ? "수정" : "삭제"}
        </p>
        <p className="mt-3 text-sm leading-7 text-muted">{description}</p>
      </div>

      <form onSubmit={submitPost} className="mt-6 grid gap-4">
        <input type="hidden" name="category" value={category} />
        <input type="hidden" name="mainImage" value={mainImage} />

        {allowGuest ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold text-forest">
              이름
              <input
                name="guestName"
                value={guestName}
                onChange={(event) => setGuestName(event.target.value)}
                className="rounded-2xl border border-forest/12 bg-cream px-4 py-3 text-base outline-none focus:border-leaf"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-forest">
              비밀번호
              <input
                name="guestPassword"
                type="password"
                value={guestPassword}
                onChange={(event) => setGuestPassword(event.target.value)}
                className="rounded-2xl border border-forest/12 bg-cream px-4 py-3 text-base outline-none focus:border-leaf"
              />
            </label>
          </div>
        ) : null}

        {!isDelete ? (
          <>
            <label className="grid gap-2 text-sm font-semibold text-forest">
              제목
              <input
                name="title"
                value={titleValue}
                onChange={(event) => setTitleValue(event.target.value)}
                className="rounded-2xl border border-forest/12 bg-cream px-4 py-3 text-base outline-none focus:border-leaf"
              />
            </label>

            {usesRepresentativeImage ? (
              <label className="grid gap-2 text-sm font-semibold text-forest">
                부제목
                <input
                  name="subTitle"
                  value={subTitleValue}
                  onChange={(event) => setSubTitleValue(event.target.value)}
                  className="rounded-2xl border border-forest/12 bg-cream px-4 py-3 text-base outline-none focus:border-leaf"
                />
              </label>
            ) : null}

            <div className="grid gap-2 text-sm font-semibold text-forest">
              <span>내용</span>
              <CKEditorField name="content" value={contentValue} onChange={setContentValue} />
            </div>

            {category === "qna" ? (
              <label className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-forest">
                <input
                  type="checkbox"
                  checked={isPrivate}
                  onChange={(event) => setIsPrivate(event.target.checked)}
                  className="size-4 accent-forest"
                />
                비밀글
                <input type="hidden" name="isPrivate" value={isPrivate ? "true" : "false"} />
              </label>
            ) : null}

            <div className="grid gap-2 text-sm font-semibold text-forest">
              첨부파일
              {files.length ? (
                <div className="grid gap-2 rounded-2xl border border-forest/10 bg-cream p-3">
                  {files.map((file, index) => (
                    <div key={file.id ?? `${file.name}-${index}`} className="flex items-center justify-between gap-3 rounded-xl bg-white px-4 py-3 text-sm">
                      <span className="inline-flex min-w-0 items-center gap-3 text-muted">
                        {usesRepresentativeImage && file.storedPath && isImageFileName(file.name) ? (
                          <input
                            type="radio"
                            name="mainImageChoice"
                            checked={mainImage === `existing:${file.storedPath}`}
                            onChange={() => setMainImage(`existing:${file.storedPath}`)}
                            className="size-4 shrink-0 accent-forest"
                            aria-label={`${file.name} 대표 이미지로 선택`}
                          />
                        ) : null}
                        {isImageFileName(file.name) && file.url ? (
                          <a href={file.url} target="_blank" rel="noreferrer" className="relative size-12 shrink-0 overflow-hidden rounded-md bg-mint">
                            <img src={file.url} alt="" className="size-full object-cover" />
                          </a>
                        ) : isImageFileName(file.name) ? (
                          <ImageIcon className="size-4 shrink-0 text-leaf" aria-hidden="true" />
                        ) : (
                          <FileText className="size-4 shrink-0 text-leaf" aria-hidden="true" />
                        )}
                        <span className="grid min-w-0 gap-1">
                          <span className="truncate">{file.name}</span>
                          <span className="text-xs">{file.size}</span>
                        </span>
                      </span>
                      {file.id ? (
                        <button
                          type="button"
                          onClick={() => deleteExistingFile(file.id!)}
                          disabled={isSubmitting}
                          className="shrink-0 rounded-md px-2 py-1 text-xs font-bold text-[#a13a29] transition hover:bg-[#fff4f1] disabled:cursor-not-allowed disabled:text-muted"
                        >
                          삭제
                        </button>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : null}

              <span className="grid gap-3 rounded-2xl border border-dashed border-forest/20 bg-cream px-4 py-5 text-sm text-muted">
                <span className="inline-flex items-center gap-2">
                  <Paperclip size={16} aria-hidden="true" />
                  PDF, JPG, PNG, WEBP 파일을 최대 5개까지 등록할 수 있습니다.
                </span>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex w-fit items-center gap-2 rounded-md bg-white px-4 py-3 text-sm font-bold text-forest shadow-[0_8px_24px_rgba(47,80,61,0.08)] transition hover:bg-mint"
                >
                  <Upload size={16} aria-hidden="true" />
                  파일 선택
                </button>
                <input
                  ref={fileInputRef}
                  name="files"
                  type="file"
                  multiple
                  accept="application/pdf,image/jpeg,image/png,image/webp"
                  onChange={(event) => updateSelectedFiles(event.target.files)}
                  className="sr-only"
                />
                {selectedFiles.length ? (
                  <div className="grid gap-2">
                    {selectedFiles.map((file) => (
                      <span key={file.id} className="inline-flex min-w-0 items-center justify-between gap-3 rounded-xl bg-white px-3 py-2 text-sm text-forest">
                        <span className="inline-flex min-w-0 items-center gap-3">
                          {usesRepresentativeImage && file.isImage ? (
                            <input
                              type="radio"
                              name="mainImageChoice"
                              checked={mainImage === `new:${file.id}`}
                              onChange={() => setMainImage(`new:${file.id}`)}
                              className="size-4 shrink-0 accent-forest"
                              aria-label={`${file.name} 대표 이미지로 선택`}
                            />
                          ) : null}
                          {file.isImage && file.previewUrl ? (
                            <a href={file.previewUrl} target="_blank" rel="noreferrer" className="relative size-12 shrink-0 overflow-hidden rounded-md bg-mint">
                              <img src={file.previewUrl} alt="" className="size-full object-cover" />
                            </a>
                          ) : file.isImage ? (
                            <ImageIcon className="size-4 shrink-0 text-leaf" aria-hidden="true" />
                          ) : (
                            <FileText className="size-4 shrink-0 text-leaf" aria-hidden="true" />
                          )}
                          <span className="truncate">{file.name}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => removeSelectedFile(file.id)}
                          className="focus-ring grid size-6 shrink-0 place-items-center rounded-md text-muted transition hover:bg-[#fff4f1] hover:text-[#a13a29]"
                          aria-label={`${file.name} 선택 취소`}
                        >
                          <X className="size-4" aria-hidden="true" />
                        </button>
                      </span>
                    ))}
                  </div>
                ) : null}
              </span>
            </div>
          </>
        ) : (
          <>
            <div className="rounded-2xl border border-[#f2b1a8] bg-[#fff4f1] px-4 py-4 text-sm font-semibold text-[#a13a29]">
              삭제하면 목록에서 더 이상 표시되지 않습니다.
            </div>
            {allowGuest ? (
              <label className="grid gap-2 text-sm font-semibold text-forest">
                글 비밀번호
                <input
                  type="password"
                  value={guestPassword}
                  onChange={(event) => setGuestPassword(event.target.value)}
                  className="rounded-2xl border border-forest/12 bg-cream px-4 py-3 text-base outline-none focus:border-leaf"
                />
              </label>
            ) : null}
          </>
        )}

        <div className="mt-4 flex justify-end gap-2 border-t border-forest/10 pt-6">
          <Link href={backHref} className="focus-ring rounded-md bg-mint px-4 py-3 text-sm font-bold text-forest transition hover:bg-leaf hover:text-white">
            목록으로
          </Link>
          <button
            type={isDelete ? "button" : "submit"}
            onClick={isDelete ? deletePost : undefined}
            disabled={isSubmitting}
            className="rounded-md bg-forest px-4 py-3 text-sm font-bold text-white transition hover:bg-leaf disabled:cursor-not-allowed disabled:bg-forest/45"
          >
            {isSubmitting ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                {isDelete ? "삭제 중..." : "저장 중..."}
              </span>
            ) : isDelete ? (
              "삭제"
            ) : (
              "저장"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
