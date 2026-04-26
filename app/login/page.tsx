import type { Metadata } from "next";
import { LoginForm } from "@/components/login-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "로그인",
  description: "자람 로그인 페이지입니다.",
};

export default function LoginPage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-cream pb-24 pt-12 sm:pt-16">
        <section className="mx-auto max-w-xl px-5 sm:px-6 lg:px-8">
          <LoginForm />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
