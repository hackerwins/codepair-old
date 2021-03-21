import React, { useEffect, useRef, ReactNode } from 'react';
import MaterialFade from '@material-ui/core/Fade';

interface FadeProps {
  timeout?: number;
  show: boolean;
  onFadeout: Function;
  children: ReactNode;
}

function Fade({ timeout, show, onFadeout, children }: FadeProps) {
  const timeoutId = useRef<number | null>(null);

  useEffect(() => {
    if (show) {
      timeoutId.current = window.setTimeout(() => {
        onFadeout();
        timeoutId.current = null;
      }, timeout);
    }

    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, [show]);

  return (
    <MaterialFade in={show}>
      <div>{show ? children : null}</div>
    </MaterialFade>
  );
}

Fade.defaultProps = {
  timeout: 1000,
};

export default Fade;
