// app/api/events/route.ts
// Next.js App Router (Node runtime) — Events endpoint
// - GET: list events for a product (by ?productId=GTIN_SERIAL or ?gtin&serial)
// - POST: append an event; when event_type === "InspectionPassed", also mint a proof
//
// Writes require: Authorization: Bearer <RESOLVER_DEV_SECRET>
// Firestore shape: products/{GTIN_SERIAL}/events/*, proofs/*

export const runtime = "nodejs";
import { db, FieldValue } from "@/app/lib/firebaseAdmin";
import { fromProductId, toProductDocId } from "@/app/lib/ids";
import crypto from "crypto";

type EventBody = {
  productId?: string;
  event_type?: string;
  payload?: any;
  proof?: { sha256?: string; [k: string]: any };
};

function ensureAuth(req: Request) {
  const secret = process.env.RESOLVER_DEV_SECRET || "dev-secret";
  const auth = req.headers.get("authorization") || "";
  if (!auth.includes(secret)) {
    throw new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }
}

function resolveProductDocId(url: URL, body: EventBody | null): string {
  const pid = body?.productId || url.searchParams.get("productId");
  if (pid) return fromProductId(pid).productDocId;
  const gtin = url.searchParams.get("gtin");
  const serial = url.searchParams.get("serial");
  if (gtin && serial) return toProductDocId(gtin, serial);
  throw new Response(JSON.stringify({ error: "Supply productId=GTIN_SERIAL or gtin & serial" }), {
    status: 400,
    headers: { "content-type": "application/json" },
  });
}

function sha256Hex(input: string): string {
  return "0x" + crypto.createHash("sha256").update(input).digest("hex");
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const productDocId = resolveProductDocId(url, null);

    const ref = db
      .collection("products")
      .doc(productDocId)
      .collection("events")
      .orderBy("created_at", "desc")
      .limit(100);

    const snap = await ref.get();
    const events = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    return new Response(JSON.stringify({ productDocId, events }), {
      headers: { "content-type": "application/json" },
    });
  } catch (err: any) {
    if (err instanceof Response) return err;
    return new Response(JSON.stringify({ error: String(err?.message || err) }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}

export async function POST(req: Request) {
  try {
    ensureAuth(req);

    const url = new URL(req.url);
    const body = (await req.json()) as EventBody;
    const productDocId = resolveProductDocId(url, body);

    const event_type = body?.event_type;
    const payload = body?.payload ?? {};
    if (!event_type) {
      return new Response(JSON.stringify({ error: "event_type required" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }

    // Derive or reuse a payload hash
    const payloadHash =
      body?.proof?.sha256 ||
      sha256Hex(JSON.stringify({ event_type, payload }));

    // Write event
    const eventRef = db
      .collection("products")
      .doc(productDocId)
      .collection("events")
      .doc();

    const eventDoc = {
      event_type,
      payload,
      created_at: FieldValue.serverTimestamp(),
      proof: {
        mode: "local", // or "none" if you prefer to not imply anchoring
        sha256: payloadHash,
        tx_hash: null,
        anchor_chain: null,
        requested_by: "user",
        requested_at: FieldValue.serverTimestamp(),
      },
    };

    await eventRef.set(eventDoc);

    // Optionally mint proof (demo rule: InspectionPassed -> pass)
    let proofId: string | null = null;
    if (event_type === "InspectionPassed") {
      const proof = {
        // pass: true,
        // policyVersion: "v1",
        // hash: payloadHash,
        // mode: "local", // change to "anchored" once you add a chain anchor
        // tx_hash: null,
        // anchor_chain: null,
        // created_at: FieldValue.serverTimestamp(),
        // event_ref: eventRef.id,

        pass: true,
        policyVersion: "v1",
        hash: payloadHash,       // <— for /verify?hash=
        sha256: payloadHash,     // <— keeps naming consistent with event metadata
        mode: "local",
        tx_hash: null,
        anchor_chain: null,
        created_at: FieldValue.serverTimestamp(),
        event_ref: eventRef.id,
      };

      const proofRef = db
        .collection("products")
        .doc(productDocId)
        .collection("proofs")
        .doc();

      await proofRef.set(proof);
      proofId = proofRef.id;
    }

    return new Response(
      JSON.stringify({
        ok: true,
        productDocId,
        eventId: eventRef.id,
        proofId,
      }),
      { headers: { "content-type": "application/json" } }
    );
  } catch (err: any) {
    if (err instanceof Response) return err;
    return new Response(JSON.stringify({ error: String(err?.message || err) }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
