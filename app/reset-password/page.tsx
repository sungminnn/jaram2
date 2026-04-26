import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/reset-password-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "비밀번호 재설정",
  description: "자람 비밀번호 재설정 페이지입니다.",
};

export default function ResetPasswordPage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-cream pb-24 pt-12 sm:pt-16">
        <section className="mx-auto max-w-xl px-5 sm:px-6 lg:px-8">
          <ResetPasswordForm />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
