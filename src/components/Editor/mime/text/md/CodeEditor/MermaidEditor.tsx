import React, { useId, useLayoutEffect, useMemo } from 'react';
import mermaid from 'mermaid';
import { makeStyles } from 'styles/common';
import { Theme } from 'features/settingSlices';
import { ThemeProvider, createTheme } from '@mui/material';

const useStyles = makeStyles<{ theme: string }>()((_, { theme }) => {
  return {
    root: {
      display: 'flex',
      height: '100%',
      gap: 10,
      backgroundColor: theme === Theme.Dark ? '#282c34' : '#fff',
      borderRadius: 8,
      padding: 8,
      border: theme === Theme.Dark ? '1px solid #555555' : '1px solid rgba(0, 0, 0, 0.12)',
    },
  };
});

function MermaidEditor({ code, theme }: { code: string; theme: string }) {
  const id = useId();
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

  // const handleChange = (event: React.SyntheticEvent, newValue: string) => {
  //   setValue(newValue);
  // };

  useLayoutEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme,
    });

    (async () => {
      const currentId = id.replaceAll(':', 'mermaid');
      const element = document.querySelector(`#${currentId}`);

      if (element) {
        const graphDefinition = code.trim();

        const { svg } = await mermaid.render(`${currentId}svg`, graphDefinition, element);

        element.innerHTML = svg;
      }
    })();
  }, [code, theme, id]);

  /* eslint-disable react/no-danger */
  return (
    <ThemeProvider theme={themeValue}>
      <div className={classes.root}>
        <div
          style={{
            flex: 'none',
            width: '50%',
            boxSizing: 'border-box',
            padding: '20px 10px',
            borderRight: '1px solid #ececec',
          }}
        >
          code area {code}
        </div>
        <div
          style={{
            flex: 'none',
            width: '50%',
            boxSizing: 'border-box',
            padding: '20px 10px',
          }}
          id={id.replaceAll(':', 'mermaid')}
        >
          fdsafdsf
        </div>
      </div>
    </ThemeProvider>
  );
}

export default MermaidEditor;
