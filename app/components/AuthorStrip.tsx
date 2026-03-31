import { AuthorPhoto } from "@/app/components/AuthorPhoto";

/** Compact author spotlight at the top of a page — not in the book-cover area. */
export function AuthorStrip({ authorName }: { authorName: string }) {
  return (
    <div className="group/author mb-10 flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--card)]/90 px-4 py-3.5 shadow-sm backdrop-blur-sm transition duration-300 ease-out hover:-translate-y-0.5 hover:border-[var(--accent)]/35 hover:bg-white hover:shadow-lg hover:shadow-orange-900/10 sm:gap-5 sm:px-6 sm:py-4">
      <div className="relative shrink-0 transition duration-300 group-hover/author:scale-[1.03]">
        <div className="absolute -inset-0.5 rounded-full bg-gradient-to-br from-[var(--accent)]/30 to-transparent opacity-0 blur-sm transition duration-300 group-hover/author:opacity-100" />
        <AuthorPhoto
          alt={`Portrait of ${authorName}`}
          width={64}
          height={64}
          className="relative h-14 w-14 rounded-full border-2 border-[var(--border)] object-cover shadow-md transition duration-300 group-hover/author:border-[var(--accent)]/50 group-hover/author:shadow-lg sm:h-16 sm:w-16"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--accent)] transition group-hover/author:tracking-[0.22em]">
          About the author
        </p>
        <p className="mt-1 font-serif text-lg font-semibold text-[var(--ink)] transition group-hover/author:text-[var(--accent)] sm:text-xl">
          {authorName}
        </p>
      </div>
    </div>
  );
}
