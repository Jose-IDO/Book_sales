import admin from "firebase-admin";

function initApp(): admin.app.App {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (json?.trim()) {
    try {
      const cred = JSON.parse(json) as admin.ServiceAccount;
      return admin.initializeApp({
        credential: admin.credential.cert(cred),
      });
    } catch {
      throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON is not valid JSON.");
    }
  }

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  }

  throw new Error(
    "Firebase Admin is not configured. Set FIREBASE_SERVICE_ACCOUNT_JSON or GOOGLE_APPLICATION_CREDENTIALS (see docs/FIREBASE_SETUP.md)."
  );
}

export function getFirebaseAdminApp(): admin.app.App {
  return initApp();
}

export function getAdminAuth(): admin.auth.Auth {
  return getFirebaseAdminApp().auth();
}

export function getAdminFirestore(): admin.firestore.Firestore {
  return getFirebaseAdminApp().firestore();
}

export async function verifyIdToken(idToken: string): Promise<admin.auth.DecodedIdToken> {
  return getAdminAuth().verifyIdToken(idToken);
}
