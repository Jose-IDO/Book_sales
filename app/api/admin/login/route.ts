import { NextResponse } from "next/server";
import { signAdminToken, setAdminCookie } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const password = typeof body?.password === "string" ? body.password : "";
  const expected = process.env.ADMIN_PASSWORD;

  if (!expected) {
    return NextResponse.json(
      { error: "Server is not configured for admin login" },
      { status: 503 }
    );
  }
  if (password !== expected) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const token = await signAdminToken();
  await setAdminCookie(token);
  return NextResponse.json({ ok: true });
}
