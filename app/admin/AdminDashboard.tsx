"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type ReservationRow = {
  id: string;
  status: string;
  buyerName: string;
  buyerEmail: string;
  message: string | null;
  createdAt: string;
  book: { id: string; title: string; author: string; priceCents: number };
};

function money(cents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    cents / 100
  );
}

export function AdminDashboard() {
  const router = useRouter();
  const [rows, setRows] = useState<ReservationRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [actingId, setActingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    const res = await fetch("/api/admin/reservations");
    if (res.status === 401) {
      router.push("/admin/login");
      return;
    }
    if (!res.ok) {
      setError("Could not load reservations.");
      return;
    }
    const data = await res.json();
    setRows(data);
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  async function setStatus(id: string, status: "APPROVED" | "REJECTED" | "PENDING") {
    setActingId(id);
    try {
      const res = await fetch(`/api/admin/reservations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      if (!res.ok) {
        setError("Update failed.");
        return;
      }
      await load();
    } finally {
      setActingId(null);
    }
  }

  if (rows === null && !error) {
    return (
      <div className="py-20 text-center text-[var(--ink)]/50">Loading reservations…</div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-[var(--ink)]">Reservations</h1>
          <p className="mt-1 text-sm text-[var(--ink)]/55">
            Review payment proofs and approve or reject purchases.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => load()}
            className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-medium text-[var(--ink)] hover:bg-[var(--paper)]"
          >
            Refresh
          </button>
          <button
            type="button"
            onClick={logout}
            className="rounded-full border border-[var(--border)] px-4 py-2 text-sm text-[var(--ink)]/70 hover:text-[var(--ink)]"
          >
            Log out
          </button>
        </div>
      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>
      )}

      <div className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-white shadow-sm">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-[var(--border)] bg-[var(--paper)]/80 text-xs font-semibold uppercase tracking-wide text-[var(--ink)]/55">
            <tr>
              <th className="px-4 py-3">Book</th>
              <th className="px-4 py-3">Buyer</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {rows?.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-[var(--ink)]/45">
                  No reservations yet.
                </td>
              </tr>
            )}
            {rows?.map((r) => (
              <tr key={r.id} className="align-top">
                <td className="px-4 py-3">
                  <p className="font-medium text-[var(--ink)]">{r.book.title}</p>
                  <p className="text-xs text-[var(--ink)]/50">{r.book.author}</p>
                  <p className="mt-1 text-xs text-[var(--ink)]/60">{money(r.book.priceCents)}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="text-[var(--ink)]">{r.buyerName}</p>
                  <a href={`mailto:${r.buyerEmail}`} className="text-xs text-[var(--accent)] hover:underline">
                    {r.buyerEmail}
                  </a>
                  {r.message && (
                    <p className="mt-2 max-w-xs text-xs text-[var(--ink)]/55">{r.message}</p>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      r.status === "PENDING"
                        ? "rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-900"
                        : r.status === "APPROVED"
                          ? "rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-900"
                          : "rounded-full bg-zinc-200 px-2 py-0.5 text-xs font-medium text-zinc-800"
                    }
                  >
                    {r.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-xs text-[var(--ink)]/50">
                  {new Date(r.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex flex-wrap justify-end gap-2">
                    <a
                      href={`/api/admin/proofs/${r.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg border border-[var(--border)] px-2 py-1 text-xs font-medium text-[var(--ink)] hover:bg-[var(--paper)]"
                    >
                      Proof
                    </a>
                    {r.status === "PENDING" && (
                      <>
                        <button
                          type="button"
                          disabled={actingId === r.id}
                          onClick={() => setStatus(r.id, "APPROVED")}
                          className="rounded-lg bg-emerald-700 px-2 py-1 text-xs font-medium text-white hover:bg-emerald-800 disabled:opacity-50"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          disabled={actingId === r.id}
                          onClick={() => setStatus(r.id, "REJECTED")}
                          className="rounded-lg border border-red-200 bg-red-50 px-2 py-1 text-xs font-medium text-red-800 hover:bg-red-100 disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {r.status !== "PENDING" && (
                      <button
                        type="button"
                        disabled={actingId === r.id}
                        onClick={() => setStatus(r.id, "PENDING")}
                        className="rounded-lg border border-[var(--border)] px-2 py-1 text-xs text-[var(--ink)]/70 hover:bg-[var(--paper)] disabled:opacity-50"
                      >
                        Mark pending
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-6 text-center text-xs text-[var(--ink)]/40">
        <Link href="/" className="hover:text-[var(--accent)]">
          View storefront
        </Link>
      </p>
    </div>
  );
}
