import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export const runtime = "nodejs";

export async function GET(_req: Request, { params }: Params) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const reservation = await prisma.reservation.findUnique({
    where: { id },
    select: { proofPath: true, proofMime: true },
  });
  if (!reservation) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const absolute = path.join(process.cwd(), "uploads", reservation.proofPath);
  try {
    const buf = await readFile(absolute);
    return new NextResponse(buf, {
      headers: {
        "Content-Type": reservation.proofMime,
        "Content-Disposition": "inline",
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return NextResponse.json({ error: "File missing" }, { status: 404 });
  }
}
