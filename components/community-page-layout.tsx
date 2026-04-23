import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { communityNavigation } from "@/content/community";

type CommunityPageLayoutProps = {
  title: string;
  summary: string;
  activeHref: string;
  children: React.ReactNode;
};

export function CommunityPageLayout({ title, summary: _summary, activeHref, children }: CommunityPageLayoutProps) {
  return (
    <SiteShell>
      <section className="border-b border-forest/10 bg-mint/60">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-normal text-leaf">Community</p>
            <h1 className="mt-1 text-2xl font-bold text-forest">{title}</h1>
          </div>
          <nav className="flex items-center gap-2 text-sm font-medium text-muted" aria-label="현재 위치">
            <Link href="/" className="transition hover:text-forest">
              홈
            </Link>
            <ChevronRight size={15} aria-hidden="true" />
            <span>소통공간</span>
            <ChevronRight size={15} aria-hidden="true" />
            <span className="font-bold text-forest">{title}</span>
          </nav>
        </div>
      </section>

      <section className="reveal-section bg-cream py-12 sm:py-14">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-6 lg:grid-cols-[16rem_1fr] lg:px-8">
          <aside className="hidden lg:sticky lg:top-28 lg:block lg:self-start" aria-label="소통공간 하위 메뉴">
            <nav className="border-l border-forest/14 pl-4">
              <div className="grid gap-2">
                {communityNavigation.map((item) => {
                  const active = item.href === activeHref;
                  const Icon = item.icon;

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

          <article className="reveal-card min-w-0">{children}</article>
        </div>
      </section>
    </SiteShell>
  );
}
