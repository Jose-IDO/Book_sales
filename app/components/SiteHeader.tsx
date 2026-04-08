import Link from "next/link";
import { AuthNav } from "@/app/components/AuthNav";

const staticSite = process.env.NEXT_PUBLIC_DEPLOY_MODE === "static";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--paper)]/90 backdrop-blur-md transition-shadow duration-300 hover:shadow-sm hover:shadow-[var(--ink)]/5">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="font-serif text-xl font-semibold tracking-tight text-[var(--ink)] transition duration-300 hover:text-[var(--accent)] hover:drop-shadow-sm"
        >
          Bound & Co.
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link
            href="/"
            className="relative text-[var(--ink)]/80 transition duration-300 after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:w-0 after:rounded-full after:bg-[var(--accent)] after:transition-all after:duration-300 hover:text-[var(--accent)] hover:after:w-full"
          >
            Shop
          </Link>
          <AuthNav />
          {!staticSite && (
            <Link
              href="/admin/login"
              className="relative text-[var(--ink)]/50 transition duration-300 after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:w-0 after:rounded-full after:bg-[var(--ink)]/40 after:transition-all after:duration-300 hover:text-[var(--ink)] hover:after:w-full"
            >
              Admin
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
