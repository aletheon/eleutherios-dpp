# Eleutherios — DPP + GP Service Prototype (Context Handoff v2)
_Last updated: 2025-10-17_

This file captures the complete working state of the Eleutherios Digital Product Passport (DPP) + GP Service prototype, including architecture, code modules, and business model context. It is a continuation of ELEUTHERIOS_CONTEXT_HANDOFF.md and serves as the definitive reference for handoff, resumption, or team onboarding.

---

## 🔧 Technical Snapshot

**Stack Overview:**
- **Frontend:** Next.js (App Router, TypeScript, TailwindCSS, Recharts)
- **Backend:** Firestore (Admin SDK) + optional Polygon anchoring
- **Auth:** ENV-based key signing (Ed25519)
- **APIs:** `/api/events`, `/api/forum`, `/api/policy`, `.well-known`
- **Dashboard:** `/dashboard/gp` — GP metrics + chart + proof viewer
- **Scripts:** `seed-gp.ts`, `anchor-hash.ts`
- **Docs:** `POLICY_GP_MINI.json`, `EVENTS_GP_CATALOG.md`

---

## 🩺 GP Use Case — MVP Summary

**Purpose:** Demonstrate verifiable, policy-governed GP workflow via event logging + signed proofs.

**Features:**
- Create and verify structured events (EncounterFinalized, FollowUpScheduled, PrescriptionIssued).
- Automatic KPI metrics (Follow-up %, Antibiotic rate, Avg TTFU days).
- JSON policy + markdown event catalog define the governance rules.
- Dashboard visualizes metrics and trends (Recharts).

**Next Steps:**
- Replace MemStore with Firestore persistence.
- Add multi-tenant API keys for secure private use.
- Deploy on Vercel for partner demos.

---

## 🧩 Reusable Templates (Future Pilots)

| Domain | Example Events | Policy Focus |
|--------|----------------|---------------|
| **Housing DPP** | InspectionCompleted, RepairOrdered | Proof-of-Inspection |
| **Repair DPP** | DeviceReceived, RepairDone | Proof-of-Repair NFT |
| **Food DPP** | HarvestLogged, ShipmentScanned | Proof-of-Origin |
| **Energy DPP** | MeterRead, CreditIssued | Proof-of-Supply |

---

## 🧭 Business & Funding Context

**Incorporation:** Eleutherios, Inc. (Delaware, USA) — enables US federal eligibility.

**Current Targets:**
- NSF Convergence Accelerator (AI + Governance)
- DOE AMMTO Circular Supply Chains
- Māori Health / GP pilot via MBIE Capability Fund
- Circular economy pilots (repair, housing, provenance)

**Business Models:**
- SaaS dashboard (subscription)
- Proof-as-a-Service (per-event)
- Data Trusts / Research Analytics
- White-label deployments under Iwi or council

---

## 🔐 Example .env.local Template

```
NEXT_PUBLIC_BASE_URL=http://localhost:3000
GP_SIGNING_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GP_SIGNING_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----\n"
GP_SIGNER_ID=eleutherios:gp-key-1
FIREBASE_PROJECT_ID=eleutherios-dpp
FIREBASE_CLIENT_EMAIL=service-account@eleutherios-dpp.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
EVENTS_WRITE_TOKEN=dev-secret
FORUM_WRITE_TOKEN=dev-secret
```

---

## 🚀 Immediate Tasks (Oct 2025)

1. Firestore event persistence (replace in-memory store).
2. Add API key auth middleware.
3. Deploy demo build to Vercel.
4. Write & export **One-Page Partner Brief (PDF)** for Māori GP / Iwi health providers.
5. Prepare DOE + NSF concept notes.

---

## 🧠 Handoff Prompt

> “We have a Next.js-based DPP engine with Policy/Forum/Events layers, a working GP dashboard (metrics + proofs), and reusable architecture for other DPP services. Next step: produce a 1-page partner brief for Māori Health / GP pilots to show value and invite collaboration.”

---

_End of context handoff (v2)_
