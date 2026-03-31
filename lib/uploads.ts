import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

const UPLOAD_ROOT = path.join(process.cwd(), "uploads", "proofs");

const MIME_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "application/pdf": "pdf",
};

export const ALLOWED_PROOF_MIMES = new Set(Object.keys(MIME_EXT));
export const MAX_PROOF_BYTES = 8 * 1024 * 1024;

export function extForMime(mime: string): string | undefined {
  return MIME_EXT[mime];
}

export async function saveProofFile(mime: string, buffer: Buffer): Promise<string> {
  const ext = extForMime(mime);
  if (!ext) throw new Error("Unsupported file type");
  await mkdir(UPLOAD_ROOT, { recursive: true });
  const id = randomUUID();
  const relative = path.join("proofs", `${id}.${ext}`);
  const absolute = path.join(process.cwd(), "uploads", relative);
  await writeFile(absolute, buffer);
  return relative;
}
