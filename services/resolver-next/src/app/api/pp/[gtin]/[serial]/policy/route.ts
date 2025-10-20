// app/api/pp/[gtin]/[serial]/policy/route.ts
import { db } from "@/app/lib/firebaseAdmin";
// If you import the JSON fallback:
import healthyHomes from "@/app/lib/policies/HEALTHY_HOMES_POLICY.json";

export async function GET(
  _req: Request,
  ctx: { params: { gtin: string; serial: string } }
) {
  const productDocId = `${ctx.params.gtin}_${ctx.params.serial}`;
  const snap = await db
    .collection("products")
    .doc(productDocId)
    .collection("meta")
    .doc("policy")
    .get();

  const policy = snap.exists ? snap.data() : (healthyHomes as any);
  return new Response(JSON.stringify({ productDocId, policy }), {
    headers: { "content-type": "application/json" },
  });
}

export async function POST(
  req: Request,
  ctx: { params: { gtin: string; serial: string } }
) {
  // simple dev write guard
  const secret = process.env.RESOLVER_DEV_SECRET || "dev-secret";
  const auth = req.headers.get("authorization") || "";
  if (!auth.includes(secret)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }

  const productDocId = `${ctx.params.gtin}_${ctx.params.serial}`;
  const body = await req.json().catch(() => ({}));
  const policy = body?.policy || { ...healthyHomes, version: "v2" }; // default override for demo

  await db
    .collection("products")
    .doc(productDocId)
    .collection("meta")
    .doc("policy")
    .set(policy, { merge: true });

  return new Response(JSON.stringify({ ok: true, productDocId, policy }), {
    headers: { "content-type": "application/json" },
  });
}
