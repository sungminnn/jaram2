import { NextResponse } from "next/server";
import { isValidEmail, normalizeEmail } from "@/lib/server/signup-utils";
import { sendPasswordRecoveryEmail } from "@/lib/server/supabase-admin";

export async function POST(request: Request) {
  try {
    const { email } = (await request.json()) as { email?: string };
    const normalizedEmail = normalizeEmail(email ?? "");

    if (!isValidEmail(normalizedEmail)) {
      return NextResponse.json(
        { message: "올바른 이메일을 입력해주세요." },
        { status: 400 },
      );
    }

    const origin = new URL(request.url).origin;

    await sendPasswordRecoveryEmail({
      email: normalizedEmail,
      redirectTo: `${origin}/reset-password`,
    });

    return NextResponse.json({
      message: "비밀번호 재설정 메일을 발송했습니다. 메일함을 확인해주세요.",
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "비밀번호 재설정 메일 발송 중 오류가 발생했습니다.";

    return NextResponse.json({ message }, { status: 500 });
  }
}
