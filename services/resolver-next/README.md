# Eleutherios DPP Resolver (Next.js)

A minimal resolver that gives every product a **Policy**, **Forum**, **Service actions**, and **Data (events)** route.

## Key URLs (dev)
- Product hub: `/pp/[gtin]/[serial]`
- Policy (JSON): `/pp/[gtin]/[serial]/policy`
- Forum (UI): `/forum/pp/[gtin]/[serial]`
- Events API (GET/POST): `/api/events?gtin=...&serial=...`
- Forum API (GET/POST):  `/api/forum?gtin=...&serial=...`
- Health: `/api/health`

## Quick start
```bash
cd services/resolver-next
cp .env.local.example .env.local   # fill values
npm i
npm run dev
```

## Test
```bash
# add event
curl -s -X POST "http://localhost:3001/api/events?gtin=09412345678903&serial=XYZ123"   -H "Content-Type: application/json"   -H "Authorization: Bearer dev-secret"   -d '{"event_type":"RepairPerformed","payload":{"parts":["gasket-A2"],"co2_avoided":0.8}}'

# read events
curl -s "http://localhost:3001/api/events?gtin=09412345678903&serial=XYZ123"
```

## Notes
- Firestore is used for persistence. Admin SDK runs in API routes.
- Firestore **rules do not apply** to Admin SDK; we enforce auth in the routes.
- See `/docs/ENDPOINTS.md`, `/docs/SECURITY_MODEL.md`, and `/docs/FIREBASE_SETUP.md`.
