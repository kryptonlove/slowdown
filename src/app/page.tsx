'use client';

import Image from "next/image";
import { useActiveAccount } from "thirdweb/react";
import diggleIcon from "@public/diggle-play.svg";
import { LoginButton } from "./components/LoginButton";
import Link from "next/link";

export default function Home() {
  const account = useActiveAccount();

  return (
    <main className="p-4 pb-10 min-h-[100vh] flex items-center justify-center container max-w-screen-lg mx-auto">
        
        <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 z-0">
          <div className="flex flex-col h-[84px] w-full">
            <div className="h-[12px] bg-rainbow-red" />
            <div className="h-[12px] bg-rainbow-orange" />
            <div className="h-[12px] bg-rainbow-yellow" />
            <div className="h-[12px] bg-rainbow-green" />
            <div className="h-[12px] bg-rainbow-cyan" />
            <div className="h-[12px] bg-rainbow-blue" />
            <div className="h-[12px] bg-rainbow-purple" />
          </div>
      </div>

      <div className="w-full max-w-[400px] mx-auto border-4 border-rainbow-yellow rounded-3xl px-6 py-10 bg-black text-white text-center space-y-6 z-10">
        <Header />
        <div className="flex justify-center mb-20">
          <LoginButton />
        </div>
        
        {account && (
          <div className="text-center">
            <Link href="/gated-content">
            <button className="mt-4 bg-zinc-100 text-black px-4 py-2 rounded-md uppercase">
              Play
            </button>
            </Link>
            <p className="text-xs py-2 uppercase">You are logged in</p>
          </div> 
        )}
      </div>
    </main>
  );
}

function Header() {
  return (
      <header className="flex flex-col items-center mb-20 md:mb-20 max-w-[400px]">
        <Image
          src={diggleIcon}
          alt=""
          className="size-[150px] md:size-[150px]"
          style={{
            filter: "drop-shadow(0px 0px 24px #a726a9a8)",
          }}
        />
        <h1 className="text-2xl md:text-6m font-semibold md:font-bold tracking-tighter mb-6 text-zinc-100">Slow Down Game</h1>
        <p className="text-center">
          Connect your wallet to claim <span className="text-rainbow-cyan">Shmiggle Pass on Base</span> and unlock <span className="text-rainbow-yellow">Slow Down</span> by Mr. Diggle and his frens.
        </p>
        <p className="text-xs py-8">
          Some on-chain actions may apply
        </p>
      </header>
  );
}