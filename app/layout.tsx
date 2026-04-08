import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/app/components/SiteHeader";
import { Providers } from "@/app/providers";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bound & Co. — Curated books",
  description: "Reserve titles with payment proof. We confirm every order by hand.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${fraunces.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        <Providers>
          <SiteHeader />
          <div className="flex-1">{children}</div>
        </Providers>
        <footer className="border-t border-[var(--border)] bg-white/60 py-8 text-center text-sm text-[var(--ink)]/60 transition-colors duration-300 hover:bg-white/90 hover:text-[var(--ink)]/75">
          © {new Date().getFullYear()} Bound & Co. — Independent book sales
        </footer>
      </body>
    </html>
  );
}
