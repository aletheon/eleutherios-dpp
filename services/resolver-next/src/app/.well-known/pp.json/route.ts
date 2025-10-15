import { NextResponse } from "next/server";

export function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const gtin = searchParams.get("gtin") || "09412345678903";
  const serial = searchParams.get("serial") || "XYZ123";
  const id = `urn:epc:id:sgtin:${gtin}.${serial}`;
  const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  return NextResponse.json({
    id,
    policy_url: `${base}/pp/${gtin}/${serial}/policy`,     // stub for now
    forum_url: `${base}/forum/pp/${gtin}/${serial}`,       // stub for now
    service_urls: {
      repair:  `${base}/api/actions/repair?gtin=${gtin}&serial=${serial}`,
      recycle: `${base}/api/actions/recycle?gtin=${gtin}&serial=${serial}`
    },
    events_feed: `${base}/api/events?gtin=${gtin}&serial=${serial}`,
    public_keyset: `${base}/.well-known/did.json`
  });
}
