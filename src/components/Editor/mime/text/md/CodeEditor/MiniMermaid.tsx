import React, { useMemo } from 'react';
import { AppBar, Button, createTheme, ThemeProvider, Toolbar } from '@mui/material';
import './MiniMermaid.scss';
import { Theme } from 'features/settingSlices';
import { makeStyles } from 'styles/common';
import MermaidEditor from './MermaidEditor';

const useStyles = makeStyles<{ theme: string }>()((_, { theme }) => {
  return {
    root: {
      backgroundColor: theme === 'dark' ? '#333' : '#fff',
      border: theme === 'dark' ? '1px solid #121212' : '1px solid #ececec',
      boxShadow: theme === 'dark' ? 'none' : '0px 0px 10px 0px rgba(0,0,0,0.1)',

      "&[data-readonly='true']": {
        boxShadow: 'none',
      },
    },
    appBar: {
      backgroundColor: theme === 'dark' ? '#121212' : '#fff',
      color: theme === 'dark' ? 'white' : 'black',
    },
  };
});

export default function MiniMermaid({
  theme,
  onSave,
  onClose,
  content,
  readOnly,
}: {
  theme: string;
  content: string;
  onSave?: (json: any) => void;
  onClose?: () => void;
  readOnly?: boolean;
}) {
  const themeValue = useMemo(() => {
    return createTheme({
      palette: {
        mode: theme === Theme.Dark ? 'dark' : 'light',
      },
    });
  }, [theme]);
  const { classes } = useStyles({
    theme,
  });

  return (
    <ThemeProvider theme={themeValue}>
      <div
        className={['mini-mermaid-root', classes.root].join(' ')}
        data-readonly={readOnly}
        style={{
          width: '80%',
          height: '80%',
        }}
      >
        <div className="header-area">
          <AppBar position="static" className={classes.appBar} elevation={5}>
            <Toolbar
              style={{
                gap: 4,
                paddingLeft: 10,
                paddingRight: 10,
                justifyContent: 'space-between',
              }}
            >
              <div className="mini-draw-title">Mini Mermaid</div>
              <div
                className="mini-draw-tools"
                style={{
                  display: 'flex',
                  gap: 10,
                  flex: 'none',
                }}
              >
                <Button
                  variant="contained"
                  onClick={() => {
                    onSave?.(JSON.parse(JSON.stringify(app?.document)));
                  }}
                >
                  Save
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => {
                    onClose?.();
                  }}
                >
                  Close
                </Button>
              </div>
            </Toolbar>
          </AppBar>
        </div>
        <div className="canvas-area">
          <MermaidEditor theme={theme} code={content} />
        </div>
      </div>
    </ThemeProvider>
  );
}
