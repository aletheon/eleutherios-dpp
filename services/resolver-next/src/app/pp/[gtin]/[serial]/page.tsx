import Link from "next/link";

export default function ProductPage({ params }: { params: { gtin: string; serial: string }}) {
  const { gtin, serial } = params;
  const id = `urn:epc:id:sgtin:${gtin}.${serial}`;
  return (
    <main style={{padding:"2rem", color:"#eaf1f4", background:"#0d2731", minHeight:"100vh", fontFamily:"system-ui"}}>
      <h1 style={{fontSize:28, marginBottom:8}}>Eleutherios — Digital Product Policy</h1>
      <p style={{opacity:.8, marginBottom:24}}>Governance through Prior Unity</p>

      <section style={{background:"#123746", padding:"1rem", borderRadius:12}}>
        <p><b>Product ID:</b> {id}</p>
        <p><b>GTIN:</b> {gtin} &nbsp; <b>Serial:</b> {serial}</p>
        <ul style={{marginTop:16}}>
          <li><Link href={`/.well-known/pp.json?gtin=${gtin}&serial=${serial}`}>Machine endpoint (.well-known)</Link></li>
          <li><Link href={`/api/events?gtin=${gtin}&serial=${serial}`}>Events (GET)</Link></li>
        </ul>
      </section>

      <section style={{marginTop:24}}>
        <h3>Service actions</h3>
        <div style={{display:"flex", gap:12, flexWrap:"wrap", marginTop:8}}>
          <a href={`/api/actions/repair?gtin=${gtin}&serial=${serial}`} style={{padding:"8px 12px", background:"#0fa9bd", borderRadius:8}}>Book repair</a>
          <a href={`/api/actions/recycle?gtin=${gtin}&serial=${serial}`} style={{padding:"8px 12px", background:"#0fa9bd", borderRadius:8}}>Request take-back</a>
        </div>
      </section>
    </main>
  );
}
