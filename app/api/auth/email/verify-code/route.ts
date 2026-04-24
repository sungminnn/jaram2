import { NextResponse } from "next/server";
import {
  VERIFICATION_MAX_ATTEMPTS,
  hashVerificationCode,
  isValidEmail,
  normalizeEmail,
} from "@/lib/server/signup-utils";
import { getLatestVerification, updateVerification } from "@/lib/server/supabase-admin";

export async function POST(request: Request) {
  try {
    const { email, code } = (await request.json()) as {
      email?: string;
      code?: string;
    };

    const normalizedEmail = normalizeEmail(email ?? "");
    const normalizedCode = (code ?? "").trim();

    if (!isValidEmail(normalizedEmail) || !/^\d{6}$/.test(normalizedCode)) {
      return NextResponse.json(
        { message: "이메일 또는 인증번호 형식이 올바르지 않습니다." },
        { status: 400 },
      );
    }

    const latest = await getLatestVerification(normalizedEmail);

    if (!latest) {
      return NextResponse.json(
        { message: "인증 요청 이력이 없습니다. 먼저 인증번호를 발송해주세요." },
        { status: 404 },
      );
    }

    if (latest.consumed_at) {
      return NextResponse.json(
        { message: "이미 사용된 인증 정보입니다. 다시 인증을 진행해주세요." },
        { status: 409 },
      );
    }

    if (latest.verified_at) {
      return NextResponse.json({ message: "이미 인증이 완료되었습니다." });
    }

    if (new Date(latest.expires_at).getTime() < Date.now()) {
      return NextResponse.json(
        { message: "인증번호가 만료되었습니다. 다시 발송해주세요." },
        { status: 410 },
      );
    }

    if (latest.attempt_count >= VERIFICATION_MAX_ATTEMPTS) {
      return NextResponse.json(
        { message: "인증 시도 횟수를 초과했습니다. 인증번호를 다시 발송해주세요." },
        { status: 429 },
      );
    }

    const matches = latest.code_hash === hashVerificationCode(normalizedEmail, normalizedCode);

    if (!matches) {
      await updateVerification(latest.id, {
        attempt_count: latest.attempt_count + 1,
      });

      return NextResponse.json(
        { message: "인증번호가 일치하지 않습니다." },
        { status: 400 },
      );
    }

    await updateVerification(latest.id, {
      verified_at: new Date().toISOString(),
    });

    return NextResponse.json({ message: "이메일 인증이 완료되었습니다." });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "이메일 인증 확인 중 오류가 발생했습니다.";

    return NextResponse.json({ message }, { status: 500 });
  }
}
