// Shown by loading.tsx on list pages. Kept off pages that call notFound()/redirect(),
// because streaming a loading state first turns those into 200 responses.
export function PageSkeleton() {
  return (
    <div className="container py-10" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading…</span>
      <div className="h-8 w-64 max-w-full rounded-lg bg-slate-200 animate-pulse mb-6" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-48 rounded-2xl bg-white border border-slate-200 animate-pulse" />
        ))}
      </div>
    </div>
  )
}
