import React, { useCallback, useEffect, useRef } from 'react';
import { editorViewCtx } from '@milkdown/core';
import { Ctx } from '@milkdown/ctx';
import { slashFactory, SlashProvider } from '@milkdown/plugin-slash';
import { createCodeBlockCommand } from '@milkdown/preset-commonmark';
import { useInstance } from '@milkdown/react';
import { callCommand } from '@milkdown/utils';
import { usePluginViewContext } from '@prosemirror-adapter/react';
import { Button } from '@mui/material';

export const slash = slashFactory('Commands');

export const SlashView = () => {
  const ref = useRef<HTMLDivElement>(null);
  const tooltipProvider = useRef<SlashProvider>();

  const { view, prevState } = usePluginViewContext();
  const [loading, get] = useInstance();
  const action = useCallback(
    (fn: (ctx: Ctx) => void) => {
      if (loading) return;
      get().action(fn);
    },
    [loading, get],
  );

  useEffect(() => {
    const div = ref.current;
    if (loading || !div) {
      return;
    }
    tooltipProvider.current = new SlashProvider({
      content: div,
    });

    return () => {
      tooltipProvider.current?.destroy();
    };
  }, [loading]);

  useEffect(() => {
    tooltipProvider.current?.update(view, prevState);
  });

  return (
    <div data-desc="This additional wrapper is useful for keeping tooltip component during HMR">
      <div ref={ref}>
        <Button
          onMouseDown={(e) => {
            // Use `onMouseDown` with `preventDefault` to prevent the editor from losing focus.
            e.preventDefault();

            action((ctx) => {
              const editorView = ctx.get(editorViewCtx);
              const { dispatch, state } = editorView;
              const { tr, selection } = state;
              const { from } = selection;
              dispatch(tr.deleteRange(from - 1, from));
              return callCommand(createCodeBlockCommand.key)(ctx);
            });
          }}
        >
          Code Block
        </Button>
      </div>
    </div>
  );
};
