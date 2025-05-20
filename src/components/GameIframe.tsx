'use client';

// import { useEffect, useState } from 'react';

/*
export default function GameIframe() {

  return (
    <div
      id="gameIframe" // нужно чтобы в GatedContent.tsx, внутри useEffect постмесадж смог найти айфрем и передать туда адрес игрока
      style={{
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      <iframe
        src="game/index.html"
        width="100%"
        height="100%"
        style={{ border: 'none', display: 'block' }}
        allowFullScreen
      />
    </div>
  );
}
*/

import { forwardRef } from 'react';

const GameIframe = forwardRef<HTMLIFrameElement, React.IframeHTMLAttributes<HTMLIFrameElement>>(
  (props, ref) => {
    return (
      <iframe
        {...props}
        ref={ref}
        src="game/index.html"
        width="100%"
        height="100%"
        style={{ border: 'none', display: 'block' }}
        allowFullScreen
      />
    );
  }
);

export default GameIframe;

