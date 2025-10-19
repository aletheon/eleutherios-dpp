// scripts/seed-gp.ts
// Posts a few demo events to /api/events so /dashboard/gp shows data
// Usage:
//   BASE_URL=http://localhost:3001  npx tsx scripts/seed-gp.ts
// or (after adding an npm script) just: npm run seed:gp

type EventIn = {
  event_type: string;
  payload: Record<string, unknown>;
  proof_request?: { mode?: "none" | "signed" | "anchored"; requested_by?: string };
};

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

async function post(path: string, body: any) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`POST ${path} failed: ${res.status} ${txt}`);
  }
  return res.json();
}

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  // a couple of patients so the chart buckets have data
  const patients = ["PT-001", "PT-002", "PT-003"];

  const events: EventIn[] = [
    // Encounters
    { event_type: "EncounterFinalized", payload: { patient_ref: "PT-001", dx_codes: ["J06.9"], plan_summary: "fluids, rest" } },
    { event_type: "EncounterFinalized", payload: { patient_ref: "PT-002", dx_codes: ["L03.90"], plan_summary: "warm compress, review" } },
    // Follow-ups scheduled
    { event_type: "FollowUpScheduled", payload: { patient_ref: "PT-001", followup_date: addDays(3) } },
    { event_type: "FollowUpScheduled", payload: { patient_ref: "PT-002", followup_date: addDays(7) } },
    // One follow-up completed to compute TTFU
    { event_type: "FollowUpCompleted", payload: { patient_ref: "PT-001" } },
    // One prescription (to drive abx rate %) – marked with the word “antibiotic”
    { event_type: "PrescriptionIssued", payload: { patient_ref: "PT-002", drug_codes: ["ABX-TEST"], note: "antibiotic for cellulitis" } },
    // A few misc events
    { event_type: "AppointmentBooked", payload: { patient_ref: "PT-003", slot: addDays(1) + "T10:30:00Z", reason_code: "cough" } },
    { event_type: "TriageCompleted", payload: { patient_ref: "PT-003", acuity: "P3", red_flags: false } },
  ];

  console.log(`Seeding ${events.length} events → ${BASE_URL}/api/events ...`);
  for (const e of events) {
    const resp = await post("/api/events", {
      ...e,
      proof_request: { mode: "signed", requested_by: "seed-script" },
    });
    console.log("✓", resp.event?.event_type, resp.event?.payload?.patient_ref || "");
    await sleep(250);
  }

  console.log("\nDone. Open your dashboard:");
  console.log("→", `${BASE_URL}/dashboard/gp`);
}

function addDays(d: number) {
  const dt = new Date();
  dt.setUTCDate(dt.getUTCDate() + d);
  return dt.toISOString().slice(0, 10);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
