export async function GET() {
return Response.json({
alg: "Ed25519",
key_pem: process.env.GP_SIGNING_PUBLIC_KEY || "",
kid: process.env.GP_SIGNER_ID || "eleutherios:gp-key-1",
});
}