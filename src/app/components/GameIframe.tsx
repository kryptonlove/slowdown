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

GameIframe.displayName = 'GameIframe';

export default GameIframe;