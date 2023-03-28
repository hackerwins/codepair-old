import CodeMirror from 'codemirror';

(CodeMirror as any).Vim.defineEx('shuffle', 'shuf', (cm: CodeMirror.Editor, params: any) => {
  const lineStart = params.line || cm.firstLine();
  const lineEnd = params.lineEnd || params.line || cm.lastLine();
  if (lineStart === lineEnd) {
    return;
  }
  const curStart = new CodeMirror.Pos(lineStart, 0);
  const curEnd = new CodeMirror.Pos(lineEnd, cm.getLine(lineEnd).length);
  const text = cm.getRange(curStart, curEnd).split('\n');
  for (let i = text.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [text[i], text[j]] = [text[j], text[i]];
  }
  cm.replaceRange(text.join('\n'), curStart, curEnd);
});
