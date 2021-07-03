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
    if (!canvasRef.current) {
      return () => {};
    }
    const board = new Board(canvasRef.current, doc!.update.bind(doc));
    boardRef.current = board;

    return () => {
      board.destroy();
    };
  }, [doc]);

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
    const handleMouseup = () => {
      if (tool === ToolType.Rect) {
        dispatch(setTool(ToolType.Selector));
      }
    };

    boardRef.current?.addEventListener('mouseup', handleMouseup);
    return () => {
      boardRef.current?.removeEventListener('mouseup', handleMouseup);
    };
  }, [doc, tool]);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    boardRef.current?.setWidth(width);
    boardRef.current?.setHeight(height);
    boardRef.current?.drawAll(doc!.getRoot().shapes);
  }, [doc, width, height]);

  useEffect(() => {
    boardRef.current?.setTool(tool);
  }, [doc, tool]);

  useEffect(() => {
    boardRef.current?.setColor(color);
  }, [doc, color]);

  useEffect(() => {
    if (tool === ToolType.Clear) {
      boardRef.current?.clearBoard();
      dispatch(setTool(ToolType.None));
    }
  }, [doc, tool]);

  return <canvas ref={canvasRef} />;
}
