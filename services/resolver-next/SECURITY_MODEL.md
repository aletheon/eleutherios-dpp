# Security Model (v0)

**Reads (GET)**: public by default (policy transparency).  
**Writes (POST)**: protected by a simple Bearer token in dev, migrates to per-tenant API keys.

## Current (v0)
- `POST /api/events` and `POST /api/forum`:
  - Require `Authorization: Bearer <token>` when `EVENTS_WRITE_TOKEN` / `FORUM_WRITE_TOKEN` is set.
- Rate limits: optional naive in-memory rate limit snippet in the handlers.

## Next (multi-tenant)
- Collections: `tenants/{id}`, `apiKeys/{keyId}`, `products/{prodKey}` with `{tenantId, privacy}`.
- Private products enforce auth for **GET** *and* **POST**.
- See `/docs/TENANTS_AND_API_KEYS.md`.

## Privacy options
- `public` (default): GET open, POST requires token.
- `private`: GET/POST require API key or session.
