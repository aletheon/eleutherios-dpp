// services/resolver-next/app/api/events/route.ts
import { NextRequest } from "next/server";
import crypto from "crypto";

/** ---------- Types ---------- **/
export type GpEvent = {
  event_type: string;
  payload: Record<string, unknown>;
  created_at: string;
  proof: {
    mode: "none" | "signed" | "anchored";
    sha256: `0x${string}`;
    sig?: `0x${string}`;
    signer?: string;
    tx_hash?: `0x${string}` | null;
    anchor_chain?: string | null;
    requested_by?: string;
    requested_at?: string;
  };
};

export type PostBody = {
  event_type: string;
  payload: Record<string, unknown>;
  proof_request?: {
    mode?: "none" | "signed" | "anchored";
    anchor_now?: boolean;
    requested_by?: string;
  };
};

/** ---------- In-memory store (swap for Firestore later) ---------- **/
const _mem: GpEvent[] = [];

const MemStore = {
  async list(limit = 100) {
    return _mem.slice(-limit).reverse();
  },
  async create(e: GpEvent) {
    _mem.push(e);
    return e;
  },
};

/** ---------- Helpers ---------- **/
const PUB_KEY_PEM = process.env.GP_SIGNING_PUBLIC_KEY || "";
const PRIV_KEY_PEM = process.env.GP_SIGNING_PRIVATE_KEY || "";
const SIGNER_ID = process.env.GP_SIGNER_ID || "eleutherios:gp-key-1";

function canonicalStringify(obj: unknown): string {
  const seen = new WeakSet();
  const sort = (x: any): any => {
    if (x && typeof x === "object") {
      if (seen.has(x)) return null;
      seen.add(x);
      if (Array.isArray(x)) return x.map(sort);
      return Object.keys(x)
        .sort()
        .reduce((acc: any, k) => {
          acc[k] = sort(x[k]);
          return acc;
        }, {});
    }
    return x;
  };
  return JSON.stringify(sort(obj));
}

function sha256Hex(input: string): `0x${string}` {
  return ("0x" + crypto.createHash("sha256").update(input).digest("hex")) as `0x${string}`;
}

function signHashEd25519(hashHex: `0x${string}`): `0x${string}` | undefined {
  if (!PRIV_KEY_PEM) return undefined;
  const bytes = Buffer.from(hashHex.slice(2), "hex");
  const sig = crypto.sign(null, bytes, PRIV_KEY_PEM);
  return ("0x" + sig.toString("hex")) as `0x${string}`;
}

function computeMetrics(events: GpEvent[]) {
  const encounters = events.filter((e) => e.event_type === "EncounterFinalized");
  const abx = events.filter(
    (e) => e.event_type === "PrescriptionIssued" && JSON.stringify(e.payload).toLowerCase().includes("antibiotic")
  );
  const followUps = events.filter((e) => e.event_type === "FollowUpScheduled");
  const followUpsKept = events.filter((e) => e.event_type === "FollowUpCompleted");

  // crude TTFU per patient_ref
  const byPatient = new Map<string, GpEvent[]>();
  for (const e of events) {
    const pr = (e.payload?.patient_ref as string) || "";
    if (!pr) continue;
    const arr = byPatient.get(pr) || [];
    arr.push(e);
    byPatient.set(pr, arr);
  }
  const ttfuSamples: number[] = [];
  for (const [, arr] of byPatient) {
    const enc = arr
      .filter((e) => e.event_type === "EncounterFinalized")
      .sort((a, b) => a.created_at.localeCompare(b.created_at));
    const kept = arr
      .filter((e) => e.event_type === "FollowUpCompleted")
      .sort((a, b) => a.created_at.localeCompare(b.created_at));
    if (enc.length && kept.length) {
      const t0 = new Date(enc[0].created_at).getTime();
      const t1 = new Date(kept[0].created_at).getTime();
      ttfuSamples.push((t1 - t0) / (1000 * 60 * 60 * 24));
    }
  }

  const pct = (n: number, d: number) => (d ? Math.round((n / d) * 1000) / 10 : 0);
  const avg = (xs: number[]) => (xs.length ? Math.round((xs.reduce((a, b) => a + b, 0) / xs.length) * 10) / 10 : 0);

  return {
    encounters: encounters.length,
    antibiotic_rate_pct: pct(abx.length, encounters.length),
    follow_up_scheduled: followUps.length,
    follow_up_kept: followUpsKept.length,
    follow_up_kept_pct: pct(followUpsKept.length, followUps.length),
    ttfu_days_avg: avg(ttfuSamples),
  };
}

/** ---------- Route handlers (exactly one GET + one POST) ---------- **/
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const metricsWanted = url.searchParams.has("metrics");
  const data = await MemStore.list(500);
  if (metricsWanted) {
    return Response.json({ ok: true, metrics: computeMetrics(data) });
  }
  return Response.json({ ok: true, events: data });
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as PostBody;
  if (!body?.event_type || typeof body.event_type !== "string") {
    return new Response(JSON.stringify({ ok: false, error: "event_type required" }), { status: 400 });
  }

  const created_at = new Date().toISOString();
  const proofMode = body.proof_request?.mode || (PRIV_KEY_PEM ? "signed" : "none");

  const canonical = canonicalStringify({
    event_type: body.event_type,
    payload: body.payload || {},
    created_at,
  });
  const sha = sha256Hex(canonical);

  const ev: GpEvent = {
    event_type: body.event_type,
    payload: body.payload || {},
    created_at,
    proof: {
      mode: proofMode,
      sha256: sha,
      sig: proofMode !== "none" ? signHashEd25519(sha) : undefined,
      signer: proofMode !== "none" ? (process.env.GP_SIGNER_ID || "eleutherios:gp-key-1") : undefined,
      tx_hash: null,
      anchor_chain: null,
      requested_by: body.proof_request?.requested_by || "user",
      requested_at: created_at,
    },
  };

  // TODO: if (body.proof_request?.anchor_now) -> queue an anchor job here.
  const saved = await MemStore.create(ev);
  return Response.json({ ok: true, event: saved });
}
