/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, ReactNode } from 'react';
import { Fade as MaterialFade } from '@mui/material';

interface FadeProps {
  timeout?: number;
  show: boolean;
  onFadeout: () => void;
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
