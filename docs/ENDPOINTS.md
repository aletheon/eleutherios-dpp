# Eleutherios API Endpoints (path-style)

All examples assume the app runs locally at **http://localhost:3000** and your
Firestore document id format is `products/{GTIN_SERIAL}` (e.g. `products/09412345678903_XYZ123`).

---

## Policy (read)
**GET** `/api/pp/{gtin}/{serial}/policy`

Example:
```bash
curl -s http://localhost:3000/api/pp/09412345678903/XYZ123/policy
```

---

## Forum (read + write)
**GET** `/api/forum/{gtin}/{serial}`  
**POST** `/api/forum/{gtin}/{serial}`  
Body:
```json
{ "message": "Kia ora — first post", "author": "demo-user" }
```

Examples:
```bash
# read
curl -s http://localhost:3000/api/forum/09412345678903/XYZ123

# write
curl -s -X POST http://localhost:3000/api/forum/09412345678903/XYZ123   -H "Content-Type: application/json"   -H "Authorization: Bearer dev-secret"   -d '{"message":"Kia ora — first post","author":"demo-user"}'
```

---

## Events (read + write)
**GET** `/api/events?gtin={gtin}&serial={serial}`  
**GET** `/api/events?productId={GTIN_SERIAL}` (alternative)  

**POST** `/api/events`  
Body (either include `productId` or use `?gtin&serial` query params):
```json
{
  "productId": "09412345678903_XYZ123",
  "event_type": "InspectionPassed",
  "payload": { "checklist": ["egress","ventilation"], "notes": "All good" }
}
```

Examples:
```bash
# write (productId in body)
curl -s -X POST http://localhost:3000/api/events   -H "Content-Type: application/json"   -H "Authorization: Bearer dev-secret"   -d '{"productId":"09412345678903_XYZ123","event_type":"InspectionPassed","payload":{"notes":"All good"}}'

# read (query params)
curl -s "http://localhost:3000/api/events?gtin=09412345678903&serial=XYZ123"
```

> Demo behavior: when `event_type === "InspectionPassed"`, the API also writes a proof
to `products/{GTIN_SERIAL}/proofs/{proofId}` and returns `proofId` in the response.

---

## Verify (read)
**GET** `/api/verify/{proofId}`  
Optional: `?productId={GTIN_SERIAL}` to search a single product first.

Examples:
```bash
# after posting an event that returned "proofId"
curl -s http://localhost:3000/api/verify/<proofId>

# faster lookup if you know the product doc id
curl -s "http://localhost:3000/api/verify/<proofId>?productId=09412345678903_XYZ123"
```

Response:
```json
{
  "verified": true,
  "proofId": "<proofId>",
  "productDocId": "09412345678903_XYZ123",
  "proof": { "pass": true, "policyVersion": "v1", "hash": "..." }
}
```

---

## Firestore shape (expected)

```
products/
  09412345678903_XYZ123
    events/
      <autoId> { event_type, payload, created_at, ... }
    forumPosts/
      <autoId> { message, author, created_at }
    proofs/
      <proofId> { pass, policyVersion, hash, event_ref, created_at }
    meta/
      policy { version, checks[] }         # optional helper doc
```

---

## Auth & local dev

- Writes to **/api/events** and **/api/forum** require `Authorization: Bearer dev-secret`  
  (configurable via `RESOLVER_DEV_SECRET` in `.env.local`).
- If using Firebase Emulator, set `FIRESTORE_EMULATOR_HOST=localhost:8080`.

```
RESOLVER_DEV_SECRET=dev-secret
FIRESTORE_EMULATOR_HOST=localhost:8080
```
