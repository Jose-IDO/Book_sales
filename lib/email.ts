import nodemailer from "nodemailer";

function hasSmtp() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

export async function sendAdminReservationNotice(params: {
  bookTitle: string;
  buyerName: string;
  buyerEmail: string;
  reservationId: string;
}) {
  const to = process.env.ADMIN_NOTIFY_EMAIL || process.env.SMTP_USER;
  if (!to) {
    console.warn(
      "[email] No ADMIN_NOTIFY_EMAIL or SMTP_USER — skipping reservation email. Set env vars to enable."
    );
    return { sent: false, reason: "no_recipient" as const };
  }

  const subject = `New book reservation: ${params.bookTitle}`;
  const dashboardUrl =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "http://localhost:3000";
  const text = [
    `A customer submitted payment proof for a reservation.`,
    ``,
    `Book: ${params.bookTitle}`,
    `Buyer: ${params.buyerName} <${params.buyerEmail}>`,
    `Reservation ID: ${params.reservationId}`,
    ``,
    `Review in admin: ${dashboardUrl}/admin`,
  ].join("\n");

  if (!hasSmtp()) {
    console.log("[email] SMTP not configured — would send to", to);
    console.log(subject);
    console.log(text);
    return { sent: false, reason: "smtp_not_configured" as const };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to,
    subject,
    text,
  });

  return { sent: true as const };
}
