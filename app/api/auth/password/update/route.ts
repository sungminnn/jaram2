import { NextResponse } from "next/server";
import { isValidPassword } from "@/lib/server/signup-utils";
import { updateAuthUserPassword } from "@/lib/server/supabase-admin";

export async function POST(request: Request) {
  try {
    const { accessToken, password, confirmPassword } = (await request.json()) as {
      accessToken?: string;
      password?: string;
      confirmPassword?: string;
    };

    if (!accessToken) {
      return NextResponse.json(
        { message: "비밀번호 재설정 링크가 올바르지 않습니다." },
        { status: 400 },
      );
    }

    if (!password || !isValidPassword(password)) {
      return NextResponse.json(
        { message: "비밀번호는 숫자와 특수문자를 포함해 8자 이상으로 입력해주세요." },
        { status: 400 },
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { message: "비밀번호가 일치하지 않습니다." },
        { status: 400 },
      );
    }

    await updateAuthUserPassword({
      accessToken,
      password,
    });

    return NextResponse.json({ message: "비밀번호가 변경되었습니다." });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "비밀번호 변경 중 오류가 발생했습니다.";

    return NextResponse.json({ message }, { status: 500 });
  }
}
