import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppState } from 'app/rootReducer';
import { ToolType, setTool } from 'features/boardSlices';

import Board from './Canvas/Board';
import './index.scss';

export default function DrawingBoard({ width, height }: { width: number; height: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boardRef = useRef<Board | null>(null);
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

    const board = new Board(canvasRef.current, doc.update.bind(doc));
    boardRef.current = board;
    boardRef.current.setTool(tool);
    boardRef.current.setColor(color);
    boardRef.current.drawAll(doc.getRoot().shapes);

    const handleMouseup = () => {
      if (tool === ToolType.Rect) {
        dispatch(setTool(ToolType.Selector));
      }
    };

    boardRef.current.addEventListener('mouseup', handleMouseup);

    return () => {
      boardRef.current?.removeEventListener('mouseup', handleMouseup);
      board.destroy();
    };
  }, [width, height, doc, tool, color]);

  useEffect(() => {
    if (!doc) {
      return () => {};
    }

    const unsubscribe = doc.subscribe((event) => {
      if (event.type === 'remote-change') {
        boardRef.current?.drawAll(doc.getRoot().shapes);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [doc]);

  useEffect(() => {
    boardRef.current?.setTool(tool);
  }, [doc, tool]);

  return <canvas ref={canvasRef} />;
}
