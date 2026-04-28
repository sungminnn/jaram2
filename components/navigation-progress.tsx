"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function isModifiedClick(event: MouseEvent) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
}

function isSamePageHashLink(link: HTMLAnchorElement) {
  if (!link.hash) {
    return false;
  }

  return link.pathname === window.location.pathname && link.search === window.location.search;
}

function isCurrentUrlLink(url: URL) {
  return url.pathname === window.location.pathname && url.search === window.location.search && url.hash === window.location.hash;
}

export function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    setIsNavigating(false);
  }, [pathname, searchParams]);

  useEffect(() => {
    document.body.dataset.navigationPending = isNavigating ? "true" : "false";

    return () => {
      delete document.body.dataset.navigationPending;
    };
  }, [isNavigating]);

  useEffect(() => {
    if (!isNavigating) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setIsNavigating(false);
    }, 8000);

    return () => window.clearTimeout(timeout);
  }, [isNavigating]);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (event.defaultPrevented || isModifiedClick(event)) {
        return;
      }

      const target = event.target instanceof Element ? event.target.closest("a") : null;

      if (!(target instanceof HTMLAnchorElement)) {
        return;
      }

      if (target.target || target.hasAttribute("download") || isSamePageHashLink(target)) {
        return;
      }

      const url = new URL(target.href);

      if (url.origin !== window.location.origin) {
        return;
      }

      if (isCurrentUrlLink(url)) {
        event.preventDefault();
        setIsNavigating(true);
        window.location.reload();
        return;
      }

      setIsNavigating(true);
    }

    window.addEventListener("click", handleClick, true);

    return () => window.removeEventListener("click", handleClick, true);
  }, []);

  if (!isNavigating) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[110] h-1 overflow-hidden bg-leaf/10" aria-hidden="true">
      <div className="h-full w-1/3 animate-navigation-progress bg-leaf shadow-[0_0_18px_rgba(70,132,75,0.45)]" />
      <div className="absolute right-4 top-4 flex items-center gap-2 rounded-full bg-cream/92 px-3 py-1.5 text-xs font-semibold text-forest shadow-[0_10px_30px_rgba(31,42,36,0.12)] backdrop-blur sm:right-6 lg:right-8">
        <span className="size-3.5 animate-navigation-spinner rounded-full border-2 border-leaf/25 border-t-leaf" />
        <span>불러오는 중</span>
      </div>
    </div>
  );
}
