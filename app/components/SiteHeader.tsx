import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--paper)]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="font-serif text-xl font-semibold tracking-tight text-[var(--ink)]">
          Bound & Co.
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="text-[var(--ink)]/80 hover:text-[var(--accent)]">
            Shop
          </Link>
          <Link
            href="/admin/login"
            className="text-[var(--ink)]/50 hover:text-[var(--ink)]"
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
