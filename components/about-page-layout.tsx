import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { aboutNavigation } from "@/content/about";

type AboutPageLayoutProps = {
  title: string;
  eyebrow: string;
  summary: string;
  activeHref: string;
  children: React.ReactNode;
};

export function AboutPageLayout({
  title,
  eyebrow,
  summary,
  activeHref,
  children,
}: AboutPageLayoutProps) {
  return (
    <SiteShell>
      <section className="reveal-section border-b border-forest/10 bg-mint/70">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
          <nav className="mb-5 flex items-center gap-2 text-sm font-medium text-muted" aria-label="현재 위치">
            <Link href="/" className="transition hover:text-forest">
              홈
            </Link>
            <ChevronRight size={15} aria-hidden="true" />
            <span>소개</span>
            <ChevronRight size={15} aria-hidden="true" />
            <span className="font-bold text-forest">{title}</span>
          </nav>
          <p className="mb-3 text-sm font-bold text-leaf">{eyebrow}</p>
          <h1 className="text-3xl font-bold text-forest sm:text-4xl">{title}</h1>
          <p className="mt-4 max-w-4xl text-base leading-7 text-muted">{summary}</p>
        </div>
      </section>

      <section className="reveal-section bg-cream py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-6 lg:grid-cols-[16rem_1fr] lg:px-8">
          <aside className="hidden lg:sticky lg:top-28 lg:block lg:self-start" aria-label="소개 하위 메뉴">
            <nav className="border-l border-forest/14 pl-4">
              <div className="grid gap-2">
                {aboutNavigation.map((item) => {
                  const Icon = item.icon;
                  const active = item.href === activeHref;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={[
                        "focus-ring -ml-[1.0625rem] flex items-center gap-3 rounded-md py-2 pl-0 pr-3 text-sm transition",
                        active ? "font-bold text-forest" : "font-medium text-muted hover:text-forest",
                      ].join(" ")}
                    >
                      <span className={active ? "h-7 w-0.5 bg-leaf" : "h-7 w-0.5 bg-transparent"} aria-hidden="true" />
                      <Icon size={18} className={active ? "text-leaf" : "text-muted"} aria-hidden="true" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </nav>
          </aside>

          <article className="reveal-card max-w-4xl">{children}</article>
        </div>
      </section>
    </SiteShell>
  );
}
