"use client";

import { useState } from "react";
import Link from "next/link";

type Book = { id: string; title: string; author: string; priceCents: number };

function formatPrice(cents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    cents / 100
  );
}

export function ReserveForm({ book }: { book: Book }) {
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
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
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 shadow-sm sm:p-10">
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="font-serif text-2xl font-semibold text-[var(--ink)]">Book reserved</h2>
          <p className="mt-3 text-[var(--ink)]/70">
            Thank you. Your payment proof was received. This reservation will be reviewed and
            approved shortly.
          </p>
          <Link
            href="/"
            className="mt-8 inline-block rounded-full border border-[var(--border)] bg-white px-6 py-2.5 text-sm font-medium text-[var(--ink)] hover:border-[var(--accent-muted)]"
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
      className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm sm:p-8"
    >
      <p className="text-sm text-[var(--ink)]/60">
        {book.author} — <span className="font-medium text-[var(--ink)]">{book.title}</span>
      </p>
      <p className="mt-1 text-lg font-semibold text-[var(--ink)]">{formatPrice(book.priceCents)}</p>

      <div className="mt-8 space-y-5">
        <label className="block">
          <span className="text-sm font-medium text-[var(--ink)]">Your name</span>
          <input
            required
            value={buyerName}
            onChange={(e) => setBuyerName(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-white px-4 py-2.5 text-[var(--ink)] outline-none ring-[var(--accent)]/30 focus:ring-2"
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
            className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-white px-4 py-2.5 text-[var(--ink)] outline-none ring-[var(--accent)]/30 focus:ring-2"
            autoComplete="email"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-[var(--ink)]">Note (optional)</span>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={2}
            className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-white px-4 py-2.5 text-[var(--ink)] outline-none ring-[var(--accent)]/30 focus:ring-2"
            placeholder="Anything we should know?"
          />
        </label>
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
      </div>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="mt-8 w-full rounded-full bg-[var(--accent)] py-3.5 text-sm font-semibold text-white transition hover:bg-[var(--ink)] disabled:opacity-50"
      >
        {submitting ? "Submitting…" : "Submit reservation"}
      </button>
    </form>
  );
}
