"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Login failed.");
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16">
      <Link
        href="/"
        className="mb-8 text-sm text-[var(--accent)] transition duration-300 hover:translate-x-[-2px] hover:text-[var(--ink)] hover:underline"
      >
        ← Storefront
      </Link>
      <h1 className="font-serif text-2xl font-semibold text-[var(--ink)]">Admin sign in</h1>
      <p className="mt-2 text-sm text-[var(--ink)]/55">
        Enter the admin password to manage reservations.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-[var(--ink)]">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-white px-4 py-2.5 text-[var(--ink)] outline-none transition duration-200 hover:border-[var(--accent)]/25 focus:ring-2 focus:ring-[var(--accent)]/30"
            autoComplete="current-password"
          />
        </label>
        {error && (
          <p className="text-sm text-red-700" role="alert">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-[var(--ink)] py-3 text-sm font-semibold text-white shadow-md transition duration-300 hover:-translate-y-0.5 hover:bg-[var(--accent)] hover:shadow-lg disabled:translate-y-0 disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}
