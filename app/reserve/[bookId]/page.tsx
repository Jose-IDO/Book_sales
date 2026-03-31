import Link from "next/link";
import { notFound } from "next/navigation";
import { getStorefrontBookById, getStorefrontBooks } from "@/lib/storefront-data";
import { PaymentBankingCard } from "@/app/components/PaymentBankingCard";
import { ReserveForm } from "./ReserveForm";

type Props = { params: Promise<{ bookId: string }> };

export async function generateStaticParams() {
  const books = await getStorefrontBooks();
  return books.map((b) => ({ bookId: b.id }));
}

export default async function ReservePage({ params }: Props) {
  const { bookId } = await params;
  const book = await getStorefrontBookById(bookId);
  if (!book) notFound();

  return (
    <main className="mx-auto max-w-lg px-4 py-12 sm:px-6">
      <Link
        href={`/books/${book.id}`}
        className="mb-8 inline-block text-sm font-medium text-[var(--accent)] transition duration-300 hover:translate-x-[-2px] hover:text-[var(--ink)] hover:underline"
      >
        ← Book details
      </Link>
      <h1 className="font-serif text-2xl font-semibold text-[var(--ink)]">Reserve & pay</h1>
      <p className="mt-2 text-sm text-[var(--ink)]/60">
        Use the banking details below, then send your proof of payment. We will confirm by email
        after review.
      </p>

      <div className="mt-8 space-y-8">
        <PaymentBankingCard />
        <ReserveForm book={book} />
      </div>
    </main>
  );
}
