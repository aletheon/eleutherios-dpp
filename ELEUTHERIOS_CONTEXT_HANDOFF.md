# Eleutherios DPP — Context Handoff (Start Here)

This note captures the *minimum context* to restart quickly in a new ChatGPT session.

---

## Project snapshot
- **Goal:** A Digital Product Policy (DPP) that gives any product a **Policy**, **Forum**, **Service actions**, and **Data (events)** (PFSD).
- **Stack:** Next.js (App Router, TypeScript), Firestore (Admin SDK), ENV-only auth.
- **Repo:** `eleutherios-dpp` (local path: `~/Desktop/flutter/eleutherios-dpp`)

## What’s already built
- Product hub: `/pp/[gtin]/[serial]`
- Policy (JSON): `/pp/[gtin]/[serial]/policy`
- Forum v0: `/forum/pp/[gtin]/[serial]` (+ API)
- Events API: `GET/POST /api/events?gtin=&serial=` (persisted in Firestore)
- Forum API: `GET/POST /api/forum?gtin=&serial=`
- `.well-known` resolver: `/.well-known/pp.json?gtin=&serial=`
- Firestore rules deployed; docs kit added to repo (ENDPOINTS, SECURITY_MODEL, FIREBASE_SETUP, etc.).

## Local run
```bash
cd services/resolver-next
cp .env.local.example .env.local
# set ENV-only Firebase creds in .env.local
npm i
npm run dev  # dev runs on http://localhost:3001
```

## ENV-only Firebase (Option 2)
Put this in `services/resolver-next/.env.local`:
```
NEXT_PUBLIC_BASE_URL=http://localhost:3001
FIREBASE_PROJECT_ID=eleutherios-dpp-7e586
FIREBASE_CLIENT_EMAIL=service-account@eleutherios-dpp-7e586.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
EVENTS_WRITE_TOKEN=dev-secret
FORUM_WRITE_TOKEN=dev-secret
```

## Firestore setup
- API enabled + database created (Native mode).  
- Admin SDK uses env vars (no `sa.json` file required).
- Admin SDK bypasses rules; route handlers enforce auth.

## Endpoints to test
```bash
# Add event
curl -s -X POST "http://localhost:3001/api/events?gtin=09412345678903&serial=XYZ123"   -H "Content-Type: application/json"   -H "Authorization: Bearer dev-secret"   -d '{"event_type":"RepairPerformed","payload":{"parts":["gasket-A2"],"co2_avoided":0.8}}'

# Read events
curl -s "http://localhost:3001/api/events?gtin=09412345678903&serial=XYZ123"
# Forum UI
open http://localhost:3001/forum/pp/09412345678903/XYZ123
# Policy JSON
open http://localhost:3001/pp/09412345678903/XYZ123/policy
```

## Security model (current)
- **GET** routes: public by default.
- **POST** routes: require `Authorization: Bearer <token>` if tokens are set in env.
- Next step (paid tier): per-tenant API keys + optional private GET.

## Business model (concise)
- **Free/Public:** open reads, rate-limited writes.
- **Pro/Enterprise:** private endpoints, API keys, dashboard, audit logs, SLA. Usage-based pricing per **verified event**.

## Pharmacy extension (idea)
- Each medication/batch gets a DPP with stock rules (ROP/ROQ), forum, and events (`StockReceived`, `Dispensed`, `ReorderRequested`, `TempExcursion`).
- A lightweight worker evaluates reorder rules on each dispense and triggers supplier webhooks.

## Files we added
- `services/resolver-next/README.md`, `.env.local.example`
- `docs/ENDPOINTS.md`, `docs/SECURITY_MODEL.md`, `docs/FIREBASE_SETUP.md`, `docs/FIRESTORE_RULES.md`, `docs/TENANTS_AND_API_KEYS.md`, `docs/PILOT_ONE_PAGER.md`
- Root: `firebase.json`, `.firebaserc`, `firestore.rules`
- `scripts/create-api-key.ts` (ENV-only variant available in chat)

## “Ask the next assistant” prompt
> “We have a Next.js DPP resolver with Policy/Forum/Events built and Firestore (Admin SDK) using ENV-only auth. Endpoints & docs are in `docs/`. Please: (1) add API key auth (multi-tenant) for POST and optional GET; (2) add a tiny dashboard (repairs, CO₂ avoided, recycle %); (3) generate QR label PDF for `/pp/[gtin]/[serial]`; (4) scaffold pharmacy stock events and a reorder worker.”

---

**Links**
- Surveys: Social housing & healthcare (Google Forms)
- Repo: https://github.com/aletheon/eleutherios-dpp (or local if private)

> Save this file in your repo (e.g., `ELEUTHERIOS_CONTEXT_HANDOFF.md`) or keep the download. It’s the minimum context needed to continue with a new session.
