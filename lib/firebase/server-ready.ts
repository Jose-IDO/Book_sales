/**
 * True when the server can verify Firebase ID tokens (Admin SDK credentials present).
 */
export function isFirebaseAdminConfigured(): boolean {
  return Boolean(
    process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim() ||
      process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim()
  );
}

/**
 * Reservations require a verified ID token only when Admin SDK is set **and** the Web client
 * config is present, so a server-only credential without NEXT_PUBLIC_* does not brick the form.
 */
export function isReservationFirebaseAuthEnforced(): boolean {
  if (!isFirebaseAdminConfigured()) return false;
  return Boolean(process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim());
}
