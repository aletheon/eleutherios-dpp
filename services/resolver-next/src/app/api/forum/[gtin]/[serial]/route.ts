import { NextResponse } from "next/server";
import { db } from "@/app/lib/firebaseAdmin";

function key(gtin: string, serial: string) { return `${gtin}.${serial}`; }

export async function GET(req: Request) {
  const u = new URL(req.url);
  const gtin = u.searchParams.get("gtin") || "09412345678903";
  const serial = u.searchParams.get("serial") || "XYZ123";
  const k = key(gtin, serial);

  const snap = await db.collection("products").doc(k).collection("forumPosts")
    .orderBy("ts","desc").limit(100).get();
  const posts = snap.docs.map(d => ({ id: d.id, ...d.data() }));

  return NextResponse.json({ product: k, posts });
}

export async function POST(req: Request) {
  const u = new URL(req.url);
  const gtin = u.searchParams.get("gtin") || "09412345678903";
  const serial = u.searchParams.get("serial") || "XYZ123";
  const k = key(gtin, serial);

  const body = await req.json().catch(()=>({}));
  const text = (body.text ?? "").toString().slice(0, 5000);
  const actor = (body.actor ?? "user").toString().slice(0, 64);

  if (!text.trim()) {
    return NextResponse.json({ ok:false, error:"empty" }, { status: 400 });
  }

  const post = { text, actor, ts: new Date().toISOString() };
  const ref = await db.collection("products").doc(k).collection("forumPosts").add(post);

  return NextResponse.json({ ok:true, id: ref.id });
}
