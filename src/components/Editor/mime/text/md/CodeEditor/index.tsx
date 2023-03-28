import React, { useEffect, useMemo, useRef, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ActorID, DocEvent, TextChange } from 'yorkie-js-sdk';
import CodeMirror from 'codemirror';
import SimpleMDE from 'easymde';
import SimpleMDEReact from 'react-simplemde-editor';

import { AppState } from 'app/rootReducer';
import { ConnectionStatus, Presence } from 'features/peerSlices';
import { Theme as ThemeType } from 'features/settingSlices';
import { Preview, updateHeadings } from 'features/docSlices';

import { updateLinkNameWithHeading } from 'features/linkSlices';
import { makeStyles } from 'styles/common';
import { Theme } from '@mui/material';
import { NAVBAR_HEIGHT } from 'constants/editor';

import 'easymde/dist/easymde.min.css';
import 'codemirror/keymap/sublime';
import 'codemirror/keymap/emacs';
import 'codemirror/keymap/vim';
import './codemirror/shuffle';
import Cursor from './Cursor';
import SlideView from './slideView';

const WIDGET_HEIGHT = 46;

interface CodeEditorProps {
  forwardedRef: React.MutableRefObject<CodeMirror.Editor | null>;
}

const useStyles = makeStyles()((theme: Theme) => ({
  dark: {
    height: `calc(100% - ${20}px)`,
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
}));

export default function CodeEditor({ forwardedRef }: CodeEditorProps) {
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const doc = useSelector((state: AppState) => state.docState.doc);
  const preview = useSelector((state: AppState) => state.docState.preview);
  const menu = useSelector((state: AppState) => state.settingState.menu);
  const client = useSelector((state: AppState) => state.docState.client);
  const peers = useSelector((state: AppState) => state.peerState.peers);
  const cursorMapRef = useRef<Map<ActorID, Cursor>>(new Map());
  const [editor, setEditor] = useState<CodeMirror.Editor | null>(null);

  const connectCursor = useCallback((clientID: ActorID, presence: Presence) => {
    cursorMapRef.current.set(clientID, new Cursor(clientID, presence));
  }, []);

  const disconnectCursor = useCallback((clientID: ActorID) => {
    if (cursorMapRef.current.has(clientID)) {
      cursorMapRef.current.get(clientID)!.clear();
      cursorMapRef.current.delete(clientID);
    }
  }, []);

  const getCmInstanceCallback = useCallback((cm: CodeMirror.Editor) => {
    setEditor(cm);
  }, []);

  const goHeadingLink = useCallback(() => {
    const cm = document.querySelector('.CodeMirror');

    if (cm) {
      const { CodeMirror: cmInstance } = cm as any;

      const searchText = decodeURIComponent(window.location.hash.replace('#', ''));
      const cursor = (cmInstance as any).getSearchCursor(searchText);

      if (cursor.find()) {
        const pos = cursor.from();
        const t = cmInstance.charCoords(pos, 'local').top;
        cmInstance.scrollTo(null, t);
        cmInstance.setCursor(pos);
        cmInstance.focus();
      }
    }
  }, []);

  useEffect(() => {
    for (const [id, peer] of Object.entries(peers)) {
      if (cursorMapRef.current.has(id) && peer.status === ConnectionStatus.Disconnected) {
        disconnectCursor(id);
      } else if (!cursorMapRef.current.has(id) && peer.status === ConnectionStatus.Connected) {
        connectCursor(id, peer.presence);
      }
    }
  }, [peers, connectCursor, disconnectCursor]);

  useEffect(() => {
    if (!client || !doc || !editor) {
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

    // remote to local
    const changeEventHandler = (changes: TextChange[]) => {
      changes.forEach((change) => {
        const { actor, from, to } = change;
        if (change.type === 'content') {
          const content = change.value?.content || '';
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
    };

    // sync text of document and editor
    const syncText = () => {
      const text = doc.getRoot().content;

      if (text) {
        text.onChanges(changeEventHandler);
        editor.setValue(text.toString());
      }
    };

    doc.subscribe((event: DocEvent) => {
      if (event.type === 'remote-change') {
        // display remote cursors
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
      } else if (event.type === 'snapshot') {
        // re-sync for the new text from the snapshot
        syncText();
      }
    });

    editor.on('mousedown', (instance: CodeMirror.Editor, event: MouseEvent) => {
      if (event.metaKey) {
        const pos = editor.coordsChar({ left: event.clientX, top: event.clientY });
        const token = editor.getTokenAt(pos);

        if (token.type?.includes('link')) {
          window.open(token.string, token.string);
        }
      }
    });

    editor.on('change', () => {
      dispatch(updateHeadings());
      dispatch(updateLinkNameWithHeading());
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

    syncText();
    editor.addKeyMap(menu.codeKeyMap);
    editor.setOption('keyMap', menu.codeKeyMap);
    editor.getDoc().clearHistory();
    editor.focus();

    // link to heading
    goHeadingLink();

    // set table of contents event
    // When a hashchange event occurs, move inside the codemirror with location.hash.
    window.addEventListener('hashchange', () => {
      goHeadingLink();
    });

    window.addEventListener('popstate', () => {
      goHeadingLink();
    });

    dispatch(updateHeadings());
  }, [client, doc, editor, forwardedRef, menu, goHeadingLink, dispatch]);

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

        return null as any;
      };
    }
    return opts;
  }, [preview, menu]);

  return (
    <SimpleMDEReact
      className={menu.theme === ThemeType.Dark ? classes.dark : ''}
      getCodemirrorInstance={getCmInstanceCallback as any}
      options={options}
    />
  );
}
