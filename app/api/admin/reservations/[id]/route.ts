import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";
import { ReservationStatus } from "@prisma/client";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Params) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const status = body?.status as string | undefined;

  if (status !== "APPROVED" && status !== "REJECTED" && status !== "PENDING") {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const reservation = await prisma.reservation.findUnique({
    where: { id },
    include: { book: true },
  });
  if (!reservation) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const becomingApproved =
    status === "APPROVED" && reservation.status === "PENDING";

  await prisma.$transaction(async (tx) => {
    await tx.reservation.update({
      where: { id },
      data: { status: status as ReservationStatus },
    });

    if (becomingApproved && reservation.book.stock > 0) {
      await tx.book.update({
        where: { id: reservation.bookId },
        data: { stock: { decrement: 1 } },
      });
      const b = await tx.book.findUnique({ where: { id: reservation.bookId } });
      if (b && b.stock <= 0) {
        await tx.book.update({
          where: { id: reservation.bookId },
          data: { isAvailable: false },
        });
      }
    }
  });

  return NextResponse.json({ ok: true });
}
