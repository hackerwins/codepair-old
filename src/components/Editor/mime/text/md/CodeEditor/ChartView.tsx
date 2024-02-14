import React, { useId, useMemo } from 'react';
import { makeStyles } from 'styles/common';
import { Theme } from 'features/settingSlices';
import { ThemeProvider, createTheme } from '@mui/material';

const useStyles = makeStyles<{ theme: string }>()((_, { theme }) => {
  return {
    root: {
      backgroundColor: theme === Theme.Dark ? '#282c34' : '#f6f6f6',
      // borderRadius: 8,
      padding: 8,
      // border: theme === Theme.Dark ? '1px solid #555555' : '1px solid rgba(0, 0, 0, 0.12)',
    },
  };
});

function ChartView({ code, theme }: { code: string; theme: string }) {
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

  /* eslint-disable react/no-danger */
  return (
    <ThemeProvider theme={themeValue}>
      <div className={classes.root}>
        <div id={id.replaceAll(':', 'chart')}>
          <pre>{code}</pre>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default ChartView;
