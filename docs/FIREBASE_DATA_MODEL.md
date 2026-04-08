# Firestore data model (Bound & Co. / books app)

This complements `docs/FIREBASE_SETUP.md`. **Do not** store secrets or service account JSON in the repo.

---

## Collections

### `users/{uid}`

| Field | Type | Notes |
|-------|------|--------|
| `email` | string | Mirror from Auth for convenience |
| `displayName` | string | optional |
| `phone` | string | optional |
| `isAdmin` | boolean | **Informational only in Firestore** — do **not** trust this for security. Use **custom claims** (`admin: true`) for rules that gate admin data. You may still mirror `isAdmin` here for UI. |
| `bookReserve` | map | Keys: **8-digit book id** (string, e.g. `"48291037"`). Values: **number** `0` or `1`. **`0`** = not reserved / not admin-confirmed. **`1`** = reserved and admin confirmed. **Default:** omit key or use `0` for “not confirmed”. |
| `createdAt` | timestamp | optional |
| `updatedAt` | timestamp | optional |

**Document ID** must equal Firebase Auth `uid`.

**Encoding note:** The “trailing digit” requirement is represented as the **map value** (`0` | `1`) rather than appending a digit to the id string, which keeps book ids stable and queryable.

---

### `bookRegistry/{bookId}`

| Field | Type | Notes |
|-------|------|--------|
| *(document id)* | string | **Random 8-digit** id (e.g. `10000000`–`99999999`), unique in this collection |
| `createdAt` | timestamp | optional |
| `title` | string | optional internal label |
| *(other admin fields)* | any | Only server/admin tooling should write |

**Access:** Firestore rules should allow **read/write only** when `request.auth.token.admin == true`. Regular clients must **not** be able to list or read this collection.

---

## Generating an 8-digit book id (app / Admin SDK)

Use a cryptographically random integer in range `[10000000, 99999999]`, check uniqueness against `bookRegistry` (or your source of truth), and retry on collision.

---

## Source of truth

- **Catalog / storefront** may stay in Prisma/SQLite for now; **`bookRegistry`** is the admin-only registry of valid book ids for Firestore-backed flows.
- **Prisma `Book.registryEightDigitId`** mirrors the Firestore registry key (allocated on first approval if missing). **`Reservation.firebaseUid`** is set when the buyer submitted with a verified ID token.
- On **admin approve** (`PATCH /api/admin/reservations/:id` with `APPROVED`), the server updates Prisma and calls **`syncApprovedReservationToFirestore`** (`lib/firestore-sync.ts`): upserts **`bookRegistry/{registryEightDigitId}`** and sets **`users/{firebaseUid}.bookReserve[registryEightDigitId] = 1`** when Admin SDK env is configured.
