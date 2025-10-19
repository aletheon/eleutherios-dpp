// scripts/anchor-hash.ts
import { readFileSync } from "fs";
import crypto from "crypto";
import { JsonRpcProvider, Wallet, TransactionRequest } from "ethers";

type AnchorResult = {
  file: string;
  hash: string;
  tx_hash?: string;
  chain: string;
  timestamp: string;
  rpc_url?: string;
  to?: string;
};

function usageAndExit(): never {
  console.error("Usage: RPC_URL=... PRIVATE_KEY=0x... npx ts-node scripts/anchor-hash.ts <path-to-file>");
  process.exit(1);
}

async function main() {
  const filePath = process.argv[2];
  if (!filePath) usageAndExit();

  const RPC_URL = process.env.RPC_URL || "";
  const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
  const CHAIN = process.env.CHAIN || "polygon";
  const DRY_RUN = process.env.DRY_RUN === "1";

  if (!DRY_RUN && (!RPC_URL || !PRIVATE_KEY)) {
    console.error("Missing RPC_URL or PRIVATE_KEY. Set DRY_RUN=1 to compute hash without broadcasting.");
    usageAndExit();
  }

  const buf = readFileSync(filePath);
  const sha256 = crypto.createHash("sha256").update(buf).digest("hex");
  const data = "0x" + sha256;

  const now = new Date().toISOString();
  const base: AnchorResult = {
    file: filePath,
    hash: "0x" + sha256,
    chain: CHAIN,
    timestamp: now,
    rpc_url: RPC_URL || undefined
  };

  if (DRY_RUN) {
    console.log(JSON.stringify(base, null, 2));
    return;
  }

  const provider = new JsonRpcProvider(RPC_URL);
  const wallet = new Wallet(PRIVATE_KEY, provider);

  const tx: TransactionRequest = {
    to: wallet.address,
    value: 0n,
    data
  };

  const sent = await wallet.sendTransaction(tx);
  await sent.wait();

  const out: AnchorResult = {
    ...base,
    tx_hash: sent.hash,
    to: wallet.address
  };
  console.log(JSON.stringify(out, null, 2));
}

main().catch((err) => {
  console.error("Anchor failed:", err);
  process.exit(1);
});
