import React, { useEffect, useState } from 'react';
import mermaid from 'mermaid';

export function MermaidView({ code, theme }: { code: string; theme: string }) {
  const [svg, setSvg] = useState<string>('');

  useEffect(() => {
    if (!svg) {
      mermaid.initialize({
        theme,
      });

      (async () => {
        const result = await mermaid.render('demo', code);

        setSvg(result.svg);
      })();
    }
  }, [svg, code, theme]);

  /* eslint-disable react/no-danger */
  return <code dangerouslySetInnerHTML={{ __html: svg }} />;
}
