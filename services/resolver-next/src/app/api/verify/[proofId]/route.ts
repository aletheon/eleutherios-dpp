// app/api/verify/[proofId]/route.ts
import { db } from "@/app/lib/firebaseAdmin";
import * as admin from "firebase-admin";

/**
 * Verify a proof by ID.
 * Optional query param ?productId=GTIN_SERIAL will look up within a single product first (faster),
 * otherwise we fall back to a collectionGroup() scan for the doc ID.
 *
 * Responses:
 * 200 { verified: boolean, proofId, productDocId?, proof? }
 * 404 { verified: false, error: "Not found" }
 */
export async function GET(
  req: Request,
  ctx: { params: { proofId: string } }
) {
  const { proofId } = ctx.params;
  const url = new URL(req.url);
  const productId = url.searchParams.get("productId") || undefined;

  // 1) Fast path: check a specific product doc if provided
  if (productId) {
    const ref = db
      .collection("products")
      .doc(productId)
      .collection("proofs")
      .doc(proofId);

    const snap = await ref.get();
    if (snap.exists) {
      const proof = snap.data()!;
      const verified = !!proof && proof.pass === true;
      return new Response(
        JSON.stringify({ verified, proofId, productDocId: productId, proof }),
        { headers: { "content-type": "application/json" } }
      );
    }
  }

  // 2) Fallback: search across all products/*/proofs by document ID
  // (Works on Admin SDK with FieldPath.documentId() in a collectionGroup query)
  const idField = admin.firestore.FieldPath.documentId();
  const cg = await db
    .collectionGroup("proofs")
    .where(idField, "==", proofId)
    .get();

  if (cg.empty) {
    return new Response(JSON.stringify({ verified: false, error: "Not found" }), {
      status: 404,
      headers: { "content-type": "application/json" },
    });
  }

  const doc = cg.docs[0];
  const proof = doc.data();
  const verified = !!proof && proof.pass === true;

  // productDocId is the parent product document path segment before /proofs/{proofId}
  const productDocPath = doc.ref.parent.parent; // products/{GTIN_SERIAL}
  const productDocId = productDocPath ? productDocPath.id : undefined;

  return new Response(
    JSON.stringify({ verified, proofId, productDocId, proof }),
    { headers: { "content-type": "application/json" } }
  );
}
