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
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-1 overflow-hidden bg-leaf/15" aria-hidden="true">
      <div className="h-full w-1/2 animate-navigation-progress bg-leaf shadow-[0_0_18px_rgba(70,132,75,0.45)]" />
    </div>
  );
}
