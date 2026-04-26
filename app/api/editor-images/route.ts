import { NextResponse } from "next/server";
import { uploadEditorImage } from "@/lib/server/supabase-admin";

const maxImageSize = 10 * 1024 * 1024;
const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const upload = formData.get("upload");

    if (!(upload instanceof File) || upload.size <= 0) {
      return NextResponse.json({ message: "업로드할 이미지가 없습니다." }, { status: 400 });
    }

    if (upload.size > maxImageSize) {
      return NextResponse.json({ message: "이미지는 10MB 이하만 업로드할 수 있습니다." }, { status: 400 });
    }

    if (!allowedImageTypes.has(upload.type)) {
      return NextResponse.json({ message: "JPG, PNG, WEBP, GIF 이미지만 업로드할 수 있습니다." }, { status: 400 });
    }

    const uploaded = await uploadEditorImage(upload);

    return NextResponse.json({
      uploaded: true,
      url: uploaded.url,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "이미지 업로드 중 오류가 발생했습니다.";

    return NextResponse.json({ message, error: { message } }, { status: 500 });
  }
}
