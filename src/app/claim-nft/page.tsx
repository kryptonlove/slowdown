'use client';

import { TransactionButton, useActiveAccount } from "thirdweb/react"
import { LoginButton } from "../components/LoginButton"
import { claimTo } from "thirdweb/extensions/erc1155"
import { defineChain, getContract } from "thirdweb"
import { base } from "thirdweb/chains";
import { client } from "../client"
import Link from "next/link"
import { useRouter } from "next/navigation"; // used to redirect after claim NFT


export default function NftClaim() {
    const account = useActiveAccount();
    const router = useRouter(); // used to redirect after claim NFT

    return (
     <div>
        <div className="p-4 pb-10 min-h-[100vh] flex flex-col items-center justify-center container max-w-screen-lg mx-auto">
            <p className="text-2xl">Claim Game Pass</p>
            <p className="mt-4 text-center">Claim SHMIGGLE PASS here to unlock the game. Calm Down, it takes around 20 seconds</p>
            <div className="my-6">
                <LoginButton />
            </div>
            <TransactionButton
            transaction={() => claimTo({
                contract: getContract({
                    client: client,
                    chain: defineChain(base),
                    address: "0xd559CcCEF096d5877ECA353aa2141F84E6487B5C" // Shmiggle Pass
                }),
                to: account?.address || "",
                quantity: 1n,
                tokenId: 1n, // Slow Down Token
            })}
            onTransactionConfirmed={async () => {
                await new Promise((r) => setTimeout(r, 3000)); // wait... 
                alert("NFT claimed");
                router.push("/gated-content"); // redirect to the game after claim
            }}
            >Claim NFT</TransactionButton>
            <Link href={"/gated-content"}>
            <button className="mt-4 bg-zinc-100 text-black px-4 py-2 rounded-md">
                Play
            </button>
            </Link>
        </div>
     </div>   
    )
}