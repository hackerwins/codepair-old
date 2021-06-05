import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppState } from 'app/rootReducer';
import { ToolType, setTool } from 'features/boardSlices';

import Container from './Canvas/Container';
import './index.scss';

export default function DrawingBoard({ width, height }: { width: number; height: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<Container | null>(null);
  const dispatch = useDispatch();
  const doc = useSelector((state: AppState) => state.docState.doc);
  const tool = useSelector((state: AppState) => state.boardState.tool);
  const color = useSelector((state: AppState) => state.boardState.color);

  useEffect(() => {
    if (!canvasRef.current || !doc) {
      return () => {};
    }

    canvasRef.current.width = width;
    canvasRef.current.height = height;

    const container = new Container(canvasRef.current, doc.update.bind(doc));
    containerRef.current = container;
    containerRef.current.setTool(tool);
    containerRef.current.setColor(color);
    containerRef.current.drawAll(doc.getRoot().shapes);

    const handleMouseup = () => {
      if (tool === ToolType.Rect) {
        dispatch(setTool(ToolType.Selector));
      }
    };

    containerRef.current.addEventListener('mouseup', handleMouseup);

    return () => {
      containerRef.current?.removeEventListener('mouseup', handleMouseup);
      container.destroy();
    };
  }, [width, height, doc, tool, color]);

  useEffect(() => {
    if (!doc) {
      return () => {};
    }

    const unsubscribe = doc.subscribe((event) => {
      if (event.type === 'remote-change') {
        containerRef.current?.drawAll(doc.getRoot().shapes);
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
