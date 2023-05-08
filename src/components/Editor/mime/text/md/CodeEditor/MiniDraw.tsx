import React, { useEffect, useMemo, useState } from 'react';
import { Tldraw, TldrawApp, useFileSystem } from '@tldraw/tldraw';
import { AppBar, Button, createTheme, ThemeProvider, Toolbar } from '@mui/material';
import './MiniDraw.scss';
import { Theme } from 'features/settingSlices';
import { makeStyles } from 'styles/common';
import { MetaInfo } from 'constants/editor';

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

interface MiniDrawProps {
  theme: string;
  content: string;
  onSave?: (json: any) => void;
  onClose?: () => void;
  readOnly?: boolean;
  meta?: MetaInfo;
}

export default function MiniDraw({ theme, onSave, onClose, content, readOnly }: MiniDrawProps) {
  const [app, setApp] = useState<TldrawApp>();
  const fileSystemEvents = useFileSystem();
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

  useEffect(() => {
    if (app && content) {
      const tempContent = JSON.parse(content);

      if (typeof tempContent === 'object') {
        app.loadDocument(tempContent);
        app.selectNone();
      }

      setTimeout(() => {
        app.zoomToFit();
      }, 10);
    }

    return () => {
      // app?.resetDocument();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, app]);

  return (
    <ThemeProvider theme={themeValue}>
      <div
        className={['mini-draw-root', classes.root].join(' ')}
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
              <div className="mini-draw-title">
                Mini <strong>tldraw</strong>
              </div>
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
          <Tldraw
            autofocus={false}
            disableAssets
            showPages={false}
            showMultiplayerMenu={false}
            showMenu={!readOnly}
            showTools={!readOnly}
            showStyles={!readOnly}
            {...fileSystemEvents}
            onMount={(tldraw) => {
              setApp(tldraw);
            }}
            // readOnly={readOnly}
            darkMode={theme === 'dark'}
          />
        </div>
      </div>
    </ThemeProvider>
  );
}
