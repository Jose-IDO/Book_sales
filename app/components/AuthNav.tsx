"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase/client";
import { useFirebaseAuth } from "@/app/components/FirebaseAuthProvider";

const staticSite = process.env.NEXT_PUBLIC_DEPLOY_MODE === "static";

export function AuthNav() {
  const router = useRouter();
  const { user, loading, configured } = useFirebaseAuth();

  if (staticSite || !configured) {
    return null;
  }

  if (loading) {
    return (
      <span className="text-xs text-[var(--ink)]/40" aria-live="polite">
        Account…
      </span>
    );
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="relative text-[var(--ink)]/80 transition duration-300 after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:w-0 after:rounded-full after:bg-[var(--accent)] after:transition-all after:duration-300 hover:text-[var(--accent)] hover:after:w-full"
      >
        Sign in
      </Link>
    );
  }

  const label = user.email ?? `${user.uid.slice(0, 8)}…`;

  async function onSignOut() {
    await signOut(getFirebaseAuth());
    router.refresh();
  }

  return (
    <div className="flex items-center gap-3 text-sm">
      <span
        className="max-w-[140px] truncate text-[var(--ink)]/70"
        title={user.email ?? undefined}
      >
        {label}
      </span>
      <button
        type="button"
        onClick={() => void onSignOut()}
        className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-medium text-[var(--ink)]/80 transition hover:border-[var(--accent)]/40 hover:text-[var(--ink)]"
      >
        Sign out
      </button>
    </div>
  );
}
