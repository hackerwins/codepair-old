import React, { useEffect, useRef, useCallback } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import CodeEditor from 'components/Editor/CodeEditor';
import DrawingBoard from 'components/Editor/DrawingBoard';
import Sidebar from 'components/Editor/Sidebar';
import { ToolType } from 'features/boardSlices';
import { setUserScreenWidth, setUserScreenHeight } from 'features/screenSlice';

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
      overflowX: 'auto',
    },
    codeEditor: {
      position: 'absolute',
      width: '100%',
      height: '100%',
    },
    drawBoard: {
      position: 'absolute',
      width: '100%',
      height: '100%',
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
  const dispatch = useDispatch();
  const classes = useStyles(tool);

  const editorRef = useRef<HTMLDivElement>(null);
  const codeEditorRef = useRef<CodeMirror.Editor>(null);
  const drawBoardRef = useRef<HTMLDivElement>(null);

  const handleClickEditor = useCallback(() => {
    if (tool === ToolType.None) {
      codeEditorRef.current?.focus();
    }
  }, [tool]);

  useEffect(() => {
    const onResize = () => {
      if (!editorRef.current) {
        return;
      }

      const rect = editorRef.current?.getBoundingClientRect();
      dispatch(setUserScreenWidth(rect.width));
      dispatch(setUserScreenHeight(rect.height));
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
        <div className={classes.editor} ref={editorRef}>
          <div className={classes.codeEditor}>
            <CodeEditor codeEditorRef={codeEditorRef} />
          </div>
          <div className={classes.drawBoard} ref={drawBoardRef}>
            <DrawingBoard editorRef={editorRef} drawBoardRef={drawBoardRef} />
          </div>
        </div>
      </div>
      <Sidebar />
    </>
  );
}
