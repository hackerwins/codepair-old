import React, { forwardRef, useId, useMemo, ForwardedRef, useEffect, useCallback } from 'react';
import mermaid from 'mermaid';
import { makeStyles } from 'styles/common';
import { Theme } from 'features/settingSlices';
import { ThemeProvider, createTheme } from '@mui/material';
import SimpleMDE from 'easymde';
import SimpleMDEReact from 'react-simplemde-editor';
import CodeMirror from 'codemirror';

const useStyles = makeStyles<{ theme: string }>()((_, { theme }) => {
  return {
    root: {
      display: 'flex',
      height: '100%',
      gap: 10,
      backgroundColor: theme === Theme.Dark ? '#121212' : '#fff',
      borderRadius: 8,
      padding: 8,
      border: theme === Theme.Dark ? '1px solid #555555' : '1px solid rgba(0, 0, 0, 0.12)',
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
    },
    light: {
      '& .EasyMDEContainer': {
        paddingLeft: '0 !important',
      },
    },
    dark: {
      '& .CodeMirror': {
        backgroundColor: '#121212',
        color: '#fff',
      },
      '& .CodeMirror-gutters': {
        backgroundColor: '#121212',
      },
      '& .CodeMirror-linenumber': {
        color: '#fff',
      },
      '& .CodeMirror-cursor': {
        borderLeft: 'solid thin #fff',
      },
      '& .CodeMirror-selected': {
        backgroundColor: '#3e4451',
      },
      '& .CodeMirror-line::selection': {
        backgroundColor: '#3e4451',
      },
      '& .CodeMirror-line::-moz-selection': {
        backgroundColor: '#3e4451',
      },
      '& .CodeMirror-foldmarker': {
        color: '#fff',
      },
      '& .CodeMirror-foldgutter-open': {
        color: '#fff',
      },
      '& .CodeMirror-foldgutter-folded': {
        color: '#fff',
      },
    },
  };
});

const idCounter = Date.now();

function getId(str: string) {
  return str.replaceAll(':', `mermaid${idCounter}`);
}

function MermaidEditor({ code, theme }: { code: string; theme: string }, textRef: ForwardedRef<CodeMirror.Editor>) {
  const id = useId();
  const [value, setValue] = React.useState(code);
  const [editor, setEditor] = React.useState<CodeMirror.Editor | null>(null);
  const { classes } = useStyles({
    theme,
  });
  const themeValue = useMemo(
    () =>
      createTheme({
        palette: {
          mode: theme === Theme.Dark ? 'dark' : 'light',
        },
      }),
    [theme],
  );

  const getCmInstanceCallback = useCallback((cm: CodeMirror.Editor) => {
    cm.setOption('mode', 'mermaid');
    cm.setOption('foldGutter', true);
    cm.setOption('gutters', ['CodeMirror-foldgutter']);
    cm.setOption('extraKeys', {
      'Ctrl-/': 'toggleComment',
      'Cmd-/': 'toggleComment',
    });

    setEditor(cm);
  }, []);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme,
    });

    (async () => {
      const currentId = getId(id);
      const element = document.querySelector(`#${currentId}`);

      if (element) {
        const graphDefinition = value.trim();

        try {
          const { svg } = await mermaid.render(`${currentId}svg2`, graphDefinition, element);
          element.innerHTML = svg;
        } catch (e) {
          element.innerHTML = `<pre>${e}</pre>`;
        }
      }
    })();
  }, [value, theme, id]);

  useEffect(() => {
    if (editor) {
      editor.setValue(code);

      editor.on('change', () => {
        setValue(`${editor?.getValue()}`.trim());
      });

      if (textRef) {
        if (typeof textRef !== 'function') {
          const tempTextRef = textRef;
          tempTextRef.current = editor;
        }
      }
    }
  }, [editor, code, textRef]);

  const options = useMemo(() => {
    const opts = {
      spellChecker: false,
      placeholder: 'Write code here and share...',
      tabSize: 4,
      toolbar: false,
      unorderedListStyle: '-',
      status: false,
      lineNumbers: true,
      lineWrapping: true,
    } as SimpleMDE.Options;

    return opts;
  }, []);

  /* eslint-disable react/no-danger */
  return (
    <ThemeProvider theme={themeValue}>
      <div className={classes.root}>
        <div
          style={{
            flex: 'none',
            width: '50%',
            boxSizing: 'border-box',
            borderRight: '1px solid #ececec',
          }}
        >
          <SimpleMDEReact
            className={theme === 'dark' ? classes.dark : classes.light}
            getCodemirrorInstance={getCmInstanceCallback as any}
            options={options}
          />
        </div>
        <div
          style={{
            flex: 'none',
            width: '50%',
            boxSizing: 'border-box',
            padding: '20px 10px',
          }}
          id={getId(id)}
        >
          fdsafdsf
        </div>
      </div>
    </ThemeProvider>
  );
}

export default forwardRef(MermaidEditor);
