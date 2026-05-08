import { createThirdwebClient, getContract, Engine } from "thirdweb";
import { base } from "thirdweb/chains";
import { claimTo } from "thirdweb/extensions/erc1155";
import { NextRequest, NextResponse } from "next/server";

const CONTRACT_ADDRESS = "0xd559CcCEF096d5877ECA353aa2141F84E6487B5C"; // SHMIGGLE PASS

export async function POST(req: NextRequest) {
  const { address } = await req.json();

  if (!address) {
    return NextResponse.json({ error: "Missing address" }, { status: 400 });
  }

  try {
    const client = createThirdwebClient({
      secretKey: process.env.THIRDWEB_SECRET_KEY!,
    });

    const serverWallet = Engine.serverWallet({
      client,
      address: process.env.THIRDWEB_ENGINE_WALLET_ADDRESS!,
      vaultAccessToken: process.env.THIRDWEB_ENGINE_VAULT_TOKEN!,
    });

    const contract = getContract({
      client,
      address: CONTRACT_ADDRESS,
      chain: base,
    });

    const tx = claimTo({
      contract,
      to: address,
      tokenId: 1n,
      quantity: 1n,
    });

    const { transactionId } = await serverWallet.enqueueTransaction({ transaction: tx });

    const txHash = await Engine.waitForTransactionHash({ client, transactionId });

    return NextResponse.json({ success: true, txHash });
  } catch (e: any) {
    console.error("❌ Claim failed:", e);
    return NextResponse.json({ error: e.message || "Claim failed" }, { status: 500 });
  }
}