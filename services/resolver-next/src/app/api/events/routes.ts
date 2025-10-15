import { NextResponse } from "next/server";

const mem: Record<string, any[]> = {};

export async function GET(req: Request) {
  const url = new URL(req.url);
  const gtin = url.searchParams.get("gtin") || "09412345678903";
  const serial = url.searchParams.get("serial") || "XYZ123";
  const key = `${gtin}.${serial}`;
  return NextResponse.json({ product: key, events: mem[key] || [] });
}

export async function POST(req: Request) {
  const url = new URL(req.url);
  const gtin = url.searchParams.get("gtin") || "09412345678903";
  const serial = url.searchParams.get("serial") || "XYZ123";
  const key = `${gtin}.${serial}`;

  const body = await req.json().catch(() => ({}));
  const evt = {
    event_id: crypto.randomUUID(),
    product_id: `urn:epc:id:sgtin:${gtin}.${serial}`,
    event_type: body.event_type || "Unknown",
    payload: body.payload || {},
    timestamp: new Date().toISOString()
    // TODO: verify signature once Firestore/DIDs are wired
  };
  mem[key] = mem[key] || [];
  mem[key].push(evt);
  return NextResponse.json({ ok: true, event: evt }, { status: 201 });
}
