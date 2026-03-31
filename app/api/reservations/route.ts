import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  ALLOWED_PROOF_MIMES,
  MAX_PROOF_BYTES,
  saveProofFile,
} from "@/lib/uploads";
import { sendAdminReservationNotice } from "@/lib/email";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const bookId = String(form.get("bookId") || "").trim();
  const buyerName = String(form.get("buyerName") || "").trim();
  const buyerEmail = String(form.get("buyerEmail") || "").trim();
  const message = String(form.get("message") || "").trim() || null;
  const proof = form.get("proof");

  if (!bookId || !buyerName || !buyerEmail) {
    return NextResponse.json(
      { error: "Book, name, and email are required" },
      { status: 400 }
    );
  }
  if (!buyerEmail.includes("@")) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  const book = await prisma.book.findFirst({
    where: { id: bookId, isAvailable: true },
  });
  if (!book) {
    return NextResponse.json({ error: "Book not available" }, { status: 404 });
  }

  if (!(proof instanceof File) || proof.size === 0) {
    return NextResponse.json({ error: "Payment proof file is required" }, { status: 400 });
  }
  if (proof.size > MAX_PROOF_BYTES) {
    return NextResponse.json({ error: "File too large (max 8MB)" }, { status: 400 });
  }

  const mime = proof.type || "application/octet-stream";
  if (!ALLOWED_PROOF_MIMES.has(mime)) {
    return NextResponse.json(
      { error: "Proof must be a PDF or image (JPEG, PNG, WebP)" },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await proof.arrayBuffer());

  let proofPath: string;
  try {
    proofPath = await saveProofFile(mime, buffer);
  } catch {
    return NextResponse.json({ error: "Could not save file" }, { status: 500 });
  }

  const reservation = await prisma.reservation.create({
    data: {
      bookId,
      buyerName,
      buyerEmail,
      message,
      proofPath,
      proofMime: mime,
    },
  });

  try {
    await sendAdminReservationNotice({
      bookTitle: book.title,
      buyerName,
      buyerEmail,
      reservationId: reservation.id,
    });
  } catch (e) {
    console.error("[email] Failed to notify admin:", e);
  }

  return NextResponse.json({
    ok: true,
    id: reservation.id,
    message:
      "Your book is reserved. We will review your payment proof and confirm shortly.",
  });
}
