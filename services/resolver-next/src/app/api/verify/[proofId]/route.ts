// app/api/verify/[proofId]/route.ts
export const runtime = "nodejs";

import { db, admin } from "@/app/lib/firebaseAdmin";

type Ctx =
  | { params: { proofId: string } }
  | { params: Promise<{ proofId: string }> };

export async function GET(req: Request, ctx: Ctx) {
  const url = new URL(req.url);
  const productId = url.searchParams.get("productId") || undefined;
  const hashQ = url.searchParams.get("hash") || undefined;

  // ✅ Next.js dynamic params can be async — always await
  const { proofId } = await (("then" in (ctx as any).params)
    ? (ctx as any).params
    : Promise.resolve((ctx as any).params));

  const ok = (doc: FirebaseFirestore.QueryDocumentSnapshot) => {
    const proof = doc.data();
    const verified = !!proof && proof.pass === true;
    const parent = doc.ref.parent.parent; // products/{GTIN_SERIAL}
    const productDocId = parent?.id;
    return new Response(
      JSON.stringify({ verified, proofId: doc.id, productDocId, proof }),
      { headers: { "content-type": "application/json" } }
    );
  };

  try {
    // ---------- HASH LOOKUP ----------
    // Accept either ?hash=... OR hash accidentally passed as the path segment.
    const hash = hashQ || (proofId?.startsWith("0x") ? proofId : undefined);

    if (hash) {
      // Fast path: constrain to one product if given
      if (productId) {
        const p = db.collection("products").doc(productId).collection("proofs");

        // Prefer `hash`, then fallback to `sha256` for older proofs
        let q = await p.where("hash", "==", hash).limit(1).get();
        if (!q.empty) return ok(q.docs[0]);

        q = await p.where("sha256", "==", hash).limit(1).get();
        if (!q.empty) return ok(q.docs[0]);
      }

      // Global fallback (may require collectionGroup support / index)
      try {
        let cg = await db.collectionGroup("proofs").where("hash", "==", hash).limit(1).get();
        if (!cg.empty) return ok(cg.docs[0]);

        cg = await db.collectionGroup("proofs").where("sha256", "==", hash).limit(1).get();
        if (!cg.empty) return ok(cg.docs[0]);
      } catch (e: any) {
        return new Response(
          JSON.stringify({
            verified: false,
            error: "Hash lookup needs productId or collectionGroup support.",
            details: e?.message || String(e),
          }),
          { status: 400, headers: { "content-type": "application/json" } }
        );
      }

      return new Response(JSON.stringify({ verified: false, error: "Not found" }), {
        status: 404, headers: { "content-type": "application/json" },
      });
    }

    // ---------- ID LOOKUP ----------
    // Only run this if we didn't detect a hash.
    if (productId) {
      const ref = db.collection("products").doc(productId).collection("proofs").doc(proofId);
      const snap = await ref.get();
      if (snap.exists) return ok(snap as any);
    }

    // CollectionGroup by documentId (valid only if `proofId` is a real doc id)
    const idField = admin.firestore.FieldPath.documentId();
    const cg = await db.collectionGroup("proofs").where(idField, "==", proofId).limit(1).get();
    if (!cg.empty) return ok(cg.docs[0]);

    return new Response(JSON.stringify({ verified: false, error: "Not found" }), {
      status: 404, headers: { "content-type": "application/json" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ verified: false, error: String(e?.message || e) }), {
      status: 500, headers: { "content-type": "application/json" },
    });
  }
}
