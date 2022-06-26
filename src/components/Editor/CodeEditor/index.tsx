import React, { useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { ActorID, DocEvent } from 'yorkie-js-sdk';
import CodeMirror from 'codemirror';
import SimpleMDE from 'react-simplemde-editor';

import { AppState } from 'app/rootReducer';
import { ConnectionStatus, Metadata } from 'features/peerSlices';

import { NAVBAR_HEIGHT } from '../Editor';
import Cursor from './Cursor';

import 'easymde/dist/easymde.min.css';

const WIDGET_HEIGHT = 70;

interface CodeEditorProps {
  forwardedRef: React.MutableRefObject<CodeMirror.Editor | null>;
}

export default function CodeEditor({ forwardedRef }: CodeEditorProps) {
  const doc = useSelector((state: AppState) => state.docState.doc);
  const menu = useSelector((state: AppState) => state.settingState.menu);
  const client = useSelector((state: AppState) => state.docState.client);
  const peers = useSelector((state: AppState) => state.peerState.peers);
  const cursorMapRef = useRef<Map<ActorID, Cursor>>(new Map());

  const connectCursor = useCallback((clientID: ActorID, metadata: Metadata) => {
    cursorMapRef.current.set(clientID, new Cursor(clientID, metadata));
  }, []);

  const disconnectCursor = useCallback((clientID: ActorID) => {
    if (cursorMapRef.current.has(clientID)) {
      cursorMapRef.current.get(clientID)!.clear();
      cursorMapRef.current.delete(clientID);
    }
  }, []);

  const getCmInstanceCallback = useCallback((editor: CodeMirror.Editor) => {
    if (!client || !doc) {
      return;
    }

    // eslint-disable-next-line no-param-reassign
    forwardedRef.current = editor;

    const updateCursor = (clientID: ActorID, pos: CodeMirror.Position) => {
      const cursor = cursorMapRef.current.get(clientID);
      cursor?.updateCursor(editor, pos);
    };

    const updateLine = (clientID: ActorID, fromPos: CodeMirror.Position, toPos: CodeMirror.Position) => {
      const cursor = cursorMapRef.current.get(clientID);
      cursor?.updateLine(editor, fromPos, toPos);
    };

    // 02. display remote cursors
    doc.subscribe((event: DocEvent) => {
      if (event.type === 'remote-change') {
        for (const { change } of event.value) {
          const actor = change.getID().getActorID()!;
          if (actor !== client.getID()) {
            if (!cursorMapRef.current.has(actor)) {
              return;
            }

            const cursor = cursorMapRef.current.get(actor);
            if (cursor!.isActive()) {
              return;
            }

            updateCursor(actor, editor.posFromIndex(0));
          }
        }
      }
    });

    // 03. local to remote
    editor.on('beforeChange', (instance: CodeMirror.Editor, change: CodeMirror.EditorChange) => {
      if (change.origin === 'yorkie' || change.origin === 'setValue') {
        return;
      }

      const from = editor.indexFromPos(change.from);
      const to = editor.indexFromPos(change.to);
      const content = change.text.join('\n');

      doc.update((root) => {
        root.content.edit(from, to, content);
      });
    });

    editor.on('beforeSelectionChange', (instance: CodeMirror.Editor, data: CodeMirror.EditorSelectionChange) => {
      if (!data.origin) {
        return;
      }

      const from = editor.indexFromPos(data.ranges[0].anchor);
      const to = editor.indexFromPos(data.ranges[0].head);

      doc.update((root) => {
        root.content.select(from, to);
      });
    });

    // 04. remote to local
    const root = doc.getRoot();
    root.content.onChanges((changes) => {
      changes.forEach((change) => {
        const { actor, from, to } = change;
        if (change.type === 'content') {
          const content = change.content || '';

          if (actor !== client.getID()) {
            const fromPos = editor.posFromIndex(from);
            const toPos = editor.posFromIndex(to);
            editor.replaceRange(content, fromPos, toPos, 'yorkie');
          }
        } else if (change.type === 'selection') {
          if (actor !== client.getID()) {
            let fromPos = editor.posFromIndex(from);
            let toPos = editor.posFromIndex(to);
            updateCursor(actor, toPos);

            if (from > to) {
              [toPos, fromPos] = [fromPos, toPos];
            }
            updateLine(actor, fromPos, toPos);
          }
        }
      });
    });

    // 05. initial value
    editor.setValue(root.content.toString());
    editor.getDoc().clearHistory();
    editor.focus();
  }, [client, doc]);

  useEffect(() => {
    for (const [id, peer] of Object.entries(peers)) {
      if (cursorMapRef.current.has(id) && peer.status === ConnectionStatus.Disconnected) {
        disconnectCursor(id);
      } else if (!cursorMapRef.current.has(id) && peer.status === ConnectionStatus.Connected) {
        connectCursor(id, peer.metadata);
      }
    }
  }, [peers]);

  if (!client || !doc) {
    return null;
  }

  return (
    <SimpleMDE
      options={{
        spellChecker: false,
        placeholder: 'Write code here and share...',
        tabSize: Number(menu.tabSize),
        maxHeight: `calc(100vh - ${NAVBAR_HEIGHT + WIDGET_HEIGHT}px)`,
        toolbar: ['bold', 'italic', 'heading', '|', 'quote', 'code', 'link', '|', 'image', 'table', '|', 'preview', 'side-by-side', 'fullscreen'],
        status: false,
      }}
      className="SimpleMDE"
      getCodemirrorInstance={getCmInstanceCallback}
    />
  );
}
