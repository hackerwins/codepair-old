import React, { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppState } from 'app/rootReducer';
import { ToolType, setTool } from 'features/boardSlices';
import { SCREEN_PADDING, setDrawBoardHeight, setDrawBoardWidth } from 'features/screenSlice';
import { Metadata } from 'features/peerSlices';
import { BoardMetadata } from './Canvas/Worker';
import Board from './Canvas/Board';
import './index.scss';

export default function DrawingBoard({
  editorRef,
  drawBoardRef,
}: {
  editorRef: React.MutableRefObject<HTMLDivElement | null>;
  drawBoardRef: React.MutableRefObject<HTMLDivElement | null>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boardRef = useRef<Board | null>(null);
  const dispatch = useDispatch();
  const client = useSelector((state: AppState) => state.docState.client);
  const doc = useSelector((state: AppState) => state.docState.doc);
  const tool = useSelector((state: AppState) => state.boardState.toolType);
  const color = useSelector((state: AppState) => state.boardState.color);
  const screen = useSelector((state: AppState) => state.screenState);

  const updateCodeMirrorSize = useCallback(() => {
    let maxX = -1;
    let maxY = -1;
    for (const shape of doc!.getRoot().shapes) {
      for (const point of shape.points) {
        maxX = maxX > point.x ? maxX : point.x;
        maxY = maxY > point.y ? maxY : point.y;
      }
    }

    dispatch(setDrawBoardWidth(maxX + SCREEN_PADDING));
    dispatch(setDrawBoardHeight(maxY + SCREEN_PADDING));
  }, [doc]);

  useEffect(() => {
    const board = new Board(canvasRef.current!, editorRef.current!, drawBoardRef.current!, doc!.update.bind(doc));
    boardRef.current = board;

    return () => {
      board.destroy();
    };
  }, [doc]);

  useEffect(() => {
    if (!doc) {
      return () => {};
    }

    updateCodeMirrorSize();
    const unsubscribe = doc.subscribe((event) => {
      if (event.type === 'remote-change') {
        updateCodeMirrorSize();

        boardRef.current?.drawAll(doc.getRoot().shapes);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [doc]);

  useEffect(() => {
    const codeMirrorScrollEl = editorRef.current?.querySelector('.CodeMirror-scroll')!;

    const onScroll: EventListenerOrEventListenerObject = (evt) => {
      const target = evt.target as HTMLDivElement;
      if (parseInt(drawBoardRef.current!.style.left, 10) !== target.scrollLeft) {
        // eslint-disable-next-line no-param-reassign
        drawBoardRef.current!.style.left = `-${target.scrollLeft}px`;
      }
    };

    codeMirrorScrollEl.addEventListener('scroll', onScroll);
    return () => {
      codeMirrorScrollEl.removeEventListener('scroll', onScroll);
    };
  }, [doc]);

  useEffect(() => {
    if (!client || !doc) {
      return () => {};
    }

    const unsubscribe = client.subscribe((event) => {
      if (event.type === 'peers-changed') {
        const documentKey = doc.getKey();
        const changedPeers = event.value[documentKey];

        for (const peerKey of Object.keys(changedPeers)) {
          boardRef.current?.updateMetadata(peerKey, changedPeers[peerKey]);
        }
      }
    });

    const clientId = client.getID()!;
    const handleUpdateMeta = (data: BoardMetadata) => {
      const board = JSON.stringify(data);
      boardRef.current?.updateMetadata(clientId, {
        board,
      } as Metadata);
      client?.updateMetadata('board', board);
    };

    boardRef.current?.addEventListener('mousemove', handleUpdateMeta);
    boardRef.current?.addEventListener('mousedown', handleUpdateMeta);
    boardRef.current?.addEventListener('mouseout', handleUpdateMeta);
    boardRef.current?.addEventListener('mouseup', handleUpdateMeta);

    return () => {
      unsubscribe();
      boardRef.current?.removeEventListener('mousemove', handleUpdateMeta);
      boardRef.current?.removeEventListener('mousedown', handleUpdateMeta);
      boardRef.current?.removeEventListener('mouseout', handleUpdateMeta);
      boardRef.current?.removeEventListener('mouseup', handleUpdateMeta);
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
    const codeMirrorSizeEl = editorRef.current?.querySelector('.CodeMirror-sizer')! as HTMLDivElement;
    codeMirrorSizeEl.style.minWidth = `${screen.drawBoardScreenWidth}px`;
    boardRef.current?.setWidth(screen.drawBoardScreenWidth);
    boardRef.current?.drawAll(doc!.getRoot().shapes);
  }, [doc, screen.drawBoardScreenWidth]);

  useEffect(() => {
    boardRef.current?.setHeight(screen.drawBoardScreenHeight);
    boardRef.current?.drawAll(doc!.getRoot().shapes);
  }, [doc, screen.drawBoardScreenHeight]);

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
