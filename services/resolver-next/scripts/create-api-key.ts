/**
 * Usage: FIREBASE_PROJECT_ID=... FIREBASE_CLIENT_EMAIL=... FIREBASE_PRIVATE_KEY="...\\n..." npx ts-node scripts/create-api-key.ts <tenantId> <keyId>
 */
import { cert, initializeApp, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function env(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

const app =
  getApps()[0] ??
  initializeApp({
    credential: cert({
      projectId: env("FIREBASE_PROJECT_ID"),
      clientEmail: env("FIREBASE_CLIENT_EMAIL"),
      privateKey: env("FIREBASE_PRIVATE_KEY").replace(/\\n/g, "\n"),
    }),
    projectId: env("FIREBASE_PROJECT_ID"),
  });

const db = getFirestore(app);

async function main() {
  const [tenantId, keyId] = process.argv.slice(2);
  if (!tenantId || !keyId) {
    console.error("Usage: ... create-api-key.ts <tenantId> <keyId>");
    process.exit(1);
  }
  await db.collection("tenants").doc(tenantId).set(
    { name: tenantId, plan: "pro", createdAt: new Date().toISOString() },
    { merge: true }
  );
  await db.collection("apiKeys").doc(keyId).set({
    tenantId,
    status: "active",
    role: "writer",
    createdAt: new Date().toISOString(),
  });
  console.log(`Created apiKey ${keyId} for tenant ${tenantId}`);
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
