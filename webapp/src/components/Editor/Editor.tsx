import React, { useEffect, useState, useRef, useCallback } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';

import CodeEditor from 'components/Editor/CodeEditor';
import DrawingBoard from 'components/Editor/DrawingBoard';
import Sidebar from 'components/Editor/Sidebar';
import { ToolType } from 'features/boardSlices';

// TODO(hackerwins): The height is 48 on the mobile AppBar.
export const NAVBAR_HEIGHT = 64;
const SIDEBAR_WIDTH = 46;

interface EditorProps {
  tool: ToolType;
}

const useStyles = makeStyles(() =>
  createStyles({
    editor: {
      position: 'relative',
      width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
      height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
      overflowY: 'auto',
      overflowX: 'hidden',
    },
    codeEditor: {
      position: 'absolute',
      width: '100%',
      height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
    },
    canvas: {
      position: 'absolute',
      height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
      width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
      /**
       * z-index
       * 1:  Show code mirror first
       * 10: Show canvas first
       */
      zIndex: (tool: ToolType) => (tool === ToolType.None ? 1 : 10),
    },
  }),
);

export default function Editor({ tool }: EditorProps) {
  const classes = useStyles(tool);

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const divRef = useRef<HTMLDivElement>(null);
  const codeEditorRef = useRef<CodeMirror.Editor>(null);

  const handleClickEditor = useCallback(() => {
    if (tool === ToolType.None) {
      codeEditorRef.current?.focus();
    }
  }, [tool]);

  useEffect(() => {
    const onResize = () => {
      if (!divRef.current) {
        return;
      }

      const rect = divRef.current?.getBoundingClientRect();
      setWidth(rect.width);
      setHeight(rect.height);
    };

    onResize();
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <>
      <div onClick={handleClickEditor} aria-hidden="true">
        <div className={classes.editor} ref={divRef}>
          <div className={classes.codeEditor}>
            <CodeEditor forwardedRef={codeEditorRef} />
          </div>
          <div className={classes.canvas}>
            <DrawingBoard width={width} height={height} />
          </div>
        </div>
      </div>
      <Sidebar />
    </>
  );
}
