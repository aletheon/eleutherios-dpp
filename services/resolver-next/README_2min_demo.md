# Eleutherios — 2‑Minute Demo (PFSD → Proofs → Verify)

This shows the end‑to‑end flow using the local API.

## Prereqs
- App running at http://localhost:3000
- Firestore (emulator or prod) configured for your app
- `RESOLVER_DEV_SECRET=dev-secret` in `.env.local`

## 1) Seed / choose a product
Create the doc `products/09412345678903_XYZ123` (or let the POST create subcollections automatically).

## 2) Post events (fail → remediate → pass)
```bash
# (a) FAIL
curl -s -X POST http://localhost:3000/api/events   -H "Content-Type: application/json" -H "Authorization: Bearer dev-secret"   -d '{"productId":"09412345678903_XYZ123","event_type":"InspectionFailed","payload":{"reason":"ventilation"}}'

# (b) REMEDIATE
curl -s -X POST http://localhost:3000/api/events   -H "Content-Type: application/json" -H "Authorization: Bearer dev-secret"   -d '{"productId":"09412345678903_XYZ123","event_type":"RepairPerformed","payload":{"fix":"install extractor fan"}}'

# (c) PASS → returns proofId
curl -s -X POST http://localhost:3000/api/events   -H "Content-Type: application/json" -H "Authorization: Bearer dev-secret"   -d '{"productId":"09412345678903_XYZ123","event_type":"InspectionPassed","payload":{"checklist":["egress","ventilation"]}}'
```

Copy `proofId` from the last response.

## 3) Verify the proof
```bash
# by proofId (fast with productId)
curl -s "http://localhost:3000/api/verify/<proofId>?productId=09412345678903_XYZ123"

# or by hash (if you only know the digest)
curl -s "http://localhost:3000/api/verify/_ignore?hash=0xYOUR_HASH"
```

Response looks like:
```json
{ "verified": true, "proofId": "...", "productDocId": "09412345678903_XYZ123", "proof": { "pass": true, "policyVersion": "v1", "hash": "0x..." } }
```

## 4) Inspect policy JSON (example)
The platform can serve a policy template; here’s an example for Healthy Homes:
- `HEALTHY_HOMES_POLICY.json` (included in this folder)
- Map your UI to display the checks and pass condition
