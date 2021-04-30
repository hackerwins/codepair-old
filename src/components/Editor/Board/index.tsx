import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppState } from 'app/rootReducer';
import usePeer from 'hooks/usePeer';
import { Tool, setTool } from 'features/boardSlices';

import Container from './Canvas/Container';
import './index.css';

export default function Board({ width, height }: { width: number; height: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<Container | null>(null);
  const dispatch = useDispatch();
  const doc = useSelector((state: AppState) => state.docState.doc);
  const client = useSelector((state: AppState) => state.docState.client);
  const tool = useSelector((state: AppState) => state.boardState.tool);
  const color = useSelector((state: AppState) => state.boardState.color);
  const { activePeerMap } = usePeer();

  useEffect(() => {
    if (!canvasRef.current || !doc || !client) {
      return () => {};
    }

    canvasRef.current.width = width;
    canvasRef.current.height = height;

    const container = new Container(canvasRef.current, client, doc.update.bind(doc));
    containerRef.current = container;
    containerRef.current.setTool(tool);
    containerRef.current.setColor(color);
    containerRef.current.drawAll(doc.getRoot().shapes);

    const handleMouseup = () => {
      if (tool === Tool.Rect) {
        dispatch(setTool(Tool.Selector));
      }
    };

    containerRef.current.on('mouseup', handleMouseup);

    return () => {
      containerRef.current?.off('mouseup', handleMouseup);
      container.destroy();
    };
  }, [width, height, doc, tool, color, client]);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    containerRef.current.setActivePeers(activePeerMap);
  }, [activePeerMap]);

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
