/**
 * Placeholder for the book cover (2:3). Swap to next/image when you add a cover file under /public.
 */
export function BookCoverPlaceholder({ title }: { title: string }) {
  const initial = title.trim().slice(0, 1).toUpperCase() || "—";
  return (
    <div
      className="group/cover relative flex aspect-[2/3] w-full max-w-[15rem] flex-col items-center justify-center overflow-hidden rounded-2xl border border-[var(--border)] bg-gradient-to-br from-stone-200/80 via-orange-100/40 to-amber-50/90 shadow-md transition duration-500 ease-out hover:-translate-y-1.5 hover:border-[var(--accent)]/45 hover:shadow-xl hover:shadow-orange-900/10 sm:max-w-none"
      aria-hidden
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_30%_15%,rgba(196,92,38,0.14),transparent_60%)] opacity-90 transition duration-500 group-hover/cover:opacity-100" />
      <div className="pointer-events-none absolute inset-0 translate-x-[-100%] bg-[linear-gradient(135deg,transparent_40%,rgba(255,255,255,0.35)_50%,transparent_60%)] transition duration-700 group-hover/cover:translate-x-[100%]" />
      <span className="relative font-serif text-6xl text-stone-400/90 transition duration-500 group-hover/cover:scale-110 group-hover/cover:text-[var(--accent)]/50 sm:text-7xl">
        {initial}
      </span>
      <span className="relative mt-3 px-3 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-500/80 transition duration-300 group-hover/cover:text-[var(--accent)]/80">
        Book cover
      </span>
    </div>
  );
}
