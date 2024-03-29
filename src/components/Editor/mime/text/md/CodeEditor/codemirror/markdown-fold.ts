/* eslint-disable */
import CodeMirror from 'codemirror';

(CodeMirror as any).registerHelper('fold', 'markdown', function (cm: CodeMirror.Editor, start: CodeMirror.Position) {
  var maxDepth = 100;

  function isHeader(lineNo: number) {
    var tokentype = cm.getTokenTypeAt(CodeMirror.Pos(lineNo, 0));
    return tokentype && /\bheader\b/.test(tokentype);
  }

  function headerLevel(lineNo: number, line: string, nextLine: string) {
    var match = line && line.match(/^#+/);
    if (match && isHeader(lineNo)) return match[0].length;
    match = nextLine && nextLine.match(/^[=\-]+\s*$/);
    if (match && isHeader(lineNo + 1)) return nextLine[0] == '=' ? 1 : 2;
    return maxDepth;
  }

  var firstLine = cm.getLine(start.line);
  var nextLine = cm.getLine(start.line + 1);

  if (firstLine.indexOf('```tldraw') > -1 && nextLine.indexOf('```') === -1) {
    return {
      from: CodeMirror.Pos(start.line + 1, 0),
      to: CodeMirror.Pos(start.line + 1, nextLine.length),
    };
  }

  // datauri fold
  const dataOffset = firstLine.indexOf('(data:');
  if (dataOffset > -1) {
    const startOffset = firstLine.indexOf(';base64,', dataOffset);
    const lastOffset = firstLine.indexOf(')', dataOffset);

    return {
      from: CodeMirror.Pos(start.line, startOffset + 30),
      to: CodeMirror.Pos(start.line, lastOffset),
    };
  }

  var level = headerLevel(start.line, firstLine, nextLine);
  if (level === maxDepth) return undefined;

  var lastLineNo = cm.lastLine();
  var end = start.line,
    nextNextLine = cm.getLine(end + 2);
  while (end < lastLineNo) {
    if (headerLevel(end + 1, nextLine, nextNextLine) <= level) break;
    ++end;
    nextLine = nextNextLine;
    nextNextLine = cm.getLine(end + 2);
  }

  return {
    from: CodeMirror.Pos(start.line, firstLine.length),
    to: CodeMirror.Pos(end, cm.getLine(end).length),
  };
});
