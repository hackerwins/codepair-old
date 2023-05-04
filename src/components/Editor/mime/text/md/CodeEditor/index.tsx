/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-inner-declarations */
/* eslint-disable react/jsx-no-bind */
import React, { useEffect, useMemo, useRef, useCallback, useState, MouseEvent } from 'react';
import { createRoot } from 'react-dom/client';
import { useDispatch, useSelector } from 'react-redux';
import { ActorID, DocEvent, TextChange } from 'yorkie-js-sdk';
import CodeMirror from 'codemirror';
import SimpleMDE from 'easymde';
import SimpleMDEReact from 'react-simplemde-editor';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

import oneLight from 'react-syntax-highlighter/dist/esm/styles/prism/one-light';
import oneDark from 'react-syntax-highlighter/dist/esm/styles/prism/one-dark';

import { AppState } from 'app/rootReducer';
import { ConnectionStatus, Presence } from 'features/peerSlices';
import { Theme as ThemeType } from 'features/settingSlices';
import { Preview, updateHeadings, getTableOfContents } from 'features/docSlices';

import { makeStyles } from 'styles/common';
import { debounce, Theme } from '@mui/material';
import { NAVBAR_HEIGHT } from 'constants/editor';
import { addRecentPage } from 'features/currentSlices';
import { setActionStatus } from 'features/actionSlices';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

import 'katex/dist/katex.min.css'; // `rehype-katex` does not import the CSS for you
import 'easymde/dist/easymde.min.css';
import 'codemirror/keymap/sublime';
import 'codemirror/keymap/emacs';
import 'codemirror/keymap/vim';
import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/foldgutter.css';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/comment/comment';
import './codemirror/shuffle';
import './codemirror/markdown-fold';
import './codemirror/markdown-hint';
import './codemirror/mermaid-preview';
import './codemirror/tldraw-preview';
import Cursor from './Cursor';
import SlideView from './slideView';
import { CodeEditorMenu } from './Menu';

import MermaidView from './MermaidView';
import MiniDraw from './MiniDraw';

const WIDGET_HEIGHT = 40;

const globalContainer = {
  rootElement: null,
};

const useStyles = makeStyles()((theme: Theme) => ({
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
      // backgroundColor: '#303030',
    },
    '& .editor-toolbar > *': {
      color: theme.palette.common.white,
    },
    '& .editor-toolbar > .active, .editor-toolbar > button:hover, .editor-preview pre, .cm-s-easymde': {
      backgroundColor: theme.palette.background.paper,
    },
    '& .editor-preview': {
      backgroundColor: theme.palette.mode === ThemeType.Dark ? '#303030' : '#fff',
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
    '& .CodeMirror-line span.cm-meta': { color: '#afafaf' },
    '& .CodeMirror-line span.cm-error': { background: '#f92672', color: '#f8f8f0' },
    '& .CodeMirror-line span.cm-qualifier': { color: '#555' },
    '& .CodeMirror-line span.cm-builtin': { color: '#66d9ef' },
    '& .CodeMirror-line span.cm-bracket': { color: '#f8f8f2' },
    '& .CodeMirror-line span.cm-tag': { color: '#bc6283' },
    '& .CodeMirror-line span.cm-attribute': { color: '#97b757' },
    '& .CodeMirror-line span.cm-hr': { color: '#999' },
    '& .CodeMirror-line span.cm-link': { color: '#ff0000' },
  },
}));

const callback = debounce((callFunction) => {
  callFunction();
}, 500);

export default function CodeEditor() {
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

  const getCmInstanceCallback = useCallback(
    (cm: CodeMirror.Editor) => {
      // mermaid type check
      (cm as any).setOption('mermaid', true);
      (cm as any).setOption('tldraw', {
        theme: menu.theme,
        emit: (event: string, message: any, trigger: (event: string, message: any) => void) => {
          if (event === 'tldraw-preview-click') {
            const container = document.getElementById('draw-panel');

            if (container) {
              const root = createRoot(container);

              function onClose() {
                root.unmount();
              }

              function onSave(content: any) {
                trigger('tldraw-preview-save', {
                  ...message,
                  content,
                });

                onClose();
              }

              root.render(
                <MiniDraw
                  key={`tldraw-preview-${message.id}`}
                  theme={menu.theme}
                  content={JSON.stringify(message.content)}
                  onClose={onClose}
                  onSave={onSave}
                />,
              );
            }
          }
        },
      });
      cm.setOption('foldGutter', true);
      cm.setOption('gutters', ['CodeMirror-foldgutter']);
      cm.setOption('foldOptions', {
        widget: () => {
          const widget = document.createElement('span');
          widget.className = 'CodeMirror-foldmarker';
          widget.innerHTML = '...';
          widget.style.cursor = 'pointer';
          widget.style.fontSize = '1.8rem';
          widget.style.lineHeight = '1rem';
          return widget;
        },
      });
      cm.setOption('extraKeys', {
        'Ctrl-/': 'toggleComment',
        'Cmd-/': 'toggleComment',
      });
      cm.setOption('hintOptions', {
        completeOnSingleClick: true,
        completeSingle: false,
        container: cm.getWrapperElement(),
      });

      cm.on('inputRead', function (cm2, event) {
        if (event.text.length > 0 && /[a-zA-Z0-9]/.test(event.text[0])) {
          cm2.showHint({
            completeSingle: false,
            alignWithWord: true,
            closeCharacters: /[\s()\[\]{};:>,]/, // eslint-disable-line no-useless-escape
            closeOnUnfocus: true,
            list: () => {
              return [
                { text: 'function', displayText: '!function' },
                { text: 'if', displayText: '!if' },
                { text: 'else', displayText: '!else' },
                { text: 'for', displayText: '!for' },
                { text: 'while', displayText: '!while' },
                { text: 'do', displayText: '!do' },
                { text: 'switch', displayText: '!switch' },
                { text: 'case', displayText: '!case' },
                { text: 'try', displayText: '!try' },
                { text: 'catch', displayText: '!catch' },
                { text: 'finally', displayText: '!finally' },
                { text: 'class', displayText: '!class' },
                { text: 'interface', displayText: '!interface' },
                { text: 'extends', displayText: '!extends' },
                {
                  text: 'implements',
                  displayText: '!implements',
                  // self customize hint
                  hint: (cm3: CodeMirror.Editor, cur: any, data: any) => {
                    cm3.replaceRange(
                      `${data.displayText} self customize`,
                      cur.from || data.from,
                      cur.to || data.to,
                      'complete',
                    );
                  },
                  render: (element: HTMLLIElement, cur: any, data: any) => {
                    const tempElement = element;
                    tempElement.textContent = `${data.displayText} (self customize)`;
                  },
                },
              ];
            },
          } as any);
        }
      });

      setEditor(cm);
    },
    [menu.theme],
  );

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

  const updateActionStatus = useCallback(callback, []);

  const uploadImage = (image: File, onSuccess: (imageUrl: string) => void, onError: (errorMessage: string) => void) => {
    try {
      if (image.type && !image.type.startsWith('image/')) {
        throw new Error(`This File type is ${image.type}. Please upload an image file.`);
      } else {
        const reader = new FileReader();

        reader.addEventListener('load', ({ target }) => {
          if (target && typeof target.result === 'string') {
            onSuccess(target.result);
          }
        });
        reader.readAsDataURL(image);
      }
    } catch (error) {
      onError(String(error));
    }
  };

  const uploadImagePreviewFunction = (src: string) => {
    // how to convert datauri to blob
    // https://stackoverflow.com/questions/4998908/convert-data-uri-to-file-then-append-to-formdata
    const dataURItoBlob = (data: string) => {
      let dataURI = data;
      if (dataURI.length < 50) {
        const max = editor?.lineCount() || 0;
        const target = dataURI.replace('...', '');

        for (let i = 0; i < max; i += 1) {
          const line = editor?.getLine(i);

          const startIndex = line?.indexOf(target) || -1;

          if (startIndex > -1) {
            const endIndex = line?.indexOf(')', startIndex);

            dataURI = line?.substring(startIndex, endIndex) || '';
            break;
          }
        }
      }

      const arr = dataURI.split(',');
      const matches = (arr as any)[0].match(/:(.*?);/);

      if (!matches || !matches[1]) {
        throw new Error('invalid data URI');
      }

      const mime = matches[1];
      const bstr = atob(arr[1]);

      let n = bstr.length;

      const u8arr = new Uint8Array(n);
      // eslint-disable-next-line no-plusplus
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    };

    try {
      return URL.createObjectURL(dataURItoBlob(src));
    } catch (err) {
      console.warn(err);
    }
  };

  const options = useMemo(() => {
    const opts = {
      spellChecker: false,
      placeholder: 'Write code here and share...',
      tabSize: Number(menu.tabSize),
      maxHeight: `calc(100vh - ${NAVBAR_HEIGHT + WIDGET_HEIGHT}px)`,
      syncSideBySidePreviewScroll: false,
      toolbar: [
        'bold',
        'italic',
        'strikethrough',
        'code',
        'horizontal-rule',
        'quote',
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
      previewImagesInEditor: true,
      imagesPreviewHandler: uploadImagePreviewFunction,
      uploadImage: true,
      imageUploadFunction: uploadImage,
      shortcuts: {
        toggleUnorderedList: null,
      },
      sideBySideFullscreen: false,

      renderingConfig: {
        markedOptions: {},
      },
      // lineNumbers: true,
      // lineWrapping: true,
    } as SimpleMDE.Options;

    if (preview === Preview.Slide) {
      const slideView = new SlideView(menu.theme);
      // eslint-disable-next-line func-names
      opts.previewRender = function (markdown: string): string {
        const { html, css } = slideView.render(markdown);

        // console.log(html, css);

        const self = this as any;
        setTimeout(() => {
          if (!self.style) {
            self.style = document.createElement('style');
            document.head.appendChild(self.style);
          }
          self.style.innerHTML = css;

          // eslint-disable-next-line no-param-reassign
          // previewElement.innerHTML = html;
        }, 20);

        return html;
      };
    } else {
      // eslint-disable-next-line func-names
      let previewRenderTimer: any;
      (window as any).prevSelectionString = null;
      opts.previewRender = function (markdown: string, previewElement: HTMLElement, origin: any = undefined): string {
        // skip if selection is not empty
        const hasFullScreen = document.querySelector('.editor-preview-full.editor-preview-active');
        const selection = (document.querySelector('.CodeMirror') as any).CodeMirror?.getSelection() || '';

        if (selection === '' && (window as any).prevSelectionString !== '' && !hasFullScreen) {
          (window as any).prevSelectionString = '';
          return null as any;
        }

        (window as any).prevSelectionString = selection;

        if (selection !== '' && !hasFullScreen) return null as any;
        // skip if selection is not empty

        if (previewRenderTimer) {
          clearTimeout(previewRenderTimer);
        }

        previewRenderTimer = setTimeout(() => {
          try {
            if (origin !== 'yorkie') {
              if (globalContainer.rootElement) {
                console.log('unmount');
                (globalContainer.rootElement as any)?.unmount();
                (globalContainer.rootElement as any) = undefined;
              }

              globalContainer.rootElement = createRoot(previewElement) as any;
            } else if (!globalContainer.rootElement) {
              globalContainer.rootElement = createRoot(previewElement) as any;
            }

            (globalContainer.rootElement as any)?.render(
              <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                  code: ({ node, inline, className, children, ...props }) => {
                    const match = /language-(\w+)/.exec(className || '');

                    const text = children[0];

                    if (className === 'language-mermaid') {
                      return <MermaidView code={text as string} theme={menu.theme} />;
                    }

                    if (className === 'language-tldraw') {
                      return <MiniDraw content={`${text}`} theme={menu.theme} readOnly />;
                    }

                    return !inline && match ? (
                      <SyntaxHighlighter
                        {...props}
                        data-language={match[1]}
                        style={menu.theme === ThemeType.Dark ? oneDark : oneLight}
                        language={match[1]}
                        PreTag="div"
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code {...props} className={className}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {markdown}
              </ReactMarkdown>,
            );
          } catch (err) {
            console.error(err);
          }
        }, 500);

        return null as any;
      };
    }
    return opts;
  }, [preview, menu]);

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

    console.log('CodeMirror instance is ready!');

    // eslint-disable-next-line no-param-reassign
    // forwardedRef.current = editor;

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

        // fold tldraw code
        (editor as any).foldTldrawCode();
      }
    };

    doc.subscribe((event: DocEvent) => {
      if (event.type === 'snapshot') {
        // re-sync for the new text from the snapshot
        syncText();
      }
    });

    editor.on('mousedown', ((_: CodeMirror.Editor, event: MouseEvent) => {
      if (event.metaKey) {
        const pos = editor.coordsChar({ left: event.clientX, top: event.clientY });
        const token = editor.getTokenAt(pos);

        if (token.type?.includes('link')) {
          window.open(token.string, token.string);
        }
      }
    }) as any);

    let timer: any;
    function updateActivePreview() {
      // render preview html when preview is active
      // easymde is not support to render preview when preview is not active
      if (timer) {
        clearTimeout(timer);
      }

      timer = setTimeout(() => {
        const previewElement = editor?.getWrapperElement().querySelector('.editor-preview-active');

        if (previewElement) {
          (options as any).previewRender(editor?.getValue(), previewElement, 'yorkie');
        }
      }, 100);
    }

    editor.on('change', () => {
      dispatch(updateHeadings());
      dispatch(
        addRecentPage({
          docKey: doc.getKey(),
          page: {
            name: `${getTableOfContents(1)[0]?.text}`,
            fileLink: window.location.pathname,
          },
        }),
      );
      dispatch(setActionStatus({ isOver: true }));
      updateActionStatus(() => {
        dispatch(setActionStatus({ isOver: false }));
      });

      updateActivePreview();
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

    function ChangeToGoPage() {
      goHeadingLink();
    }
    // set table of contents event
    // When a hashchange event occurs, move inside the codemirror with location.hash.
    window.addEventListener('hashchange', ChangeToGoPage);
    window.addEventListener('popstate', ChangeToGoPage);

    dispatch(updateHeadings());

    return () => {
      window.removeEventListener('hashchange', ChangeToGoPage);
      window.removeEventListener('popstate', ChangeToGoPage);
    };
  }, [client, doc, editor, dispatch, goHeadingLink, menu.codeKeyMap, options]);

  return (
    <>
      <SimpleMDEReact
        className={menu.theme === ThemeType.Dark ? classes.dark : ''}
        getCodemirrorInstance={getCmInstanceCallback as any}
        options={options}
      />
      <CodeEditorMenu />
      <div id="draw-panel" />
    </>
  );
}
