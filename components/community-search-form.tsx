"use client";

import { FormEvent, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

type CommunitySearchFormProps = {
  action: string;
  initialQuery: string;
};

export function CommunitySearchForm({ action, initialQuery }: CommunitySearchFormProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextQuery = query.trim();
    const nextHref = nextQuery ? `${action}?q=${encodeURIComponent(nextQuery)}` : action;

    startTransition(() => {
      router.push(nextHref, { scroll: false });
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <label className="focus-within:ring-2 focus-within:ring-leaf/35 flex min-w-0 items-center gap-2 rounded-md border border-forest/10 bg-white px-4 py-3">
        <Search size={18} className="text-muted" aria-hidden="true" />
        <input
          name="q"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="w-44 bg-transparent text-sm outline-none placeholder:text-muted/70"
          placeholder="검색어 입력"
        />
      </label>
      <button
        type="submit"
        disabled={isPending}
        className="focus-ring rounded-md border border-forest/10 bg-white px-4 py-3 text-sm font-bold text-forest transition hover:text-leaf disabled:cursor-wait disabled:text-muted"
      >
        검색
      </button>
    </form>
  );
}
