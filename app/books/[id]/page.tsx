import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/money";

type Props = { params: Promise<{ id: string }> };

export default async function BookPage({ params }: Props) {
  const { id } = await params;
  const book = await prisma.book.findFirst({
    where: { id, isAvailable: true },
  });
  if (!book) notFound();

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="mb-8 inline-block text-sm font-medium text-[var(--accent)] hover:underline"
      >
        ← Back to shop
      </Link>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="relative aspect-[2/3] max-h-[560px] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--border)]/30">
          {book.coverImageUrl ? (
            <Image
              src={book.coverImageUrl}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center font-serif text-8xl text-[var(--ink)]/15">
              {book.title.slice(0, 1)}
            </div>
          )}
        </div>

        <div>
          <p className="text-sm font-medium uppercase tracking-widest text-[var(--accent)]">
            {book.author}
          </p>
          <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-[var(--ink)] sm:text-4xl">
            {book.title}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-[var(--ink)]/75">{book.description}</p>
          <p className="mt-8 text-2xl font-semibold text-[var(--ink)]">
            {formatPrice(book.priceCents)}
          </p>
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
          <p className="mt-6 max-w-md text-sm text-[var(--ink)]/55">
            After you reserve, upload your payment proof (screenshot or PDF). We will email you once
            the purchase is approved.
          </p>
        </div>
      </div>
    </main>
  );
}
