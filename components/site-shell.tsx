import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { AnimateOnScroll } from "@/components/animate-on-scroll";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AnimateOnScroll />
      <SiteHeader />
      <main id="top">{children}</main>
      <Link
        href="#top"
        className="focus-ring fixed bottom-6 right-5 z-40 grid size-12 place-items-center rounded-full bg-forest text-white shadow-soft transition hover:-translate-y-1 hover:bg-leaf"
        aria-label="맨 위로 이동"
      >
        <ArrowUp size={22} aria-hidden="true" />
      </Link>
      <SiteFooter />
    </>
  );
}
