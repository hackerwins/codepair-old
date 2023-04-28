import React, { useEffect, useState } from 'react';
import mermaid from 'mermaid';

export function MermaidView({ code }: { code: string }) {
  const [svg, setSvg] = useState<string>('');

  useEffect(() => {
    if (!svg) {
      (async () => {
        const result = await mermaid.render('demo', code);

        setSvg(result.svg);
      })();
    }
  }, [svg, code]);

  /* eslint-disable react/no-danger */
  return <code dangerouslySetInnerHTML={{ __html: svg }} />;
}
