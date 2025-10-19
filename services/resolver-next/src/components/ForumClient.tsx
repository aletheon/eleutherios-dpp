"use client";
import { useEffect, useState } from "react";

type Post = { id?: string; author: string; message: string; timestamp: string; kind?: string };

export default function ForumClient({ gtin, serial }: { gtin: string; serial: string }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [message, setMessage] = useState("");

  async function load() {
    const r = await fetch(`/api/forum?gtin=${gtin}&serial=${serial}`, { cache: "no-store" });
    const j = await r.json();
    setPosts(j.posts || []);
  }
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    await fetch(`/api/forum?gtin=${gtin}&serial=${serial}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ author: "owner", message, kind: "note" }),
    });
    setMessage(""); load();
  }
  useEffect(() => { load(); }, []);

  return (
    <div style={{marginTop: 16}}>
      <form onSubmit={submit} style={{display:"flex", gap:8}}>
        <input
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Post a note to this product’s forum…"
          style={{flex:1, padding:8, borderRadius:8, border:"1px solid #2a4c57", background:"#0f2a35", color:"#eaf1f4"}}
        />
        <button type="submit" style={{padding:"8px 12px", borderRadius:8, background:"#0fa9bd", border:"none", color:"#0b242d"}}>
          Post
        </button>
      </form>

      <ul style={{listStyle:"none", padding:0, marginTop:16, display:"grid", gap:8}}>
        {posts.map(p => (
          <li key={p.id} style={{background:"#123746", padding:12, borderRadius:8}}>
            <div style={{opacity:.8, fontSize:12}}>
              <b>{p.author}</b> • {new Date(p.timestamp).toLocaleString()} {p.kind === "event" ? "• event" : ""}
            </div>
            <div style={{marginTop:6}}>{p.message}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
