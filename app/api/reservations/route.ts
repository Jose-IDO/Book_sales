import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  ALLOWED_PROOF_MIMES,
  MAX_PROOF_BYTES,
  saveProofFile,
} from "@/lib/uploads";
import { sendAdminReservationNotice } from "@/lib/email";
import { verifyIdToken } from "@/lib/firebase/admin";
import { isFirebaseAdminConfigured } from "@/lib/firebase/server-ready";

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

  let firebaseUid: string | null = null;
  if (isFirebaseAdminConfigured()) {
    const header = req.headers.get("authorization");
    const match = header?.match(/^Bearer\s+(\S+)/i);
    const token = match?.[1];
    if (!token) {
      return NextResponse.json(
        { error: "Sign in required. Open Sign in, then try again." },
        { status: 401 }
      );
    }
    try {
      const decoded = await verifyIdToken(token);
      const tokenEmail = decoded.email?.toLowerCase().trim();
      if (!tokenEmail) {
        return NextResponse.json(
          { error: "Your account must have an email address to reserve." },
          { status: 400 }
        );
      }
      if (tokenEmail !== buyerEmail.toLowerCase().trim()) {
        return NextResponse.json(
          { error: "Email must match your signed-in account." },
          { status: 403 }
        );
      }
      firebaseUid = decoded.uid;
    } catch {
      return NextResponse.json(
        { error: "Invalid or expired session. Sign in again." },
        { status: 401 }
      );
    }
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
      firebaseUid,
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
