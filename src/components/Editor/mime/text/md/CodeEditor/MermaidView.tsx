import React, { useId, useLayoutEffect } from 'react';
import mermaid from 'mermaid';
import { makeStyles } from 'styles/common';
import { Theme } from 'features/settingSlices';

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

function MermaidView({ code, theme }: { code: string; theme: string }) {
  const id = useId();
  const { classes } = useStyles({
    theme,
  });

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
    <div className={classes.root}>
      <div id={id.replaceAll(':', 'mermaid')} />
    </div>
  );
}

export default MermaidView;
