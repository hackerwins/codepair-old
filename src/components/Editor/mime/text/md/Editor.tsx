import React, { useEffect, useState, useRef, useCallback } from 'react';

import { useSelector } from 'react-redux';
import { AppState } from 'app/rootReducer';
import CodeEditor from './CodeEditor';
import DrawingBoard from './DrawingBoard';
import Sidebar from '../../../Sidebar';

import { ToolType } from 'features/boardSlices';
import { makeStyles } from 'styles/common';

export const NAVBAR_HEIGHT = 90;
const SIDEBAR_WIDTH = 46;

const useStyles = makeStyles<{ tool: ToolType }>()((theme, props) => ({
  root: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  editor: {
    width: '100%',
    flex: '1 1 auto',
    position: 'relative',
  },
  codeEditor: {
    width: '100%',
    height: `calc(100vh - ${120}px)`,
  },
  canvas: {
    top: 0,
    height: '100%',
    width: '100%',
    position: 'absolute',
    /**
     * pointer-events
     *   - 'auto': Show code mirror first
     *   - 'none': Show canvas first
     */
    pointerEvents: props.tool === ToolType.None ? 'none' : 'auto',
  },
}));

export default function Editor() {
  const tool = useSelector((state: AppState) => state.boardState.toolType);
  const { classes } = useStyles({ tool });

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
      setHeight(rect.height - NAVBAR_HEIGHT);
    };

    onResize();
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div className={classes.root} onClick={handleClickEditor} aria-hidden="true">
      <Sidebar />
      <div className={classes.editor} ref={divRef}>
        <div className={classes.codeEditor}>
          <CodeEditor forwardedRef={codeEditorRef} />
        </div>
        <div className={classes.canvas}>
          <DrawingBoard width={width} height={height} />
        </div>
      </div>
    </div>
  );
}
