import Link from "next/link";
import { ChevronRight, LogIn, Menu, Sprout, UserPlus } from "lucide-react";
import { navigation } from "@/content/home";
import { SupportPendingDialog } from "@/components/support-pending-dialog";
import type { CommunityPost } from "@/content/community";
import { getRecentCommunityCategories } from "@/lib/community-posts";

function hrefCategory(href: string): CommunityPost["category"] | undefined {
  if (href.startsWith("/news/notices")) {
    return "notices";
  }

  if (href.startsWith("/news/stories")) {
    return "stories";
  }

  if (href.startsWith("/news/gallery")) {
    return "gallery";
  }

  if (href.startsWith("/news/qna")) {
    return "qna";
  }

  return undefined;
}

export async function SiteHeader() {
  const recentCategories = await getRecentCommunityCategories();

  return (
    <header className="sticky top-0 z-50 border-b border-forest/10 bg-cream/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[5.5rem] max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
        <Link href="/" className="focus-ring flex items-center gap-3 rounded-md">
          <span className="grid size-12 place-items-center rounded-xl bg-leaf text-white shadow-soft">
            <Sprout size={26} aria-hidden="true" />
          </span>
          <span>
            <span className="block text-xl font-bold tracking-normal text-forest">자람</span>
            <span className="block text-sm font-medium text-muted">비영리민간단체</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-2 lg:flex" aria-label="주요 메뉴">
          {navigation.map((item) => (
            <div key={item.href} className="group relative">
              <Link
                href={item.href}
                className="focus-ring block rounded-md px-4 py-3 text-base font-bold text-forest/82 transition hover:bg-mint hover:text-forest"
              >
                {item.label}
              </Link>
              <div className="invisible absolute left-[calc(50%+1.25rem)] top-full -translate-x-1/2 pt-4 opacity-0 transition duration-150 group-hover:visible group-hover:opacity-100">
                <div
                  className={[
                    "rounded-lg border border-forest/10 bg-cream p-3 shadow-soft",
                    "feature" in item && item.feature ? "grid min-w-[40rem] grid-cols-[1fr_1.05fr] gap-3" : "min-w-72",
                  ].join(" ")}
                >
                  {"feature" in item && item.feature ? (
                    <div className="flex min-h-64 flex-col rounded-md bg-mint p-6">
                      <p className="text-2xl font-bold text-forest">{item.feature.title}</p>
                      <p className="mt-3 text-base leading-7 text-muted">{item.feature.description}</p>
                      <div className="mt-auto grid gap-2 pt-8">
                        {item.feature.links.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            className="focus-ring inline-flex items-center gap-2 rounded-md text-base font-bold text-forest transition hover:text-leaf"
                          >
                            {link.label}
                            <ChevronRight size={18} aria-hidden="true" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : null}
                  <div className="rounded-md bg-white p-2">
                    <p className="px-3 py-2 text-sm font-bold text-muted">{item.label}</p>
                    {item.items.map((subItem) => {
                      const SubIcon = "icon" in subItem ? subItem.icon : null;
                      const category = hrefCategory(subItem.href);
                      const isNew = category ? recentCategories.has(category) : false;

                      return (
                        subItem.href.startsWith("/support/") ? (
                          <SupportPendingDialog
                            key={subItem.href}
                            className="focus-ring group/link flex w-full items-center gap-3 rounded-md px-3 py-3 text-left text-base font-normal text-forest/84 transition hover:bg-mint hover:text-forest"
                          >
                            {SubIcon ? (
                              <SubIcon className="size-5 shrink-0 text-leaf" aria-hidden="true" />
                            ) : null}
                            <span className="min-w-0 flex-1 truncate">{subItem.label}</span>
                            {isNew ? (
                              <span className="shrink-0 rounded-full bg-leaf px-2 py-0.5 text-[10px] font-bold leading-none text-white">NEW</span>
                            ) : null}
                            <ChevronRight className="size-4 shrink-0 translate-x-[-0.35rem] opacity-0 transition group-hover/link:translate-x-0 group-hover/link:opacity-100" aria-hidden="true" />
                          </SupportPendingDialog>
                        ) : (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            className="focus-ring group/link flex items-center gap-3 rounded-md px-3 py-3 text-base font-normal text-forest/84 transition hover:bg-mint hover:text-forest"
                          >
                            {SubIcon ? (
                              <SubIcon className="size-5 shrink-0 text-leaf" aria-hidden="true" />
                            ) : null}
                            <span className="min-w-0 flex-1 truncate">{subItem.label}</span>
                            {isNew ? (
                              <span className="shrink-0 rounded-full bg-leaf px-2 py-0.5 text-[10px] font-bold leading-none text-white">NEW</span>
                            ) : null}
                            <ChevronRight className="size-4 shrink-0 translate-x-[-0.35rem] opacity-0 transition group-hover/link:translate-x-0 group-hover/link:opacity-100" aria-hidden="true" />
                          </Link>
                        )
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Link
            href="/login"
            className="focus-ring inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-base font-bold text-forest/78 transition hover:bg-mint hover:text-forest"
          >
            <LogIn size={19} aria-hidden="true" />
            로그인
          </Link>
          <Link
            href="/signup"
            className="focus-ring inline-flex items-center gap-2 rounded-md bg-forest px-5 py-3 text-base font-bold text-white transition hover:bg-leaf"
          >
            <UserPlus size={19} aria-hidden="true" />
            회원가입
          </Link>
        </div>

        <details className="group relative lg:hidden">
          <summary
            className="focus-ring grid size-11 cursor-pointer list-none place-items-center rounded-md border border-forest/15 text-forest marker:hidden"
            aria-label="메뉴 열기"
          >
            <Menu size={22} aria-hidden="true" />
          </summary>
          <nav
            className="absolute right-0 mt-3 max-h-[calc(100svh-6rem)] w-72 overflow-auto rounded-lg border border-forest/10 bg-cream p-2 shadow-soft"
            aria-label="모바일 메뉴"
          >
            <Link
              href="/login"
              className="focus-ring mb-1 flex items-center gap-2 rounded-md px-4 py-3 text-sm font-bold text-forest transition hover:bg-mint"
            >
              <LogIn size={17} aria-hidden="true" />
              로그인
            </Link>
            <Link
              href="/signup"
              className="focus-ring mb-3 flex items-center gap-2 rounded-md bg-forest px-4 py-3 text-sm font-bold text-white"
            >
              <UserPlus size={17} aria-hidden="true" />
              회원가입
            </Link>
            {navigation.map((item) => (
              <div key={item.href} className="border-t border-forest/10 py-2">
                <Link
                  href={item.href}
                  className="focus-ring block rounded-md px-4 py-2 text-base font-bold text-forest transition hover:bg-mint"
                >
                  {item.label}
                </Link>
                <div className="grid gap-1 pl-3">
                  {item.items.map((subItem) => {
                    const category = hrefCategory(subItem.href);
                    const isNew = category ? recentCategories.has(category) : false;

                    return subItem.href.startsWith("/support/") ? (
                      <SupportPendingDialog
                        key={subItem.href}
                        className="focus-ring flex w-full items-center justify-between gap-3 rounded-md px-4 py-2 text-left text-sm font-medium text-muted transition hover:bg-mint hover:text-forest"
                      >
                        <span>{subItem.label}</span>
                        {isNew ? (
                          <span className="shrink-0 rounded-full bg-leaf px-2 py-0.5 text-[10px] font-bold leading-none text-white">NEW</span>
                        ) : null}
                      </SupportPendingDialog>
                    ) : (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className="focus-ring flex items-center justify-between gap-3 rounded-md px-4 py-2 text-sm font-medium text-muted transition hover:bg-mint hover:text-forest"
                      >
                        <span>{subItem.label}</span>
                        {isNew ? (
                          <span className="shrink-0 rounded-full bg-leaf px-2 py-0.5 text-[10px] font-bold leading-none text-white">NEW</span>
                        ) : null}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </details>
      </div>
    </header>
  );
}
