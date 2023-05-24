/* eslint-disable */
import CodeMirror, { ShowHintOptions } from 'codemirror';
import data, { EmojiMartData } from '@emoji-mart/data';

const emojiList = Object.keys((data as EmojiMartData).emojis).map((key) => {
  const obj = (data as EmojiMartData).emojis[key];
  return {
    text: obj.skins[0].native,
    displayText: `${obj.skins[0].native} ${key}`,
    keyText: `:${key}:`,
    className: 'emoji-hint',
    keywords: obj.keywords,
    name: obj.name,
  };
});

(CodeMirror as any).registerHelper('hint', 'emoji', function (editor: CodeMirror.Editor, options: ShowHintOptions) {
  // Get the current cursor position and text before the cursor
  const cur = editor.getCursor();
  const wordRange = editor.findWordAt(cur);
  const from = wordRange.from();
  const to = wordRange.to();
  const query = editor.getRange(from, to);

  // Filter the list of emojis based on the prefix

  // Format the list of emojis as CodeMirror hints
  const hints = emojiList.filter((it) => {
    return (
      it.keyText.includes(query) ||
      it.keywords.some((keyword) => {
        return keyword.includes(query);
      })
    );
  });

  return {
    list: hints,
    from: CodeMirror.Pos(cur.line, from.ch - 1),
    to: CodeMirror.Pos(cur.line, to.ch),
  };
});
