import React, { useId, useLayoutEffect, useMemo, useState } from 'react';
import mermaid from 'mermaid';
import { makeStyles } from 'styles/common';
import { Theme } from 'features/settingSlices';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Tab, ThemeProvider, createTheme } from '@mui/material';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

import oneLight from 'react-syntax-highlighter/dist/esm/styles/prism/one-light';
import oneDark from 'react-syntax-highlighter/dist/esm/styles/prism/one-dark';

const useStyles = makeStyles<{ theme: string }>()((_, { theme }) => {
  return {
    root: {
      backgroundColor: theme === Theme.Dark ? '#282c34' : '#fff',
      borderRadius: 8,
      padding: 8,
      border: theme === Theme.Dark ? '1px solid #555555' : '1px solid rgba(0, 0, 0, 0.12)',
    },
  };
});

function ChartView({ code, theme }: { code: string; theme: string }) {
  const id = useId();
  const { classes } = useStyles({
    theme,
  });
  const [value, setValue] = useState('viewer');
  const themeValue = useMemo(
    () =>
      createTheme({
        palette: {
          mode: theme === Theme.Dark ? 'dark' : 'light',
        },
      }),
    [theme],
  );

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  useLayoutEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme,
    });

    if (value === 'code') return;

    (async () => {
      const currentId = id.replaceAll(':', 'mermaid');
      const element = document.querySelector(`#${currentId}`);

      if (element) {
        const graphDefinition = code.trim();

        const { svg } = await mermaid.render(`${currentId}svg`, graphDefinition, element);

        element.innerHTML = svg;
      }
    })();
  }, [code, theme, id, value]);

  /* eslint-disable react/no-danger */
  return (
    <ThemeProvider theme={themeValue}>
      <div className={classes.root}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Mermaid" value="viewer" />
              <Tab label="Code" value="code" />
            </TabList>
          </Box>
          <TabPanel value="viewer">
            <div id={id.replaceAll(':', 'mermaid')}>fdsafdsf</div>
          </TabPanel>
          <TabPanel
            value="code"
            style={{
              padding: 10,
            }}
          >
            <SyntaxHighlighter style={theme === Theme.Dark ? oneDark : oneLight} language="mermaid" PreTag="div">
              {code}
            </SyntaxHighlighter>
          </TabPanel>
        </TabContext>
      </div>
    </ThemeProvider>
  );
}

export default ChartView;
