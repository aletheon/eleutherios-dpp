# Resolver Endpoints

## Human pages
- **Product hub**: `/pp/[gtin]/[serial]`
- **Forum UI**: `/forum/pp/[gtin]/[serial]`

## Machine endpoints
- **Well-known**: `/.well-known/pp.json?gtin=&serial=`
- **Policy JSON**: `/pp/[gtin]/[serial]/policy`
- **Events**
  - GET `/api/events?gtin=&serial=`
  - POST `/api/events?gtin=&serial=` (Bearer token required if enabled)
- **Forum**
  - GET `/api/forum?gtin=&serial=`
  - POST `/api/forum?gtin=&serial=` (Bearer token required if enabled)
- **Health**: `/api/health`

### Event shape
```json
{
  "event_id": "uuid",
  "product_id": "urn:epc:id:sgtin:<gtin>.<serial>",
  "event_type": "RepairPerformed",
  "payload": { "parts": ["gasket-A2"], "co2_avoided": 0.8 },
  "timestamp": "ISO-8601"
}
```
