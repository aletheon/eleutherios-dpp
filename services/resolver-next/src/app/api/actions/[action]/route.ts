import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { action: string }}) {
  const u = new URL(req.url);
  const gtin = u.searchParams.get("gtin");
  const serial = u.searchParams.get("serial");
  return NextResponse.json({
    ok: true,
    action: params.action,
    next: "Form or workflow would start here.",
    product: { gtin, serial }
  });
}
