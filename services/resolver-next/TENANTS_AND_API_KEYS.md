# Tenants & API Keys (future-ready)

## Collections
- `tenants/{tenantId}`: { name, plan, features, createdAt }
- `apiKeys/{keyId}`: { tenantId, hash, status, role, lastUsedAt }
- `products/{prodKey}`: { tenantId, privacy: "public" | "private" }

## Request flow (POST /api/events)
1. Read `Authorization: Bearer <keyId>`.
2. Load `apiKeys/<keyId>`; verify `status === "active"`.
3. Resolve `tenantId`; ensure `products/<prodKey>.tenantId === tenantId`.
4. Write event + audit.

## GET privacy
If `products/<prodKey>.privacy === "private"`, require a valid key for reads.

## Metering
Record `{tenantId, keyId, route, bytes}` for usage-based billing.
