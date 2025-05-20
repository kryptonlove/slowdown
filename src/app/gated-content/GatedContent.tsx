/*
'use client'

import { useEffect } from "react";
import GameIframe from "@/components/GameIframe";
import { useActiveAccount } from "thirdweb/react";

export default function GatedContent() {
  const account = useActiveAccount();

  useEffect(() => {
    if (!account?.address) return;

    console.log("GatedContent.tsx: Connected address:", account.address);

    // отправляем адрес в iframe
    const iframe = document.getElementById("gameIframe")?.querySelector("iframe"); // на стороне main.js надо будет указать этот айдишник "iframe"
    if (iframe?.contentWindow) {
      iframe.contentWindow.postMessage({ address: account.address }, "*");
      console.log("GatedContent.tsx: Sent address to iframe:", account.address);
    } else {
      console.warn("❌ iframe not ready");
    }

    // инициализируем игрока
    fetch('/api/player/init', {
      method: 'POST',
      credentials: "include",
    })
      .then(() => console.log("GatedContent.tsx: Player init request sent"))
      .catch((err) => console.error("GatedContent.tsx: Failed to init player:", err));
  }, [account?.address]);

  return <GameIframe />;
}
*/
'use client';

import { useRef } from "react";
import GameIframe from "@/components/GameIframe";
import { useActiveAccount } from "thirdweb/react";

export default function GatedContent() {
  const account = useActiveAccount();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleIframeLoad = () => {
    if (iframeRef.current && account?.address) {
      iframeRef.current.contentWindow?.postMessage(
        { address: account.address },
        "*"
      );
      console.log("✅ Sent address to iframe AFTER it loaded:", account.address);
    } else {
      console.warn("❌ iframeRef not ready or no address");
    }

    // инициализируем игрока
    fetch('/api/player/init', {
      method: 'POST',
      credentials: "include",
    })
      .then(() => console.log("🧠 Player init request sent"))
      .catch((err) => console.error("💥 Failed to init player:", err));
  };

  return (
    <div style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
      <GameIframe ref={iframeRef} onLoad={handleIframeLoad} />
    </div>
  );
}
