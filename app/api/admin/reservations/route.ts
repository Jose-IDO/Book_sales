import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await prisma.reservation.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      book: {
        select: { id: true, title: true, author: true, priceCents: true },
      },
    },
  });

  return NextResponse.json(rows);
}
