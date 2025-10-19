# Eleutherios — Developer Setup & Demo Guide

This guide helps you run the **Next.js Frontend**, the **Resolver/API service**, and **Firebase Emulators** with **example data** so you can demo the Eleutherios flow end‑to‑end.

> TL;DR: Frontend on **http://localhost:3000**, Resolver/API on **http://localhost:3001**, Firebase Emulator UI on **http://localhost:4000**.

---

## 0) Prerequisites

- Node.js 18+ and npm or yarn
- Firebase CLI (`npm i -g firebase-tools`)
- A Google Cloud project (for real deployments later) — *not required for local demo*
- Python 3 (optional; for seeding scripts) or just use the provided `curl`

---

## 1) Repos & Directory Layout

```
/app/                      # Next.js frontend (UI demo)
/services/resolver-next/   # Next.js API routes (Policy/Forum/Events/Verify)
/firebase/                 # Emulator config, Functions (optional)
/docs/                     # ENDPOINTS.md, SECURITY_MODEL.md, FIREBASE_SETUP.md
```

> If your repo differs, keep the two servers separated by ports: **3000** (frontend) and **3001** (resolver).

---

## 2) Environment Variables

### Frontend (`/app/`)

Create `app/.env.local`:
```
NEXT_PUBLIC_API_BASE=http://localhost:3001
NEXT_PUBLIC_VERIFY_BASE=http://localhost:3001/api/verify
```

Start the frontend:
```bash
cd app
npm i
npm run dev   # opens http://localhost:3000
```

### Resolver/API (`/services/resolver-next/`)

Create `services/resolver-next/.env.local` from example:
```
FIREBASE_PROJECT_ID=eleutherios-dev
FIREBASE_EMULATORS_HOST=localhost
FIREBASE_EMULATORS_PORT=8080
RESOLVER_DEV_SECRET=dev-secret
PORT=3001
```

Start the resolver:
```bash
cd services/resolver-next
npm i
npm run dev   # opens API at http://localhost:3001
```

---

## 3) Firebase Emulators (Firestore + Functions)

From the repo root (or `/firebase` directory if you keep it separate):

```bash
firebase emulators:start
```

Open the Emulator UI at **http://localhost:4000** to view Firestore collections and logs.

> Note: Admin SDK used by API routes bypasses Firestore Security Rules. Authorization is enforced in API handlers.

---

## 4) Key URLs (Local Demo)

**Frontend (Next.js):**
- `http://localhost:3000/` — main UI demo

**Resolver/API (Next.js API routes):**
- Product Hub UI: `http://localhost:3001/pp/09412345678903/XYZ123`
- Policy (JSON): `http://localhost:3001/pp/09412345678903/XYZ123/policy`
- Forum UI: `http://localhost:3001/forum/pp/09412345678903/XYZ123`
- Events API: `http://localhost:3001/api/events?gtin=09412345678903&serial=XYZ123`
- Forum API:  `http://localhost:3001/api/forum?gtin=09412345678903&serial=XYZ123`
- Health: `http://localhost:3001/api/health`
- **Verify (proof check):** `http://localhost:3001/api/verify/<proofId>`

---

## 5) Seed Example Data

### Add an event
```bash
curl -s -X POST "http://localhost:3001/api/events?gtin=09412345678903&serial=XYZ123"   -H "Content-Type: application/json"   -H "Authorization: Bearer dev-secret"   -d '{"event_type":"RepairPerformed","payload":{"parts":["gasket-A2"],"co2_avoided":0.8}}'
```

### Read events
```bash
curl -s "http://localhost:3001/api/events?gtin=09412345678903&serial=XYZ123"
```

### Add a forum message
```bash
curl -s -X POST "http://localhost:3001/api/forum?gtin=09412345678903&serial=XYZ123"   -H "Content-Type: application/json"   -H "Authorization: Bearer dev-secret"   -d '{"message":"Initial stakeholder note on maintenance procedure.","author":"demo-user"}'
```

---

## 6) Policy → Proofs Demo Flow

1. Open **Product Hub**: `http://localhost:3000/` (frontend) — configure it to use the GTIN/serial above.  
2. Trigger **Events** via the API (repair performed, inspection passed, etc.).  
3. The **Policy engine** evaluates events and emits a **Proof** (hash + signature) stored in Firestore.  
4. Retrieve a `proofId` from logs or the API response and open:  
   `http://localhost:3001/api/verify/<proofId>`  
   to see that the proof verifies without exposing payload/PHI.

*(Exact field names may vary in your current routes; see `/docs/ENDPOINTS.md`.)*

---

## 7) Common Tasks

- **Reset local data:** stop emulators and remove the Firestore emulator data dir (e.g., `firebase-data/`).  
- **Change ports:** set `PORT=3001` (resolver) and `NEXT_PUBLIC_API_BASE` accordingly.  
- **Auth:** use `Authorization: Bearer dev-secret` for local testing. Replace in prod with proper keys or OAuth.  
- **CORS:** allow `http://localhost:3000` to call `http://localhost:3001` during dev.

---

## 8) Production Notes (Preview)

- Run both services behind a reverse proxy (e.g., Vercel for frontend, Cloud Run for resolver).  
- Replace emulator vars with real Firebase service account/GCP settings.  
- Add logging/retention policies and a DPIA/PIA for your pilot.  
- Export proofs periodically to a public anchor (hash‑chain) for independent verification.

---

## 9) Troubleshooting

- **Blank page / 404:** check that the correct port is used (3000 UI, 3001 API).  
- **Unauthorized:** make sure `RESOLVER_DEV_SECRET` matches the bearer token in `curl`.  
- **Emulator not found:** `firebase emulators:start` and ensure `FIREBASE_EMULATORS_HOST/PORT` match your `.env`.  
- **CORS errors:** confirm frontend `NEXT_PUBLIC_API_BASE` matches the API origin exactly.

---

## 10) Scripts (suggested)

Add to `package.json` in repo root for convenience:

```json
{
  "scripts": {
    "dev:ui": "pnpm --filter app dev || npm --prefix app run dev",
    "dev:api": "pnpm --filter services/resolver-next dev || npm --prefix services/resolver-next run dev",
    "dev:emu": "firebase emulators:start",
    "dev:all": "concurrently \"npm run dev:emu\" \"npm run dev:api\" \"npm run dev:ui\""
  }
}
```

*(If you don’t use pnpm, replace with npm/yarn equivalents.)*

---

## 11) Glossary

- **PFSD:** Policy → Forum → Service → Data  
- **Proof:** A signed, hash‑anchored attestation derived from policy evaluation results  
- **/verify:** Public read-only endpoint that validates proofs without revealing raw payloads

---

**Happy hacking — open `http://localhost:3000` for the UI and `http://localhost:3001/api/health` to check the API is live.**
