import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ReserveForm } from "./ReserveForm";

type Props = { params: Promise<{ bookId: string }> };

export default async function ReservePage({ params }: Props) {
  const { bookId } = await params;
  const book = await prisma.book.findFirst({
    where: { id: bookId, isAvailable: true },
    select: { id: true, title: true, author: true, priceCents: true },
  });
  if (!book) notFound();

  return (
    <main className="mx-auto max-w-lg px-4 py-12 sm:px-6">
      <Link
        href={`/books/${book.id}`}
        className="mb-8 inline-block text-sm font-medium text-[var(--accent)] hover:underline"
      >
        ← Book details
      </Link>
      <h1 className="font-serif text-2xl font-semibold text-[var(--ink)]">Reserve & pay</h1>
      <p className="mt-2 text-sm text-[var(--ink)]/60">
        Complete your details and upload proof of payment. We will confirm by email after review.
      </p>
      <div className="mt-8">
        <ReserveForm book={book} />
      </div>
    </main>
  );
}
