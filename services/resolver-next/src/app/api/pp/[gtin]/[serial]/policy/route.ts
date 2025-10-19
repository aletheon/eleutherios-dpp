import { NextResponse } from "next/server";
import { toProductDocId } from "@/app/lib/ids";
import { db } from "@/app/lib/firebaseAdmin";

export function GET(
  _req: Request,
  { params }: { params: { gtin: string; serial: string } }
) {
  const { gtin, serial } = params;

  return NextResponse.json({
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://schema.eleutherios.nz/pfsd/v1"
    ],
    "type": ["VerifiableCredential", "DigitalProductPolicy"],
    "issuer": "did:web:manufacturer.example",
    "issuanceDate": new Date().toISOString(),
    "credentialSubject": {
      "id": `urn:epc:id:sgtin:${gtin}.${serial}`,
      "pfsd": {
        "policy": {
          "version": "1.0.0",
          "ghg_target": { "unit": "kgCO2e", "lifecycle": "cradle-to-grave", "max": 16.0 },
          "repairability": { "score": 7, "spares_available_until": "2030-12-31" },
          "epr": { "scheme": "NZ-E-waste-Beta", "takeback": "$10 credit" },
          "disposal": ["repair", "reuse", "recycle"]
        },
        "forum_url": `/forum/pp/${gtin}/${serial}`,
        "service_actions": [
          { "name": "Book repair", "url": `/api/actions/repair?gtin=${gtin}&serial=${serial}` },
          { "name": "Request take-back", "url": `/api/actions/recycle?gtin=${gtin}&serial=${serial}` }
        ]
      }
    }
    // NOTE: add a real "proof" once you wire signing
  });
}
