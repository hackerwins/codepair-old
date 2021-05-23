import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppState } from 'app/rootReducer';
import usePeer from 'hooks/usePeer';
import { ToolType, setTool } from 'features/boardSlices';

import Board from './Canvas/Board';
import './index.css';

export default function DrawingBoard({ width, height }: { width: number; height: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dispatch = useDispatch();
  const doc = useSelector((state: AppState) => state.docState.doc);
  const client = useSelector((state: AppState) => state.docState.client);
  const tool = useSelector((state: AppState) => state.boardState.tool);
  const color = useSelector((state: AppState) => state.boardState.color);
  const { activePeers } = usePeer();

  useEffect(() => {
    if (!canvasRef.current || !doc || !client) {
      return;
    }

    Board.getInstance().setClient(client);
    Board.getInstance().setDocUpdate(doc.update.bind(doc));
    Board.getInstance().initialize();
  }, [doc, client]);

  useEffect(() => {
    if (!canvasRef.current || !doc) {
      return () => {};
    }

    canvasRef.current.width = width;
    canvasRef.current.height = height;

    Board.getInstance().setCanvas(canvasRef.current);
    Board.getInstance().initializeCanvas();
    Board.getInstance().drawAll(doc.getRoot().shapes);
    return () => {
      Board.getInstance().destroyCanvas();
    };
  }, [width, height, doc]);

  useEffect(() => {
    Board.getInstance().setTool(tool);

    const handleMouseup = () => {
      if (tool === ToolType.Rect) {
        dispatch(setTool(ToolType.Selector));
      }
    };

    Board.getInstance().addEventListener('mouseup', handleMouseup);
    return () => {
      Board.getInstance().removeEventListener('mouseup', handleMouseup);
    };
  }, [tool]);

  useEffect(() => {
    Board.getInstance().setColor(color);
  }, [color]);

  useEffect(() => {
    Board.getInstance().setActivePeers(activePeers);
  }, [activePeers]);

  useEffect(() => {
    if (!doc) {
      return () => {};
    }

    const unsubscribe = doc.subscribe((event) => {
      if (event.type === 'remote-change') {
        Board.getInstance().drawAll(doc.getRoot().shapes);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [doc]);

  return <canvas ref={canvasRef} />;
}
