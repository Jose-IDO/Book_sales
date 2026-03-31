"use client";

import { useState } from "react";
import Link from "next/link";
import { PAYMENT_BANKING } from "@/lib/payment-details";

type Book = { id: string; title: string; author: string; priceCents: number; isbn: string };

const staticSite = process.env.NEXT_PUBLIC_DEPLOY_MODE === "static";
const reservationEmail = process.env.NEXT_PUBLIC_RESERVATION_EMAIL ?? "";

function formatPrice(cents: number) {
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR" }).format(cents / 100);
}

export function ReserveForm({ book }: { book: Book }) {
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null); // only used when not staticSite
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (staticSite) {
      if (!reservationEmail.trim()) {
        setError(
          "This preview site has no inbox configured. Deploy the full app (e.g. Vercel) to upload proof online, or contact the seller directly."
        );
        return;
      }
      const subject = `Book reservation: ${book.title} (ISBN ${book.isbn})`;
      const body = [
        `Name: ${buyerName.trim()}`,
        `Reply-to email: ${buyerEmail.trim()}`,
        "",
        message.trim() ? `Note: ${message.trim()}\n\n` : "",
        "Payment reference:",
        `${PAYMENT_BANKING.accountName} · ${PAYMENT_BANKING.bankBranch} · ${PAYMENT_BANKING.accountNumber}`,
        "",
        "Please attach your payment proof (PDF or screenshot) to this email before sending.",
      ].join("\n");
      const mailto = `mailto:${reservationEmail.trim()}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailto;
      setDone(true);
      return;
    }

    if (!file) {
      setError("Please upload your payment proof (PDF or image).");
      return;
    }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.set("bookId", book.id);
      fd.set("buyerName", buyerName.trim());
      fd.set("buyerEmail", buyerEmail.trim());
      if (message.trim()) fd.set("message", message.trim());
      fd.set("proof", file);

      const res = await fetch("/api/reservations", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Something went wrong.");
        return;
      }
      setDone(true);
    } catch {
      setError("Network error. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 shadow-sm transition duration-300 hover:border-[var(--accent)]/20 hover:shadow-md sm:p-10">
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="font-serif text-2xl font-semibold text-[var(--ink)]">
            {staticSite ? "Next step: send your email" : "Book reserved"}
          </h2>
          <p className="mt-3 text-[var(--ink)]/70">
            {staticSite ? (
              <>
                Your email app should open with a draft to <strong>{reservationEmail}</strong>. Attach
                your payment proof, review the message, then send.
              </>
            ) : (
              <>
                Thank you. Your payment proof was received. This reservation will be reviewed and
                approved shortly.
              </>
            )}
          </p>
          <Link
            href="/"
            className="mt-8 inline-block rounded-full border border-[var(--border)] bg-white px-6 py-2.5 text-sm font-medium text-[var(--ink)] transition duration-300 hover:-translate-y-0.5 hover:border-[var(--accent)]/40 hover:shadow-md"
          >
            Back to shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm transition duration-300 hover:border-[var(--accent)]/15 hover:shadow-md sm:p-8"
    >
      <p className="text-xs font-medium uppercase tracking-wider text-[var(--ink)]/45">
        ISBN {book.isbn}
      </p>
      <p className="mt-2 text-sm text-[var(--ink)]/60">
        {book.author} — <span className="font-medium text-[var(--ink)]">{book.title}</span>
      </p>
      {book.priceCents > 0 && (
        <p className="mt-1 text-lg font-semibold text-[var(--ink)]">{formatPrice(book.priceCents)}</p>
      )}
      <p className="mt-3 text-sm text-[var(--ink)]/55">
        {staticSite
          ? "Enter your details, then submit to open an email draft. Attach your bank proof to that email before sending."
          : "After paying to the account above, upload your bank confirmation or receipt below."}
      </p>

      {staticSite && (
        <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-950/80">
          GitHub Pages hosts this site as static files only. Proof uploads and the admin dashboard
          need the full Node app (e.g. deploy the same repo to Vercel).
        </p>
      )}

      <div className="mt-8 space-y-5">
        <label className="block">
          <span className="text-sm font-medium text-[var(--ink)]">Your name</span>
          <input
            required
            value={buyerName}
            onChange={(e) => setBuyerName(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-white px-4 py-2.5 text-[var(--ink)] outline-none transition duration-200 hover:border-[var(--accent)]/25 focus:border-[var(--accent)]/40 focus:ring-2 focus:ring-[var(--accent)]/30"
            autoComplete="name"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-[var(--ink)]">Email</span>
          <input
            required
            type="email"
            value={buyerEmail}
            onChange={(e) => setBuyerEmail(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-white px-4 py-2.5 text-[var(--ink)] outline-none transition duration-200 hover:border-[var(--accent)]/25 focus:border-[var(--accent)]/40 focus:ring-2 focus:ring-[var(--accent)]/30"
            autoComplete="email"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-[var(--ink)]">Note (optional)</span>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={2}
            className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-white px-4 py-2.5 text-[var(--ink)] outline-none transition duration-200 hover:border-[var(--accent)]/25 focus:border-[var(--accent)]/40 focus:ring-2 focus:ring-[var(--accent)]/30"
            placeholder="Anything we should know?"
          />
        </label>
        {!staticSite && (
          <label className="block">
            <span className="text-sm font-medium text-[var(--ink)]">Payment proof</span>
            <p className="mt-0.5 text-xs text-[var(--ink)]/50">
              PDF, JPEG, PNG, or WebP — max 8MB
            </p>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,application/pdf"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="mt-2 block w-full text-sm text-[var(--ink)]/70 file:mr-4 file:rounded-lg file:border-0 file:bg-[var(--paper)] file:px-4 file:py-2 file:text-sm file:font-medium file:text-[var(--ink)]"
            />
          </label>
        )}
      </div>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="mt-8 w-full rounded-full bg-[var(--accent)] py-3.5 text-sm font-semibold text-white shadow-md transition duration-300 hover:-translate-y-0.5 hover:bg-[var(--ink)] hover:shadow-lg disabled:translate-y-0 disabled:opacity-50 disabled:shadow-md"
      >
        {submitting ? "Submitting…" : staticSite ? "Open email to complete reservation" : "Submit reservation"}
      </button>
    </form>
  );
}
