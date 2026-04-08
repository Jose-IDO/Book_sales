# Firebase setup — remaining steps (Book sales app)

You already have a Firebase **project**, **Web app**, and **`firebaseConfig`**. This doc covers what is **left**: Auth settings, Firestore, **security rules**, Admin SDK env vars, **custom admin claims**, and optional file storage. For field-level data design, see **`docs/FIREBASE_DATA_MODEL.md`**. For a **line-by-line** explanation of Firestore rules, see **`docs/FIRESTORE_RULES_DETAILED.md`**.

---

## Security if credentials were ever pasted or committed

Treat any exposed **API key**, **service account private key**, or full JSON as **compromised**.

1. In [Google Cloud Console](https://console.cloud.google.com/) → **IAM & Admin → Service Accounts** → your Firebase admin key → **Keys** → **delete** the leaked key and create a **new** one. Store the new JSON only in `.env.local` / host secrets — **never** in Git or docs.
2. **Web API keys** cannot be fully “hidden” in the browser; restrict abuse with [API key restrictions](https://console.cloud.google.com/apis/credentials) (HTTP referrers, etc.) and Firebase App Check when you are ready.
3. This repo reads secrets **only** from environment variables (`FIREBASE_SERVICE_ACCOUNT_JSON`, `NEXT_PUBLIC_*`). Do not commit `*-firebase-adminsdk-*.json` (see `.gitignore`).

---

## Table of contents

1. [What Firebase handles](#1-what-firebase-handles)
2. [Authentication (quick checks)](#2-authentication-quick-checks)
3. [Firestore](#3-firestore)
4. [Publish Firestore rules](#4-publish-firestore-rules)
5. [Admin users (`bookRegistry` access)](#5-admin-users-bookregistry-access)
6. [External object storage (free tier options)](#6-external-object-storage-free-tier-options)
7. [“In-app only” and screenshot protection](#7-in-app-only-and-screenshot-protection)
8. [Firebase Storage (optional)](#8-firebase-storage-optional)
9. [Environment variables](#9-environment-variables)
10. [This repo’s Firebase modules](#10-this-repos-firebase-modules)
11. [Deploy notes (GitHub Pages vs Node host)](#11-deploy-notes-github-pages-vs-node-host)
12. [Checklist](#12-checklist)
13. [Troubleshooting](#13-troubleshooting)

---

## 1. What Firebase handles

| Need | Product |
|------|---------|
| Sign-in | **Authentication** |
| User profile + reservation flags in cloud | **Firestore** |
| Verify users on API routes | **Admin SDK** + **ID token** |
| Admin-only book id registry | **Firestore** `bookRegistry` + **custom claim** `admin` |

---

## 2. Authentication (quick checks)

1. **Build → Authentication → Sign-in method** — ensure **Email/Password** (or your providers) is enabled.
2. **Authentication → Settings → Authorized domains** — include `localhost`, your **production** host, and **`jose-ido.github.io`** if login runs on GitHub Pages.

---

## 3. Firestore

1. **Build → Firestore Database** — if not created, create it (production mode), pick a **region** close to users.
2. Data layout: **`docs/FIREBASE_DATA_MODEL.md`** (`users/{uid}` with `bookReserve` map, `bookRegistry/{bookId}`).

---

## 4. Publish Firestore rules

1. Open **`firestore.rules`** in this repo (root).
2. Firebase Console → **Firestore → Rules** — paste the contents → **Publish**.
3. Read **`docs/FIRESTORE_RULES_DETAILED.md`** for a **granular** explanation of each `match` and condition.

**Summary:** Users read/write **only** `users/{theirUid}`. **`bookRegistry`** is **only** for users with **`admin: true`** custom claim (not the Firestore `isAdmin` field alone).

---

## 5. Admin users (`bookRegistry` access)

Firestore rules use **`request.auth.token.admin == true`**. Set the claim with the **Admin SDK** on a trusted machine (Node one-off script or API route you protect):

```js
const admin = require('firebase-admin');
// initializeApp with service account first
await admin.auth().setCustomUserClaims('THE_ADMIN_USER_UID', { admin: true });
```

The user must **sign out and back in** (or force token refresh) before the new claim appears.

---

## 6. External object storage (free tier options)

Use these for **large binaries** (e.g. book assets) if you do not want them in your repo or primary DB. Pricing changes — confirm on each vendor’s site.

| Option | Rough free tier (verify live) | Notes |
|--------|------------------------------|--------|
| **Cloudflare R2** | On the order of **10 GB-month** storage, **many** Class A/B ops; **no egress** to internet per [R2 pricing](https://developers.cloudflare.com/r2/pricing/) | S3-compatible; pair with Workers or your Next.js server for **signed** access |
| **Backblaze B2** | Free tier with **limited** stored GB and daily caps | S3-compatible API; watch **download** pricing |
| **Storj** | Free tier programs vary | Decentralized; check egress and terms |
| **Supabase Storage** | Smaller free bucket | Simple if you already use Supabase |

**Firebase Storage** is also valid if “external” is not a hard requirement; rules and Admin SDK integrate tightly with Auth.

---

## 7. “In-app only” and screenshot protection

- **Web browsers cannot enforce DRM** or reliably block **screenshots**, **screen recording**, or “Save as…” on content the user can see. `user-select: none` and disabling right-click are **easy to bypass**.
- Reasonable mitigations: **short-lived signed URLs**, **server-side proxy** that checks auth, **watermarks**, **rate limits**, **App Check**, and **legal/terms**. For strong control, use **platform readers** (native apps with platform APIs), not a generic website alone.

---

## 8. Firebase Storage (optional)

If you store **payment proofs** or small files in Firebase: **Build → Storage** → create bucket → set **rules** (example: user can write only under `proofs/{uid}/...`; admin reads via Admin SDK). Do not use permissive `read: if true` for sensitive files.

---

## 9. Environment variables

Copy **`.env.example`** → **`.env.local`** and fill values. Never commit `.env.local`.

**Client (`NEXT_PUBLIC_*`)** — from your Web app `firebaseConfig`:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` (optional, Analytics)

**Server only** — one of:

- **`FIREBASE_SERVICE_ACCOUNT_JSON`** — entire service account JSON as **one line** (common on Vercel/hosting), **or**
- **`GOOGLE_APPLICATION_CREDENTIALS`** — absolute path to the JSON file on your machine

---

## 10. This repo’s Firebase modules

After `npm install`:

- **`lib/firebase/client.ts`** — browser SDK; reads `NEXT_PUBLIC_FIREBASE_*`. Call `isFirebaseClientConfigured()` before enabling login UI in builds that omit env vars.
- **`lib/firebase/admin.ts`** — server-only Admin SDK; verifies ID tokens and talks to Firestore as admin. **Import only from API routes, Server Actions, or server components** that do not leak secrets.

Dependencies: **`firebase`**, **`firebase-admin`** (see `package.json`).

### Reservations + Firestore sync (implemented)

- **Shop sign-in:** `/login` (email/password). Header shows **Sign in** / account / **Sign out** when `NEXT_PUBLIC_FIREBASE_*` is set.
- **Reserve flow:** On the full Node app (not static export), if **Admin SDK** env is set (`FIREBASE_SERVICE_ACCOUNT_JSON` or `GOOGLE_APPLICATION_CREDENTIALS`), `POST /api/reservations` requires `Authorization: Bearer <Firebase ID token>`. The form email must match the token’s email; Prisma stores `firebaseUid`.
- **If Admin SDK env is missing:** reservations still work **without** Firebase login (local dev).
- **Admin approve:** When a reservation moves to **APPROVED**, the server ensures the book has `registryEightDigitId`, then writes **`bookRegistry/{id}`** and **`users/{firebaseUid}.bookReserve[id]=1`** when Firestore is configured (see `lib/firestore-sync.ts`).

**Production:** set **both** client (`NEXT_PUBLIC_*`) and server (service account) env vars on your host so buyers must sign in and Firestore stays in sync.

---

## 11. Deploy notes (GitHub Pages vs Node host)

- **GitHub Pages** is static: **no** `firebase-admin` there. Client login can work if **authorized domains** include Pages; API calls must go to a **Node** deployment (e.g. Vercel) with server env vars set.
- **Full** reservations + Prisma + token verification need the **Next.js server** (or another backend) deployed with **`FIREBASE_SERVICE_ACCOUNT_JSON`** (or credentials path).

---

## 12. Checklist

- [ ] Authorized domains complete  
- [ ] Firestore created; **`firestore.rules`** published  
- [ ] Admin UIDs have **`admin: true`** custom claim; token refreshed  
- [ ] `.env.local` / host secrets set; **no** keys in Git  
- [ ] Leaked keys **rotated** if exposure occurred  

---

## 13. Troubleshooting

| Problem | Check |
|---------|--------|
| `auth/unauthorized-domain` | Domain added under **Authentication → Settings** |
| `PERMISSION_DENIED` on `users/...` | Signed in? Path is `users/{uid}` matching `request.auth.uid`? |
| Admin cannot access `bookRegistry` | Custom claim set and **token refreshed**? |
| Admin SDK fails locally | `FIREBASE_SERVICE_ACCOUNT_JSON` valid JSON? Or `GOOGLE_APPLICATION_CREDENTIALS` path? |

---

## Quick links

- [Firebase Console](https://console.firebase.google.com/)
- [Firestore rules docs](https://firebase.google.com/docs/firestore/security/get-started)
- [Custom claims](https://firebase.google.com/docs/auth/admin/custom-claims)
- [Admin Node.js setup](https://firebase.google.com/docs/admin/setup)

---

*Trimmed for projects that already have Firebase project + Web config. Extend rules and collections only with explicit `match` blocks above the default deny in `firestore.rules`.*
