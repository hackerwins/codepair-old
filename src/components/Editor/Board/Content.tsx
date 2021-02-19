import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { createStyles, makeStyles } from '@material-ui/core/styles';

import { AppState } from 'app/rootReducer';

import Container from './Canvas/Container';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: '100%',
      height: '100%',
    },
  }),
);

export default function Content() {
  const classes = useStyles();
  const divRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<Container | null>(null);
  const doc = useSelector((state: AppState) => state.docState.doc);
  const tool = useSelector((state: AppState) => state.boardState.tool);

  useEffect(() => {
    containerRef.current?.setTool(tool);
  }, [tool]);

  useEffect(() => {
    const onResize = () => {
      if (!divRef.current || !canvasRef.current || !doc) {
        return;
      }

      const { width, height } = divRef.current?.getBoundingClientRect();
      canvasRef.current.width = width;
      canvasRef.current.height = height;

      containerRef.current = new Container(canvasRef.current);
      // containerRef.current.drawAll(doc.getRootObject().shapes);
      // containerRef.current.onmousedown(doc.update.bind(doc));
      // containerRef.current.onmousemove(doc.update.bind(doc));
    };

    onResize();
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [doc]);

  useEffect(() => {
    if (!doc) {
      return () => {};
    }

    const unsubscribe = doc.subscribe((event) => {
      if (event.name === 'remote-change') {
        // containerRef.current?.drawAll(doc.getRootObject().shapes);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [doc]);

  return (
    <div className={classes.root} ref={divRef}>
      <canvas ref={canvasRef} />
    </div>
  );
}
