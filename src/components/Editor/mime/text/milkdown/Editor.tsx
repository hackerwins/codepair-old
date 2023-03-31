import React from 'react';
import { defaultValueCtx, Editor, rootCtx } from '@milkdown/core';
import { commonmark } from '@milkdown/preset-commonmark';
import { Milkdown, MilkdownProvider, useEditor } from '@milkdown/react';
import { nord } from '@milkdown/theme-nord';
import { ProsemirrorAdapterProvider, usePluginViewFactory } from '@prosemirror-adapter/react';

import '@milkdown/theme-nord/style.css';
import { block } from '@milkdown/plugin-block';
import { cursor } from '@milkdown/plugin-cursor';

import { slash, SlashView } from './Slash';

// You should import these predefined prosemirror css styles.
import 'prosemirror-view/style/prosemirror.css';

// If you need to style tables, you should import this css file.
import 'prosemirror-tables/style/tables.css';

import './Editor.scss';

const markdown = `# Milkdown React Block
> You're scared of a world where you're needed.
This is a demo for using Milkdown with **React**.
Hover the cursor on the editor to see the block handle.`;

const InnerMilkdownEditor: React.FC = () => {
  const pluginViewFactory = usePluginViewFactory();

  useEditor((root) => {
    return Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, root);
        ctx.set(defaultValueCtx, markdown);
        ctx.set(slash.key, {
          view: pluginViewFactory({
            component: SlashView,
          }),
        });
      })
      .config(nord)
      .use(commonmark)
      .use(block)
      .use(cursor)
      .use(slash);
  }, []);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
        padding: '0 16px',
      }}
    >
      <Milkdown />
    </div>
  );
};

const MilkdownEditor: React.FC = () => {
  return (
    <MilkdownProvider>
      <ProsemirrorAdapterProvider>
        <InnerMilkdownEditor />
      </ProsemirrorAdapterProvider>
    </MilkdownProvider>
  );
};

export default MilkdownEditor;
