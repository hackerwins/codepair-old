/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

import oneLight from 'react-syntax-highlighter/dist/esm/styles/prism/one-light';
import oneDark from 'react-syntax-highlighter/dist/esm/styles/prism/one-dark';

import { Theme as ThemeType } from 'features/settingSlices';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import remarkToc from 'remark-toc';
import remarkEmoji from 'remark-emoji';

import rehypeKatex from 'rehype-katex';
import fenceparser from 'fenceparser';
import MermaidView from 'components/Editor/mime/text/md/CodeEditor/MermaidView';
import MiniDraw from 'components/Editor/mime/text/md/CodeEditor/MiniDraw';
import { useSelector } from 'react-redux';
import { MetaInfo } from 'constants/editor';
import { AppState } from 'app/rootReducer';

type StyleObject = {
  [key: string]: string;
};

interface MarkdownViewerProps {
  markdown: string;
}

export function MarkdownViewser({ markdown }: MarkdownViewerProps) {
  const menu = useSelector((state: AppState) => state.settingState.menu);
  return (
    <div>
      <ReactMarkdown
        remarkPlugins={[remarkMath, remarkGfm, remarkToc, remarkEmoji]}
        rehypePlugins={[rehypeKatex]}
        components={{
          code: ({ node, inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');

            const text = children[0];

            const tempMetaInfo = fenceparser(`${node.data?.meta}`);

            const metaInfo: MetaInfo = {};
            Object.keys(tempMetaInfo).reduce((acc: any, key) => {
              if (!key || key === 'undefined') {
                return acc;
              }

              acc[key] = tempMetaInfo[key];

              return acc;
            }, metaInfo);

            // if (className === 'language-chart') {
            //   return <ChartView code={text as string} theme={menu.theme} />;
            // }

            if (className === 'language-mermaid') {
              return <MermaidView code={text as string} theme={menu.theme} />;
            }

            if (className === 'language-tldraw') {
              return <MiniDraw content={`${text}`.trim()} theme={menu.theme} readOnly meta={metaInfo} />;
            }

            return !inline && match ? (
              <SyntaxHighlighter
                {...props}
                showLineNumbers={metaInfo.showlinenumbers}
                showInlineLineNumbers={metaInfo.showinlinelinenumbers}
                data-language={match[1]}
                style={menu.theme === ThemeType.Dark ? oneDark : oneLight}
                language={match[1]}
                wrapLines
                lineProps={(lineNumber) => {
                  console.log(lineNumber, metaInfo.highlight);
                  const style: StyleObject = { display: 'block' };

                  // check line numbers
                  const hasHighlightedLineNumbers = Object.keys(metaInfo.highlight as any).some((key) => {
                    const lines = key.split('-');

                    if (lines.length === 1) {
                      if (key === `${lineNumber}`) {
                        return true;
                      }
                    } else if (lineNumber >= Number(lines[0]) && lineNumber <= Number(lines[1])) {
                      return true;
                    }
                    return false;
                  });
                  if (hasHighlightedLineNumbers) {
                    style.backgroundColor = '#ffe7a4';
                  }
                  return { style };
                }}
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
      </ReactMarkdown>
    </div>
  );
}
