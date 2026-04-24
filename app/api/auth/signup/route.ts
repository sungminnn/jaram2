import { NextResponse } from "next/server";
import type { SignupPayload } from "@/lib/server/signup-utils";
import { validateSignupPayload } from "@/lib/server/signup-utils";
import {
  assertVerifiedSignupEmail,
  createAuthUser,
  deleteAuthUser,
  findProfileByEmail,
  insertProfile,
  updateVerification,
} from "@/lib/server/supabase-admin";

export async function POST(request: Request) {
  let createdUserId: string | null = null;

  try {
    const payload = (await request.json()) as SignupPayload;
    const validationMessage = validateSignupPayload(payload);

    if (validationMessage) {
      return NextResponse.json({ message: validationMessage }, { status: 400 });
    }

    const existingProfile = await findProfileByEmail(payload.email);

    if (existingProfile) {
      return NextResponse.json(
        { message: "이미 가입된 이메일입니다." },
        { status: 409 },
      );
    }

    const verification = await assertVerifiedSignupEmail(payload.email);
    const createdUser = await createAuthUser(payload);
    createdUserId = createdUser.id;

    await insertProfile({
      id: createdUser.id,
      email: payload.email,
      userName: payload.userName,
      phone: payload.phone,
      smsAgree: payload.smsAgree,
      emailAgree: payload.emailAgree,
    });

    await updateVerification(verification.id, {
      consumed_at: new Date().toISOString(),
    });

    return NextResponse.json({
      message: "회원가입이 완료되었습니다.",
    });
  } catch (error) {
    if (createdUserId) {
      await deleteAuthUser(createdUserId);
    }

    const message =
      error instanceof Error ? error.message : "회원가입 처리 중 오류가 발생했습니다.";

    return NextResponse.json({ message }, { status: 500 });
  }
}
