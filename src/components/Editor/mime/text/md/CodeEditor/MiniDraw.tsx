import React, { useRef } from 'react';
import { Tldraw, TldrawApp, useFileSystem } from '@tldraw/tldraw';
import { Button } from '@mui/material';
import './MiniDraw.scss';

export default function MiniDraw({
  theme,
  onSave,
  onClose,
  content,
  readOnly,
}: {
  theme: string;
  content: any;
  onSave?: (json: any) => void;
  onClose?: () => void;
  readOnly?: boolean;
}) {
  const tldrawRef = useRef<TldrawApp>();
  const fileSystemEvents = useFileSystem();

  return (
    <div
      className="mini-draw-root"
      data-readonly={readOnly}
      style={{
        width: '80%',
        height: '80%',
      }}
    >
      <div className="header-area">
        <div className="mini-draw-title">Mini Draw</div>
        <div className="mini-draw-tools">
          <Button
            variant="contained"
            onClick={() => {
              console.log(tldrawRef.current?.document);
              onSave?.(tldrawRef.current?.document);
            }}
          >
            Save
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              tldrawRef.current?.reset();

              onClose?.();
            }}
          >
            Close
          </Button>
        </div>
      </div>
      <div className="canvas-area">
        <Tldraw
          id="mini-draw-editor"
          autofocus
          disableAssets
          showPages={false}
          showMultiplayerMenu={false}
          showMenu={!readOnly}
          {...fileSystemEvents}
          onMount={(tldraw) => {
            tldrawRef.current = tldraw;

            if (tldrawRef.current) {
              tldrawRef.current.loadDocument(content);
            }
          }}
          readOnly={readOnly}
          darkMode={theme === 'dark'}
        />
      </div>
    </div>
  );
}
