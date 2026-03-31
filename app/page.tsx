import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/money";

export default async function Home() {
  const books = await prisma.book.findMany({
    where: { isAvailable: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-12 max-w-2xl">
        <p className="mb-2 text-sm font-medium uppercase tracking-widest text-[var(--accent)]">
          Curated selection
        </p>
        <h1 className="font-serif text-4xl font-semibold tracking-tight text-[var(--ink)] sm:text-5xl">
          Books worth owning
        </h1>
        <p className="mt-4 text-lg text-[var(--ink)]/70">
          Browse titles, reserve with payment proof, and we will confirm your purchase shortly.
        </p>
      </div>

      <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {books.map((book) => (
          <li key={book.id}>
            <Link
              href={`/books/${book.id}`}
              className="group block overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm transition hover:border-[var(--accent-muted)] hover:shadow-md"
            >
              <div className="relative aspect-[2/3] bg-[var(--border)]/40">
                {book.coverImageUrl ? (
                  <Image
                    src={book.coverImageUrl}
                    alt=""
                    fill
                    className="object-cover transition duration-300 group-hover:scale-[1.02]"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center font-serif text-4xl text-[var(--ink)]/20">
                    {book.title.slice(0, 1)}
                  </div>
                )}
              </div>
              <div className="p-5">
                <h2 className="font-serif text-lg font-semibold text-[var(--ink)] group-hover:text-[var(--accent)]">
                  {book.title}
                </h2>
                <p className="mt-1 text-sm text-[var(--ink)]/60">{book.author}</p>
                <p className="mt-3 text-base font-semibold text-[var(--ink)]">
                  {formatPrice(book.priceCents)}
                </p>
                {book.stock <= 3 && book.stock > 0 && (
                  <p className="mt-2 text-xs text-[var(--accent)]">Only {book.stock} left</p>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {books.length === 0 && (
        <p className="rounded-2xl border border-dashed border-[var(--border)] py-16 text-center text-[var(--ink)]/50">
          No books listed yet. Run the seed script to add sample titles.
        </p>
      )}
    </main>
  );
}
