import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import * as admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: cert({
      projectId: getRequiredEnv("FIREBASE_PROJECT_ID"),
      clientEmail: getRequiredEnv("FIREBASE_CLIENT_EMAIL"),
      privateKey: getRequiredEnv("FIREBASE_PRIVATE_KEY").replace(/\\n/g, "\n"),
    }),
    projectId: getRequiredEnv("FIREBASE_PROJECT_ID"),
  });
}

// Firestore DB (Admin SDK)
export const db = admin.firestore();

// Re-export FieldValue & Timestamp for convenience
export const FieldValue = admin.firestore.FieldValue;
export const Timestamp = admin.firestore.Timestamp;
export { admin };

function getRequiredEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

// const app =
//   getApps()[0] ??
//   initializeApp({
//     credential: cert({
//       projectId: getRequiredEnv("FIREBASE_PROJECT_ID"),
//       clientEmail: getRequiredEnv("FIREBASE_CLIENT_EMAIL"),
//       privateKey: getRequiredEnv("FIREBASE_PRIVATE_KEY").replace(/\\n/g, "\n"),
//     }),
//     projectId: getRequiredEnv("FIREBASE_PROJECT_ID"),
//   });

// export const db = getFirestore(app);
