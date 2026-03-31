import type { StorefrontBook } from "@/lib/catalog";
import { STATIC_CATALOG_BOOKS } from "@/lib/catalog";

function isStaticExportBuild() {
  return process.env.STATIC_EXPORT === "1";
}

export async function getStorefrontBooks(): Promise<StorefrontBook[]> {
  if (isStaticExportBuild()) {
    return STATIC_CATALOG_BOOKS;
  }
  const { prisma } = await import("@/lib/prisma");
  const rows = await prisma.book.findMany({
    where: { isAvailable: true },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      author: true,
      description: true,
      isbn: true,
      priceCents: true,
      stock: true,
    },
  });
  return rows;
}

export async function getStorefrontBookById(id: string): Promise<StorefrontBook | null> {
  if (isStaticExportBuild()) {
    return STATIC_CATALOG_BOOKS.find((b) => b.id === id) ?? null;
  }
  const { prisma } = await import("@/lib/prisma");
  const row = await prisma.book.findFirst({
    where: { id, isAvailable: true },
    select: {
      id: true,
      title: true,
      author: true,
      description: true,
      isbn: true,
      priceCents: true,
      stock: true,
    },
  });
  return row;
}
