import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { getMailConfig } from "@/lib/server/auth-config";
import {
  buildVerificationEmailHtml,
  createVerificationCode,
  getExpiryDate,
  getResendAvailableDate,
  hashVerificationCode,
  isValidEmail,
  normalizeEmail,
} from "@/lib/server/signup-utils";
import {
  findProfileByEmail,
  getLatestVerification,
  insertVerification,
} from "@/lib/server/supabase-admin";

export const runtime = "nodejs";

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

    const existingProfile = await findProfileByEmail(normalizedEmail);

    if (existingProfile) {
      return NextResponse.json(
        { message: "이미 가입된 이메일입니다." },
        { status: 409 },
      );
    }

    const latest = await getLatestVerification(normalizedEmail);

    if (latest && new Date(latest.resend_available_at).getTime() > Date.now()) {
      return NextResponse.json(
        { message: "잠시 후 다시 요청해주세요." },
        { status: 429 },
      );
    }

    const code = createVerificationCode();
    const expiresAt = getExpiryDate();
    const resendAvailableAt = getResendAvailableDate();

    await insertVerification({
      email: normalizedEmail,
      codeHash: hashVerificationCode(normalizedEmail, code),
      expiresAt,
      resendAvailableAt,
    });

    try {
      const mailConfig = getMailConfig();
      const transporter = nodemailer.createTransport({
        host: mailConfig.host,
        port: mailConfig.port,
        secure: mailConfig.secure,
        auth: {
          user: mailConfig.user,
          pass: mailConfig.pass,
        },
      });

      await transporter.sendMail({
        from: mailConfig.from,
        to: normalizedEmail,
        subject: "자람 이메일 인증번호",
        html: buildVerificationEmailHtml(code),
      });

      return NextResponse.json({
        message: "인증번호를 발송했습니다. 메일함을 확인해주세요.",
        expiresAt: expiresAt.toISOString(),
      });
    } catch (mailError) {
      if (process.env.NODE_ENV !== "production") {
        const fallbackMessage =
          mailError instanceof Error && mailError.message
            ? `메일 발송은 실패했지만 개발환경이라 인증을 계속 진행할 수 있습니다.`
            : "메일 발송은 실패했지만 개발환경이라 인증을 계속 진행할 수 있습니다.";

        return NextResponse.json({
          message: fallbackMessage,
          expiresAt: expiresAt.toISOString(),
          debugCode: code,
          mailFallback: true,
        });
      }

      throw mailError;
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "인증번호 발송 중 오류가 발생했습니다.";

    return NextResponse.json({ message }, { status: 500 });
  }
}
