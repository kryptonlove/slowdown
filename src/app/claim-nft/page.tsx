'use client';

import { useActiveAccount } from "thirdweb/react";
import { LoginButton } from "../components/LoginButton";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NftClaim() {
  const account = useActiveAccount();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClaim = async () => {
    if (!account?.address) return alert("Please connect your wallet");
    setLoading(true);

    try {
      const res = await fetch("/api/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: account.address }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      alert("✅ NFT Claimed! Tx Hash: " + data.txHash);
      router.push("/gated-content");
    } catch (err: any) {
      alert("❌ Claim failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 pb-10 min-h-[100vh] flex flex-col items-center justify-center container max-w-screen-lg mx-auto">
      <p className="text-2xl">Claim Game Pass</p>
      <p className="mt-4 text-center">
        Claim SHMIGGLE PASS here to unlock the game. Calm Down, it takes around 20 seconds
      </p>
      <div className="my-6">
        <LoginButton />
      </div>

      <button
        onClick={handleClaim}
        disabled={loading}
        className="bg-white text-black px-4 py-2 rounded-md disabled:opacity-50"
      >
        {loading ? "Claiming..." : "Claim Pass"}
      </button>

      <Link href={"/gated-content"}>
        <button className="mt-4 bg-zinc-100 text-black px-4 py-2 rounded-md">Play</button>
      </Link>
    </div>
  );
}
