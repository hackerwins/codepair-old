import React from 'react';

import { useSelector } from 'react-redux';
import { AppState } from 'app/rootReducer';
import { ToolType } from 'features/boardSlices';
import { makeStyles } from 'styles/common';
import CodeEditor from './CodeEditor';

const useStyles = makeStyles<{ tool: ToolType; sidebarWidth: number }>()((theme, props) => ({
  root: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  editor: {
    width: '100%',
    flex: '1 1 auto',
    position: 'relative',
    display: 'flex',
  },
  codeEditor: {
    flex: '1 1 auto',
    width: `calc(100vw - ${props.sidebarWidth}px)`,
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
  const sidebarWidth = useSelector((state: AppState) => state.navState.sidebarWidth);
  const { classes } = useStyles({ tool, sidebarWidth });

  return (
    <div className={classes.root} aria-hidden="true">
      <div className={classes.editor}>
        <div className={classes.codeEditor}>
          <CodeEditor />
        </div>
      </div>
    </div>
  );
}
