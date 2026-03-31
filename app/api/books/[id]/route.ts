import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;
  const book = await prisma.book.findFirst({
    where: { id, isAvailable: true },
    select: {
      id: true,
      title: true,
      author: true,
      description: true,
      priceCents: true,
      coverImageUrl: true,
      stock: true,
    },
  });
  if (!book) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(book);
}
