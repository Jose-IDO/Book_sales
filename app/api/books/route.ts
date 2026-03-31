import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const books = await prisma.book.findMany({
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
  return NextResponse.json(books);
}
