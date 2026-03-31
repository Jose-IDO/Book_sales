export function getJwtSecretBytes(): Uint8Array {
  const fromEnv = process.env.JWT_SECRET?.trim();
  const fallback =
    process.env.NODE_ENV === "development"
      ? "dev-insecure-books-secret-change-me"
      : "";
  const s = fromEnv || fallback;
  if (!s || s.length < 16) {
    throw new Error("JWT_SECRET must be set (min 16 characters) in production");
  }
  return new TextEncoder().encode(s);
}
