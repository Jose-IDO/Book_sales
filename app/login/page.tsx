"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getFirebaseAuth, isFirebaseClientConfigured } from "@/lib/firebase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!isFirebaseClientConfigured()) {
    return (
      <main className="mx-auto max-w-md px-4 py-16">
        <h1 className="font-serif text-2xl font-semibold text-[var(--ink)]">Account sign-in</h1>
        <p className="mt-4 text-sm text-[var(--ink)]/70">
          Firebase client environment variables are not set. Add{" "}
          <code className="rounded bg-[var(--paper)] px-1">NEXT_PUBLIC_FIREBASE_*</code> to{" "}
          <code className="rounded bg-[var(--paper)] px-1">.env.local</code> (see{" "}
          <code className="rounded bg-[var(--paper)] px-1">.env.example</code>), then restart{" "}
          <code className="rounded bg-[var(--paper)] px-1">npm run dev</code>.
        </p>
        <Link href="/" className="mt-8 inline-block text-sm font-medium text-[var(--accent)]">
          ← Back to shop
        </Link>
      </main>
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const auth = getFirebaseAuth();
      if (mode === "signup") {
        await createUserWithEmailAndPassword(auth, email.trim(), password);
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      }
      router.push("/");
      router.refresh();
    } catch (err: unknown) {
      const code = err && typeof err === "object" && "code" in err ? String((err as { code: string }).code) : "";
      const message =
        code === "auth/email-already-in-use"
          ? "That email is already registered. Try signing in."
          : code === "auth/invalid-credential" || code === "auth/wrong-password"
            ? "Incorrect email or password."
            : code === "auth/weak-password"
              ? "Password should be at least 6 characters."
              : "Could not complete sign-in. Check your details and try again.";
      setError(message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <h1 className="font-serif text-2xl font-semibold text-[var(--ink)]">
        {mode === "signin" ? "Sign in" : "Create account"}
      </h1>
      <p className="mt-2 text-sm text-[var(--ink)]/60">
        Use the same email you will use when reserving a book so we can match your payment proof.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-[var(--ink)]">Email</span>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-white px-4 py-2.5 text-[var(--ink)] outline-none transition focus:border-[var(--accent)]/40 focus:ring-2 focus:ring-[var(--accent)]/30"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-[var(--ink)]">Password</span>
          <input
            type="password"
            required
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-white px-4 py-2.5 text-[var(--ink)] outline-none transition focus:border-[var(--accent)]/40 focus:ring-2 focus:ring-[var(--accent)]/30"
          />
        </label>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-full bg-[var(--accent)] py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[var(--ink)] disabled:opacity-50"
        >
          {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--ink)]/60">
        {mode === "signin" ? (
          <>
            No account?{" "}
            <button
              type="button"
              className="font-medium text-[var(--accent)] underline-offset-2 hover:underline"
              onClick={() => {
                setMode("signup");
                setError(null);
              }}
            >
              Sign up
            </button>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <button
              type="button"
              className="font-medium text-[var(--accent)] underline-offset-2 hover:underline"
              onClick={() => {
                setMode("signin");
                setError(null);
              }}
            >
              Sign in
            </button>
          </>
        )}
      </p>

      <Link href="/" className="mt-8 block text-center text-sm text-[var(--ink)]/50 hover:text-[var(--ink)]">
        ← Back to shop
      </Link>
    </main>
  );
}
