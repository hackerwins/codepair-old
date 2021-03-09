import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import grey from '@material-ui/core/colors/grey';
import deepOrange from '@material-ui/core/colors/deepOrange';

import { AppState } from 'app/rootReducer';

import Container from './Canvas/Container';
import './index.css';

export default function Board({ width, height }: { width: number; height: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<Container | null>(null);
  const doc = useSelector((state: AppState) => state.docState.doc);
  const tool = useSelector((state: AppState) => state.boardState.tool);

  useEffect(() => {
    if (!canvasRef.current || !doc) {
      return;
    }

    const options = {
      color: grey[500],
      eraserColor: deepOrange[400],
    };

    canvasRef.current.width = width;
    canvasRef.current.height = height;
    containerRef.current = new Container(canvasRef.current, doc.update.bind(doc), options);
    containerRef.current.setTool(tool);
    containerRef.current.drawAll(doc.getRootObject().shapes);
  }, [width, height, doc, tool]);

  useEffect(() => {
    if (!doc) {
      return () => {};
    }

    const unsubscribe = doc.subscribe((event) => {
      if (event.name === 'remote-change') {
        containerRef.current?.drawAll(doc.getRootObject().shapes);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [doc]);

  useEffect(() => {
    containerRef.current?.setTool(tool);
  }, [doc, tool]);

  return <canvas ref={canvasRef} />;
}
