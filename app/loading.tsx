export default function Loading() {
  return (
    <div className="min-h-[calc(100svh-5.5rem)] bg-cream px-5 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-center py-20">
        <div className="flex items-center gap-3 text-sm font-bold text-muted">
          <span className="size-2 animate-pulse rounded-full bg-leaf" aria-hidden="true" />
          <span>불러오는 중</span>
        </div>
      </div>
    </div>
  );
}
