import { FieldValue } from "firebase-admin/firestore";
import { getAdminFirestore } from "@/lib/firebase/admin";
import { isFirebaseAdminConfigured } from "@/lib/firebase/server-ready";

export type SyncApprovedParams = {
  firebaseUid: string | null;
  registryEightDigitId: string;
  bookTitle: string;
};

/**
 * After admin approves a reservation: upsert bookRegistry and set users/{uid}.bookReserve[id]=1.
 * No-op if Admin SDK env is missing (local dev without Firebase).
 */
export async function syncApprovedReservationToFirestore(
  params: SyncApprovedParams
): Promise<void> {
  if (!isFirebaseAdminConfigured()) return;

  const { firebaseUid, registryEightDigitId, bookTitle } = params;
  const db = getAdminFirestore();

  await db.collection("bookRegistry").doc(registryEightDigitId).set(
    {
      title: bookTitle,
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  if (!firebaseUid) return;

  await db
    .collection("users")
    .doc(firebaseUid)
    .set(
      {
        bookReserve: { [registryEightDigitId]: 1 },
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
}
