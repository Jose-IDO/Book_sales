# Firestore security rules — line-by-line reference

Copy the **canonical rules** from `firestore.rules` in the repo root into **Firebase Console → Firestore → Rules**, then **Publish**. Test in the **Rules playground** with mock `request.auth` and paths.

---

## Preamble

```text
rules_version = '2';
```

**Line 1 — `rules_version = '2';`**  
Declares Firestore rules syntax v2 (required). Without it, the console rejects or migrates the ruleset.

```text
service cloud.firestore {
  match /databases/{database}/documents {
```

**`service cloud.firestore`**  
Scopes the file to Firestore (not Storage or Realtime DB).

**`match /databases/{database}/documents`**  
Every rules file nests matches under this path. `{database}` is the database id (usually `(default)`); you rarely need to branch on it.

---

## Users collection

```text
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
```

**`match /users/{userId}`**  
Matches documents at `users/<any string>`. The variable `userId` is the document id.

**`allow read, write:`**  
Grants **get**, **list** (for this doc only when rules allow), **create**, **update**, **delete** on that single document path. For a single-doc match, “read” is effectively that document.

**`request.auth != null`**  
There must be a signed-in user (Firebase Auth ID token presented with the request).

**`request.auth.uid == userId`**  
The authenticated user’s uid must **equal** the document id. So user `abc123` may only touch `users/abc123`, not `users/xyz789`.

**Implications**

- Users **cannot** read or write **another** user’s profile.
- **Unauthenticated** clients cannot read or write any `users/{userId}` doc.
- If you need **public** profile fields later, add a **separate** collection or field-level rules (more advanced); do not widen this match without a plan.

---

## Admin-only book registry

```text
    match /bookRegistry/{bookId} {
      allow read, write: if request.auth != null && request.auth.token.admin == true;
    }
```

**`match /bookRegistry/{bookId}`**  
Each book id is one document (e.g. `bookRegistry/48291037`).

**`request.auth.token.admin == true`**  
Uses a **custom claim** named `admin` on the ID token. You set this with the **Admin SDK** (server script or Cloud Function), not from the client. **Do not** rely on an `isAdmin` field in Firestore for this rule — clients could tamper with Firestore documents if rules allowed it; **claims** are signed by Firebase.

**Who can access**

- Only users whose token includes `"admin": true` can read/write documents in `bookRegistry`.
- Normal app users **cannot** list or fetch these docs if rules are published as above.

**Setting the claim (one-time per admin user)**

Run on a trusted server (replace `UID`):

```js
const admin = require('firebase-admin');
admin.auth().setCustomUserClaims('UID', { admin: true });
```

After that, the user must **refresh** their ID token (sign out/in or `getIdToken(true)` on the client).

---

## Default deny

```text
    match /{document=**} {
      allow read, write: if false;
    }
```

**`match /{document=**}`**  
Recursive match for **any** path not already handled **above** (order matters: first match wins).

**`allow read, write: if false`**  
Deny everything else. Any new collection **must** get its own `match` block **above** this catch-all.

---

## Closing braces

The closing `}` lines close the `documents`, `service`, and (implicitly) finish the ruleset.

---

## Common pitfalls

| Symptom | Check |
|---------|--------|
| Permission denied on own profile | User signed in? Document id exactly equals `uid`? |
| Admin cannot write `bookRegistry` | Custom claim `admin: true` set? Token refreshed after `setCustomUserClaims`? |
| Users see each other’s data | You added a rule that is too permissive; restore uid check. |
| Everything denied | Catch-all `if false` is correct; add explicit `match` for new collections. |

---

## Related files

- `firestore.rules` — paste into console  
- `docs/FIREBASE_DATA_MODEL.md` — field meanings  
- `docs/FIREBASE_SETUP.md` — env vars and setup  
