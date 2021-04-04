import React, { useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { ActorID } from 'yorkie-js-sdk';
import { UnControlled as CodeMirror } from 'react-codemirror2';

import { AppState } from 'app/rootReducer';
import { ConnectionStatus, Metadata } from 'features/peerSlices';
import { Theme } from 'features/settingSlices';

import Cursor from './Cursor';

import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/comment/comment';

import 'codemirror/mode/gfm/gfm';
import 'codemirror/mode/go/go';
import 'codemirror/mode/dart/dart';
import 'codemirror/mode/ruby/ruby';
import 'codemirror/mode/rust/rust';
import 'codemirror/mode/python/python';
import 'codemirror/mode/clojure/clojure';
import 'codemirror/mode/javascript/javascript';

import 'codemirror/keymap/sublime';
import 'codemirror/keymap/emacs';
import 'codemirror/keymap/vim';

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/monokai.css';
import 'codemirror/theme/xq-light.css';
import './index.css';

interface CodeEditorProps {
  forwardedRef: React.MutableRefObject<CodeMirror.Editor | null>;
}

export default function CodeEditor({ forwardedRef }: CodeEditorProps) {
  const doc = useSelector((state: AppState) => state.docState.doc);
  const codeMode = useSelector((state: AppState) => state.docState.mode);
  const client = useSelector((state: AppState) => state.docState.client);
  const peers = useSelector((state: AppState) => state.peerState.peers);
  const menu = useSelector((state: AppState) => state.settingState.menu);
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
    <CodeMirror
      className="CodeMirror"
      options={{
        mode: codeMode,
        theme: menu.theme === Theme.Dark ? 'monokai' : 'xq-light',
        keyMap: menu.codeKeyMap,
        tabSize: Number(menu.tabSize),
        lineNumbers: true,
        lineWrapping: true,
        autoCloseTags: true,
        autoCloseBrackets: true,
      }}
      editorDidMount={(editor: CodeMirror.Editor) => {
        // eslint-disable-next-line no-param-reassign
        forwardedRef.current = editor;

        editor.focus();
        const updateCursor = (clientID: ActorID, pos: CodeMirror.Position) => {
          const cursor = cursorMapRef.current.get(clientID);
          cursor?.updateCursor(editor, pos);
        };

        const updateLine = (clientID: ActorID, fromPos: CodeMirror.Position, toPos: CodeMirror.Position) => {
          const cursor = cursorMapRef.current.get(clientID);
          cursor?.updateLine(editor, fromPos, toPos);
        };

        // TODO(ppeeou) Load user's cursor position
        doc.subscribe((event) => {
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

        // When there is a document modification connected to the yorkie
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

        editor.setValue(root.content.getValue());
      }}
      // Notifying other clients to move the cursor
      onSelection={(editor: CodeMirror.Editor, data: CodeMirror.EditorSelectionChange) => {
        if (!data.origin) {
          return;
        }

        const from = editor.indexFromPos(data.ranges[0].anchor);
        const to = editor.indexFromPos(data.ranges[0].head);

        doc.update((root) => {
          root.content.select(from, to);
        });
      }}
      // Edit the yorkie document
      onBeforeChange={(editor: CodeMirror.Editor, change: CodeMirror.EditorChange) => {
        if (change.origin === 'yorkie' || change.origin === 'setValue') {
          return;
        }

        const from = editor.indexFromPos(change.from);
        const to = editor.indexFromPos(change.to);
        const content = change.text.join('\n');

        doc.update((root) => {
          root.content.edit(from, to, content);
        });
      }}
    />
  );
}
