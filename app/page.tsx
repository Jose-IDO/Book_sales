import Link from "next/link";
import { AuthorStrip } from "@/app/components/AuthorStrip";
import { BookCoverPlaceholder } from "@/app/components/BookCoverPlaceholder";
import { getStorefrontBooks } from "@/lib/storefront-data";
import { formatPrice } from "@/lib/money";

export default async function Home() {
  const books = await getStorefrontBooks();
  const spotlightAuthor = books[0]?.author;

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      {spotlightAuthor ? <AuthorStrip authorName={spotlightAuthor} /> : null}

      <div className="mb-12 max-w-2xl">
        <p className="mb-2 text-sm font-medium uppercase tracking-widest text-[var(--accent)]">
          Featured title
        </p>
        <h1 className="font-serif text-4xl font-semibold tracking-tight text-[var(--ink)] sm:text-5xl">
          Books worth owning
        </h1>
        <p className="mt-4 text-lg text-[var(--ink)]/70">
          Reserve with payment proof; we confirm your purchase after review.
        </p>
      </div>

      <ul className="grid gap-6 sm:grid-cols-1 lg:max-w-2xl">
        {books.map((book) => (
          <li key={book.id}>
            <Link
              href={`/books/${book.id}`}
              className="group/card flex flex-col gap-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm transition duration-300 ease-out hover:-translate-y-1 hover:border-[var(--accent)]/30 hover:shadow-xl hover:shadow-orange-900/10 sm:flex-row sm:items-stretch sm:gap-8 sm:p-8"
            >
              <div className="mx-auto shrink-0 transition duration-300 group-hover/card:scale-[1.02] sm:mx-0">
                <BookCoverPlaceholder title={book.title} />
              </div>
              <div className="min-w-0 flex-1 text-center sm:flex sm:flex-col sm:justify-center sm:text-left">
                <p className="text-xs font-medium uppercase tracking-wider text-[var(--ink)]/45 transition group-hover/card:text-[var(--ink)]/55">
                  ISBN {book.isbn}
                </p>
                <h2 className="mt-2 font-serif text-xl font-semibold text-[var(--ink)] transition duration-300 group-hover/card:text-[var(--accent)] sm:text-2xl">
                  {book.title}
                </h2>
                <p className="mt-1 text-sm text-[var(--ink)]/60">{book.author}</p>
                {book.priceCents > 0 && (
                  <p className="mt-4 text-base font-semibold text-[var(--ink)]">
                    {formatPrice(book.priceCents)}
                  </p>
                )}
                <p className="mt-5 inline-flex items-center justify-center gap-1 text-sm font-semibold text-[var(--accent)] transition duration-300 group-hover/card:gap-2 sm:justify-start">
                  View details & reserve
                  <span aria-hidden className="transition-transform duration-300 group-hover/card:translate-x-1">
                    →
                  </span>
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {books.length === 0 && (
        <p className="rounded-2xl border border-dashed border-[var(--border)] py-16 text-center text-[var(--ink)]/50">
          No books listed yet. Run <code className="rounded bg-[var(--border)]/50 px-1">npm run db:seed</code>{" "}
          after <code className="rounded bg-[var(--border)]/50 px-1">npx prisma db push</code>.
        </p>
      )}
    </main>
  );
}
