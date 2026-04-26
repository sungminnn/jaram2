import { NextResponse } from "next/server";
import { isValidEmail, normalizeEmail } from "@/lib/server/signup-utils";
import { findAuthUserByEmail, signInWithPassword } from "@/lib/server/supabase-admin";

export async function POST(request: Request) {
  try {
    const { email, password } = (await request.json()) as {
      email?: string;
      password?: string;
    };
    const normalizedEmail = normalizeEmail(email ?? "");

    if (!isValidEmail(normalizedEmail) || !password) {
      return NextResponse.json(
        { message: "이메일과 비밀번호를 입력해주세요." },
        { status: 400 },
      );
    }

    const existingUser = await findAuthUserByEmail(normalizedEmail);

    if (!existingUser) {
      return NextResponse.json(
        { message: "등록된 계정이 없습니다. 회원가입 후 이용해주세요." },
        { status: 404 },
      );
    }

    const session = await signInWithPassword({
      email: normalizedEmail,
      password,
    });

    const response = NextResponse.json({ message: "로그인되었습니다." });

    response.cookies.set("jaram_access_token", session.access_token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: session.expires_in,
    });
    response.cookies.set("jaram_refresh_token", session.refresh_token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "로그인 처리 중 오류가 발생했습니다.";

    return NextResponse.json({ message }, { status: 401 });
  }
}
