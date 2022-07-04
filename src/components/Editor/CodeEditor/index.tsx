import React, { useEffect, useMemo, useRef, useCallback } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import { ActorID, DocEvent } from 'yorkie-js-sdk';
import CodeMirror from 'codemirror';
import SimpleMDE from 'easymde';
import SimpleMDEReact from 'react-simplemde-editor';

import { AppState } from 'app/rootReducer';
import { ConnectionStatus, Metadata } from 'features/peerSlices';
import { Theme as ThemeType } from 'features/settingSlices';
import { Preview } from 'features/docSlices';

import { NAVBAR_HEIGHT } from '../Editor';
import Cursor from './Cursor';
import SlideView from './slideView';

import 'easymde/dist/easymde.min.css';
import 'codemirror/keymap/sublime';
import 'codemirror/keymap/emacs';
import 'codemirror/keymap/vim';
import './codemirror/shuffle';

const WIDGET_HEIGHT = 70;

interface CodeEditorProps {
  forwardedRef: React.MutableRefObject<CodeMirror.Editor | null>;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dark: {
      '& .CodeMirror': {
        color: theme.palette.common.white,
        borderColor: theme.palette.background.paper,
        backgroundColor: theme.palette.background.paper,
      },
      '& .CodeMirror-cursor': {
        borderLeftColor: theme.palette.common.white,
        color: theme.palette.common.white,
      },
      '& .editor-toolbar': {
        backgroundColor: '#303030',
      },
      '& .editor-toolbar > *': {
        color: theme.palette.common.white,
      },
      '& .editor-toolbar > .active, .editor-toolbar > button:hover, .editor-preview pre, .cm-s-easymde': {
        backgroundColor: theme.palette.background.paper,
      },
      '& .editor-preview': {
        backgroundColor: theme.palette.background.default,
      },

      '& .CodeMirror-line span.cm-keyword': { color: '#f92672' },
      '& .CodeMirror-line span.cm-atom': { color: '#ae81ff' },
      '& .CodeMirror-line span.cm-number': { color: '#ae81ff' },
      '& .CodeMirror-line span.cm-def': { color: '#bc9262' },
      '& .CodeMirror-line span.cm-variable': { color: '#f8f8f2' },
      '& .CodeMirror-line span.cm-property': { color: '#a6e22e' },
      '& .CodeMirror-line span.cm-operator': { color: '#fff' },
      '& .CodeMirror-line span.cm-string': { color: '#e6db74' },
      '& .CodeMirror-line span.cm-string-2': { color: '#e6db74' },
      '& .CodeMirror-line span.cm-meta': { color: '#555' },
      '& .CodeMirror-line span.cm-error': { background: '#f92672', color: '#f8f8f0' },
      '& .CodeMirror-line span.cm-qualifier': { color: '#555' },
      '& .CodeMirror-line span.cm-builtin': { color: '#66d9ef' },
      '& .CodeMirror-line span.cm-bracket': { color: '#f8f8f2' },
      '& .CodeMirror-line span.cm-tag': { color: '#bc6283' },
      '& .CodeMirror-line span.cm-attribute': { color: '#97b757' },
      '& .CodeMirror-line span.cm-hr': { color: '#999' },
    },
  }),
);

export default function CodeEditor({ forwardedRef }: CodeEditorProps) {
  const classes = useStyles();

  const doc = useSelector((state: AppState) => state.docState.doc);
  const preview = useSelector((state: AppState) => state.docState.preview);
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

  const getCmInstanceCallback = useCallback(
    (editor: CodeMirror.Editor) => {
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

      // display remote cursors
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

      // local to remote
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

      // remote to local
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

      editor.addKeyMap(menu.codeKeyMap);
      editor.setOption('keyMap', menu.codeKeyMap);
      editor.setValue(root.content.toString());
      editor.getDoc().clearHistory();
      editor.focus();
    },
    [client, doc, menu],
  );

  useEffect(() => {
    for (const [id, peer] of Object.entries(peers)) {
      if (cursorMapRef.current.has(id) && peer.status === ConnectionStatus.Disconnected) {
        disconnectCursor(id);
      } else if (!cursorMapRef.current.has(id) && peer.status === ConnectionStatus.Connected) {
        connectCursor(id, peer.metadata);
      }
    }
  }, [peers]);

  const options = useMemo(() => {
    const opts = {
      spellChecker: false,
      placeholder: 'Write code here and share...',
      tabSize: Number(menu.tabSize),
      maxHeight: `calc(100vh - ${NAVBAR_HEIGHT + WIDGET_HEIGHT}px)`,
      toolbar: [
        'bold',
        'italic',
        '|',
        'unordered-list',
        'ordered-list',
        '|',
        'code',
        'link',
        'image',
        'table',
        '|',
        'side-by-side',
        'preview',
        'fullscreen',
      ],
      unorderedListStyle: '-',
      status: false,
      shortcuts: {
        toggleUnorderedList: null,
      },
    } as SimpleMDE.Options;

    if (preview === Preview.Slide) {
      const slideView = new SlideView(menu.theme);
      // eslint-disable-next-line func-names
      opts.previewRender = function (markdown: string, previewElement: HTMLElement): string {
        const { html, css } = slideView.render(markdown);
        // @ts-ignore
        const self = this as any;
        setTimeout(() => {
          if (!self.style) {
            self.style = document.createElement('style');
            document.head.appendChild(self.style);
          }
          self.style.innerHTML = css;

          // eslint-disable-next-line no-param-reassign
          previewElement.innerHTML = html;
        }, 20);

        // @ts-ignore
        return null;
      };
    }
    return opts;
  }, [preview]);

  return (
    <SimpleMDEReact
      className={menu.theme === ThemeType.Dark ? classes.dark : ''}
      getCodemirrorInstance={getCmInstanceCallback}
      options={options}
    />
  );
}
