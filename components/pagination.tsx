import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  getHref: (page: number) => string;
};

function visiblePages(currentPage: number, totalPages: number) {
  const windowSize = 5;
  const half = Math.floor(windowSize / 2);
  const start = Math.max(1, Math.min(currentPage - half, totalPages - windowSize + 1));
  const end = Math.min(totalPages, start + windowSize - 1);

  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

export function Pagination({ currentPage, totalPages, getHref }: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = visiblePages(currentPage, totalPages);
  const prevPage = Math.max(1, currentPage - 1);
  const nextPage = Math.min(totalPages, currentPage + 1);

  return (
    <nav className="mt-10 flex justify-center gap-2" aria-label="페이지 이동">
      <Link
        href={getHref(prevPage)}
        aria-disabled={currentPage === 1}
        className={[
          "focus-ring grid size-10 place-items-center rounded-md bg-white text-forest shadow-[0_8px_24px_rgba(47,80,61,0.06)] transition hover:text-leaf",
          currentPage === 1 ? "pointer-events-none opacity-45" : "",
        ].join(" ")}
      >
        <ChevronLeft size={17} aria-hidden="true" />
        <span className="sr-only">이전 페이지</span>
      </Link>
      {pages.map((page) => (
        <Link
          key={page}
          href={getHref(page)}
          className={[
            "focus-ring grid size-10 place-items-center rounded-md text-sm font-bold transition",
            page === currentPage ? "bg-forest text-white" : "bg-white text-muted shadow-[0_8px_24px_rgba(47,80,61,0.06)] hover:text-forest",
          ].join(" ")}
        >
          {page}
        </Link>
      ))}
      <Link
        href={getHref(nextPage)}
        aria-disabled={currentPage === totalPages}
        className={[
          "focus-ring grid size-10 place-items-center rounded-md bg-white text-forest shadow-[0_8px_24px_rgba(47,80,61,0.06)] transition hover:text-leaf",
          currentPage === totalPages ? "pointer-events-none opacity-45" : "",
        ].join(" ")}
      >
        <ChevronRight size={17} aria-hidden="true" />
        <span className="sr-only">다음 페이지</span>
      </Link>
    </nav>
  );
}
