# Eleutherios — Context Handoff (v3)
_Last updated: 2025-10-18_

## Summary
Eleutherios is a **Governance Infrastructure Platform**: Policy → Forum → Service → Data (PFSD) that produces **verifiable proofs** for any service (healthcare, social housing, repair, etc.). It overlays existing systems (APIs/middleware), signs events, computes KPIs, and enables **audit-grade, privacy‑preserving** verification.

## Recent Deliverables
- **Partner Brief (PDF)** — neutral MBIE-ready one-pager.  
- **Sector Map (PNG)** — 8 industries across PFSD.  
- **Investor Micro-Deck (PDF)** — cover, impact map, CTA (black→indigo).  
- **Integration Overview (PDF)** — middleware → Eleutherios layer → governance.  
- **Comparables Matrix (PDF)** — Salesforce / SAP / Palantir / Eleutherios (with logos).  
- **NSF SBIR Project Pitch (draft text)** — ready for the NSF portal.

## Business & Funding
- **Pre-seed target:** $250K SAFE. Use: product (40%), pilots (25%), sales (20%), ops (10%), mktg (5%).  
- **Option Pool:** 10% for early team (4y vest, 1y cliff). Equity & Culture policy drafted.  
- **Grant tracks:** NSF SBIR (queue pitch), USAID DIV (watch new APS), BARDA DRIVe EZ‑BAA (rolling), FDA BAA (FY25), MBIE Capability Fund (NZ).  
- **Capital stack strategy:** blend **grants + pilots + equity crowdfunding (Wefunder/Republic)**.

## Integration Positioning
> “Eleutherios doesn’t replace your systems — it **governs** them.”  
Adapters subscribe to existing APIs/queues; the Policy Engine validates events; the Proof layer signs/anchors (optional); dashboards/verifiers provide real-time compliance and audit samples without PHI exposure.

## AMS (Antimicrobial Stewardship) Note
Healthcare pilot includes AMS metrics: prescribing rate, guideline concordance, and time‑to‑follow‑up — delivered as **verifiable proofs**, not raw PHI.

## Funding Strategy Timeline (next 12 months)
**Q4 2025 (Oct–Dec)**  
- Launch **Wefunder/Republic** profile (use investor copy + micro‑deck).  
- Lock **two pilots**: Māori GP + Social Housing.  
- File **SAM.gov/UEI** + agency registrations; prep **USAID DIV** concept & **BARDA EZ‑BAA** quad chart.  
- Internal: create **10% option pool** in cap‑table tool (Pulley/Carta).

**Q1 2026 (Jan–Mar)**  
- Close **$150–250K pre‑seed** (angels + crowd).  
- Submit **BARDA EZ‑BAA** concept + **FDA BAA** whitepaper; monitor **NSF** reopening guidance and SBIR deadlines.  
- Publish **open‑core verifiers/schemas** (DPG‑friendly).

**Q2 2026 (Apr–Jun)**  
- Deliver **pilot outcomes** (health & housing): KPIs + signed proof samples (n≥30).  
- Apply **USAID DIV** (new APS window) with pilot evidence & cost‑effectiveness.  
- Start **white‑label discussions** with one ministry/NGO; line up a third pilot (repair/circular).

**Q3 2026 (Jul–Sep)**  
- Convert pilots to **paid subscriptions** or outcomes contracts.  
- Expand to **3–5 customers** or country partners; prepare **Phase II** / multi‑sector grant bids.  
- Optional: small seed extension for sales hires if traction ≥ 3 paying logos.

**Runway checkpoints**  
- Target ≥ 9–12 months cash after pre‑seed.  
- Sales goal: 3–5 pilots → 2 paid conversions → 1 enterprise/NGO white‑label by Q3 2026.

## Action Queue (Next)
1. Convert GP demo to **Firestore** (multi‑tenant).  
2. Add **API‑key middleware** + public **/verify** endpoint.  
3. Publish **concept notes (USAID/BARDA/FDA)** as a branded PDF pack.  
4. Launch **Wefunder profile** (include option‑pool & sales allocation).  
5. Schedule **partner intros** (UNDP/USAID accelerators, Māori providers, housing networks).

## Files (this session)
- Eleutherios_GP_Partner_Brief_Fixed.pdf  
- Eleutherios_DPP_Sector_Map.png  
- Eleutherios_MicroDeck_UNDP_USAID.pdf  
- Eleutherios_Integration_Overview.pdf  
- Eleutherios_Comparables_Matrix.pdf

## .env Template (reminder)
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

## Handoff Prompt
> “We position Eleutherios as the governance fabric overlaying existing systems. Immediate tasks: Firestore, API keys, /verify endpoint, pilots (health & housing), Wefunder profile, and USAID/BARDA/FDA concept PDFs. Funding strategy timelines for 12 months included above.”


# Funding Strategy Timeline (Q4 2025 → Q3 2026)

> Goal: Resource an MVP-to-pilot-to-revenue path in 12 months, blending pre-seed capital, paid pilots, and grants while building a verifiable proof layer (PFSD) and 2+ cross-sector reference wins.

---

## Summary at a glance

* **Capital plan:** Pre-seed **NZD $250k** SAFE + **NZD $150k** in pilot fees + **NZD $300–600k** in grants (multiple shots on goal).
* **Commercial targets:** 2 pilots launched (health + housing), **2–4 paid conversions**, ARPA-style milestones, <90‑day audit cycles turned to minutes via proofs.
* **Tech milestones:** Public **/verify** endpoint, adapter kit GA (FHIR/REST, CSV/S3, webhook), policy engine v1.2, proof ledger anchoring.
* **Compliance posture:** DPIA/PIA template, threat model, SOC‑2 lite checklist, data‑processor addendum.

---

## Timeline by quarter

### Q4 2025 (Oct–Dec)

**Theme:** Ship the *verifiable core* and line up first pilots and pre-seed.

* **Capital & runway**

  * Open **$250k SAFE** (uncapped discount or modest cap), 10% ESOP.
  * Prepare **Wefunder/AngelList** profile + teaser micro‑deck.
* **Grant & non‑dilutive**

  * Finalize a 3‑pack of concept notes (USAID DIV governance/health; BARDA DRIVe AMR/AMS verification; FDA BAA real‑world evidence provenance).
  * Maintain a rolling “grant briefs” folder with 2‑page exec sheets + budgets.
* **Pilots**

  * Lock **LOIs/MOUs** with 1× health (AMR/AMS) + 1× housing (Healthy Homes/tenancy).
  * Define **pilot success criteria** (verifiable KPIs + acceptance tests).
* **Product**

  * Launch **/verify** (public read-only proof check + docs; no PHI).
  * Release **Adapter Kit v0.9** (FHIR → events; CSV/S3 → events; webhook → events).
  * Policy Engine **v1.1** (rules + guards + proof emitters), basic console.
* **Trust & compliance**

  * Publish **security overview**, DPIA/PIA starter, incident runbook.
* **BD & comms**

  * Start a **monthly update** cadence (investors/partners/pilot leads).

**Exit criteria:** Pre-seed soft‑circled; two pilots scoped with signed LOIs; /verify live; adapter kit demoable.

---

### Q1 2026 (Jan–Mar)

**Theme:** Turn pilots on; prove the proof layer.

* **Pilots**

  * **Pilot #1 (health)** live: AMS/AMR event ingestion → policy checks → signed proofs; publish weekly proof counts and a blinded KPI snapshot.
  * **Pilot #2 (housing)** live: tenancy safety checks (e.g., egress/ventilation/size) → proofs + exception queue.
* **Grants**

  * Submit next‑window proposals (keep boilerplates hot: technical narrative, SoW, budget, milestones, ethics/HREC notes).
* **Product**

  * Policy Engine **v1.2** (combinators, attenuations, overrides with audit trail).
  * **Proof Anchoring v1:** hash‑chain + periodic public anchor; verifier library.
  * **Console v0.3:** policy graph, event explorer, proof browser.
* **Commercialization**

  * Convert one pilot to **paid** (fixed‑fee + success bonus), set 6‑month SOW.
* **Ops**

  * SOC‑2 lite controls mapped; logging/retention policy; DPA templates.

**Exit criteria:** Both pilots running; ≥1 paid; first non‑dilutive application(s) submitted; proofs independently verifiable end‑to‑end.

---

### Q2 2026 (Apr–Jun)

**Theme:** Scale integrations, publish outcomes, and close grants.

* **Pilots → References**

  * Publish **case studies** (privacy‑preserving; with partner approval) showing audit time reduction and KPI improvements.
  * Add **third integration** (e.g., municipal inspections or pharmacy services).
* **Revenue**

  * **2–4 paid conversions** (pilot → paid); expansion quotes in motion.
* **Grants & co‑funding**

  * Land at least **one award**; negotiate co‑funded extensions with pilot partners.
* **Product**

  * Adapter Kit **v1.0** (SDK + CLI; connectors: FHIR/HL7, REST, CSV/S3, Postgres, Kafka).
  * **Service Certification v0.1:** component vector scores + composite (for both services & users) with policy‑gated sharing.
* **Governance & assurance**

  * External **pen‑test** + remediation pass; privacy and safety statements published.

**Exit criteria:** 2+ paying deployments; at least one grant awarded/near‑award; adapter kit v1.0 shipping; third reference underway.

---

### Q3 2026 (Jul–Sep)

**Theme:** Package the platform and prepare for seed.

* **Commercial**

  * **Pricing & packaging** finalized (per‑event + per‑domain seats + verify API units).
  * **Partnerships:** identify 1–2 SI/ISV partners for implementation scale‑out.
* **Funding**

  * Prepare **Seed narrative** (category creation around “verifiable governance fabric”, traction, unit econ, TAM/SAM/SOM, wedge → expansion).
  * Target **$1.5–2.5m seed** (option: top‑up SAFE if demand).
* **Product**

  * Console **v1.0** (multi‑tenant, roles, policy composer, audit exports).
  * **Proofs v1.2:** cross‑domain queries; portable attestations between orgs.
* **Standards & ecosystem**

  * Draft an **open spec** for proofs (minimal, test vectors, verifier libs in two langs).

**Exit criteria:** Clean, repeatable sales motion; multi‑tenant console; proof spec draft; seed‑round materials ready.

---

## Capital stack & uses

* **Pre‑seed ($250k):** founder comp (modest), 1–2 senior contractors (policy engine + adapter kit), security/compliance setup, pilot delivery, legal.
* **Pilot fees (~$150k):** scoped delivery, success bonuses tied to KPI deltas, onsite workshops.
* **Grants ($300–600k):** research/verification, evaluation partners, external audits, dissemination.

**Use of funds buckets:** 40% product/engineering, 25% pilot delivery, 15% compliance & security, 10% BD/partnerships, 10% legal/ops.

---

## Pilot structure (template)

* **Scope:** 3–6 months, fixed fee + success bonus.
* **Inputs:** API access (read‑only), CSV/S3 drops, event mapping workshop.
* **Outputs:** Signed proofs + weekly KPI snapshots; blinded public dashboard via /verify.
* **Success criteria:** Specific KPI deltas (e.g., audit latency ↓, exception resolution ↑), zero PHI exfiltration, independent verification by partner.

---

## Metrics & reporting

* **Build:** time‑to‑integration (days), policy coverage (# checks), proof issuance rate/day.
* **Business:** pilots signed, pilots live, conversions, ACV, gross margin (infra cost/event), payback.
* **Trust:** incidents, pen‑test findings closed, DPIA status, verifier adoption.
* **Cadence:** monthly investor update; quarterly impact note (public).

---

## Risks & mitigations

* **Partner slippage:** maintain a pipeline 2× target; pre‑agree calendars and data access.
* **Scope creep:** milestone‑based SOWs; change‑order policy; freeze windows.
* **Data sensitivity:** proofs not payloads; DPIA; red‑team dry runs.
* **Funding gaps:** stagger tranches; bridge via top‑up SAFE or milestone‑based grant draws.

---

## Appendices

* **Grant boilerplates folder:** 2‑pager exec summary, SoW/milestones, budget, ethics notes, letters of support.
* **Data room checklist:** cap table, IP assignments, SOC‑2 lite controls, DPIA, security policies, pilot LOIs, product roadmap, case studies.
