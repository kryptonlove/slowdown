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

    // Initialize Player on Backend
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