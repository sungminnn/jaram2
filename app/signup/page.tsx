import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SignupForm } from "@/components/signup-form";

export const metadata: Metadata = {
  title: "회원가입",
  description: "자람 회원가입 페이지입니다.",
};

export default function SignupPage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-cream pb-24 pt-12 sm:pt-16">
        <section className="mx-auto max-w-3xl px-5 sm:px-6 lg:px-8">
          <SignupForm />
        </section>
      </main>
      <SiteFooter /> 
    </>
  );
}
