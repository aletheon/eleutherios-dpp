import ForumClient from "@/components/ForumClient";

export default function ForumPage({
  params,
}: { params: { gtin: string; serial: string }}) {
  const { gtin, serial } = params; // <-- correct destructuring
  return (
    <main style={{padding:"2rem", color:"#eaf1f4", background:"#0d2731", minHeight:"100vh", fontFamily:"system-ui"}}>
      <h1 style={{fontSize:28, marginBottom:8}}>Forum — {gtin}.{serial}</h1>
      <p style={{opacity:.8, marginBottom:24}}>Discuss repairs, recalls, take-back and lifecycle actions for this item.</p>
      <section style={{background:"#0f2a35", padding:"1rem", borderRadius:12}}>
        <ForumClient gtin={gtin} serial={serial} />
      </section>
    </main>
  );
}
