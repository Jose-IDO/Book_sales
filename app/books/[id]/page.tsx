import Link from "next/link";
import { notFound } from "next/navigation";
import { AuthorPhoto } from "@/app/components/AuthorPhoto";
import { getStorefrontBookById, getStorefrontBooks } from "@/lib/storefront-data";
import { formatPrice } from "@/lib/money";

type Props = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  const books = await getStorefrontBooks();
  return books.map((b) => ({ id: b.id }));
}

export default async function BookPage({ params }: Props) {
  const { id } = await params;
  const book = await getStorefrontBookById(id);
  if (!book) notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="mb-8 inline-block text-sm font-medium text-[var(--accent)] hover:underline"
      >
        ← Back to shop
      </Link>

      <div className="flex flex-col gap-8 sm:flex-row sm:items-start">
        <div className="mx-auto shrink-0 sm:mx-0">
          <AuthorPhoto
            alt={`Portrait of ${book.author}`}
            width={280}
            height={360}
            priority
            className="h-auto max-h-[22rem] w-48 rounded-2xl border border-[var(--border)] object-cover shadow-sm sm:w-56"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wider text-[var(--ink)]/45">
            ISBN {book.isbn}
          </p>
          <p className="mt-2 text-sm font-medium uppercase tracking-widest text-[var(--accent)]">
            {book.author}
          </p>
          <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-[var(--ink)] sm:text-4xl">
            {book.title}
          </h1>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--ink)]/55">
          Abstract
        </h2>
        <div className="mt-4 whitespace-pre-wrap text-base leading-relaxed text-[var(--ink)]/80">
          {book.description}
        </div>
      </div>

      {book.priceCents > 0 && (
        <p className="mt-8 text-2xl font-semibold text-[var(--ink)]">
          {formatPrice(book.priceCents)}
        </p>
      )}
      {book.stock <= 3 && book.stock > 0 && (
        <p className="mt-2 text-sm text-[var(--accent)]">Only {book.stock} in stock</p>
      )}

      <div className="mt-10 flex flex-wrap gap-4">
        <Link
          href={`/reserve/${book.id}`}
          className="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--ink)]"
        >
          Reserve this book
        </Link>
      </div>
      <p className="mt-6 max-w-xl text-sm text-[var(--ink)]/55">
        On the next screen you will see banking details for payment, then you can send your proof
        (screenshot or PDF). We will confirm once your purchase is approved.
      </p>
    </main>
  );
}
