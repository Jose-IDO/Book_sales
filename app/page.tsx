import Link from "next/link";
import { AuthorPhoto } from "@/app/components/AuthorPhoto";
import { getStorefrontBooks } from "@/lib/storefront-data";
import { formatPrice } from "@/lib/money";

export default async function Home() {
  const books = await getStorefrontBooks();

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
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
              className="group flex flex-col gap-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm transition hover:border-[var(--accent-muted)] hover:shadow-md sm:flex-row sm:items-center sm:gap-8 sm:p-8"
            >
              <AuthorPhoto
                alt={`Portrait of ${book.author}`}
                width={160}
                height={200}
                className="mx-auto h-40 w-32 shrink-0 rounded-xl border border-[var(--border)] object-cover shadow-sm sm:mx-0"
              />
              <div className="min-w-0 flex-1 text-center sm:text-left">
              <p className="text-xs font-medium uppercase tracking-wider text-[var(--ink)]/45">
                ISBN {book.isbn}
              </p>
              <h2 className="mt-2 font-serif text-xl font-semibold text-[var(--ink)] group-hover:text-[var(--accent)]">
                {book.title}
              </h2>
              <p className="mt-1 text-sm text-[var(--ink)]/60">{book.author}</p>
              {book.priceCents > 0 && (
                <p className="mt-4 text-base font-semibold text-[var(--ink)]">
                  {formatPrice(book.priceCents)}
                </p>
              )}
              <p className="mt-4 text-sm font-medium text-[var(--accent)]">View details & reserve →</p>
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
