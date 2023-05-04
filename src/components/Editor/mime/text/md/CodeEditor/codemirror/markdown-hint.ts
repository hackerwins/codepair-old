/* eslint-disable */
import CodeMirror, { ShowHintOptions } from 'codemirror';

interface Options<T> extends ShowHintOptions {
  list?: () => T[];
}

(CodeMirror as any).registerHelper(
  'hint',
  'markdown',
  function (editor: CodeMirror.Editor, options: Options<any> = {}) {
    var cursor = editor.getCursor();
    var token = editor.getTokenAt(cursor);
    var line = editor.getLine(cursor.line);

    // Define your hint list here
    var hintList = options.list ? options.list() : ['apple', 'banana', 'cherry'];

    // Find the start of the word at the cursor
    var start = token.start;
    while (start >= 0 && /[\w\.-]/.test(line.charAt(start))) {
      --start;
    }
    ++start;

    // Get the current word
    var currentWord = line.substr(start, cursor.ch - start);

    // Filter the hint list to match the current word
    var hints = [];
    for (var i = 0; i < hintList.length; i++) {
      if (typeof hintList[i] !== 'string') {
        if (hintList[i].text.indexOf(currentWord) === 0) {
          hints.push(hintList[i]);
        }
      } else if (hintList[i].indexOf(currentWord) === 0) {
        hints.push(hintList[i]);
      }
    }

    // Hint object
    // text: string;
    // className?: string;
    // displayText?: string;
    // from?: Position;
    // /** Called if a completion is picked. If provided *you* are responsible for applying the completion */
    // hint?: (cm: CodeMirror.Editor, data: Hints, cur: Hint) => void;
    // render?: (element: HTMLLIElement, data: Hints, cur: Hint) => void;
    // to?: Position;

    // Return hint object
    return {
      list: hints,
      from: CodeMirror.Pos(cursor.line, start),
      to: CodeMirror.Pos(cursor.line, cursor.ch),
    };
  },
);
