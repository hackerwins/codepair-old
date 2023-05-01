/* eslint-disable */
import CodeMirror from 'codemirror';
// import mermaid from 'mermaid';
// import './mermaid-preview.scss';
// class MermaidPreview {
//   cm: CodeMirror.Editor;
//   val: any;
//   widget: any;
//   constructor(cm: CodeMirror.Editor, val: boolean) {
//     this.cm = cm;
//     this.val = val;
//     this.widget = null;

//     this.initEvent();
//   }

//   initEvent() {
//     this.cm.on('change', this.change.bind(this));
//     this.cm.on('refresh', this.refresh.bind(this));
//   }

//   change(cm: CodeMirror.Editor, evt: any) {
//     this.updateAll();
//   }

//   refresh() {
//     this.change(this.cm, { origin: 'setValue' });
//   }

//   updateAll() {
//     this.cm.operation(() => {
//       var max = this.cm.lineCount();

//       for (var lineNo = 0; lineNo < max; ) {
//         lineNo = this.match(lineNo);
//       }
//     });
//   }

//   match(lineNo: number): number {
//     let lastLineNo = lineNo;

//     const tokens = this.cm.getLineTokens(lineNo);

//     if (tokens[0]?.string === '```mermaid') {
//       const start = lineNo;
//       const end = this.cm.lineCount();

//       let nextLine = start + 1;
//       let contents: string[] = [];
//       while (nextLine < end) {
//         const nextLineString = this.cm.getLine(nextLine);

//         if (nextLineString === '```') {
//           break;
//         }

//         ++nextLine;
//         contents.push(nextLineString);
//       }

//       console.log(nextLine);
//       if (this.widget) {
//         this.widget.clear();
//       }
//       this.widget = this.cm.addLineWidget(
//         this.cm.getLineHandle(nextLine),
//         this.render(lineNo, nextLine, contents.join('\n')),
//       );

//       console.log(this.widget.line);

//       lastLineNo = nextLine;

//       return lastLineNo;
//     }

//     return lastLineNo + 1;
//   }

//   render(start: number, end: number, content: string) {
//     const div = document.createElement('div');
//     div.className = 'mermaid-preview';
//     // div.innerHTML = content;
//     div.style.height = '300px';
//     setTimeout(async () => {
//       const result = await mermaid.render('newDiagram', content.trim(), div);

//       div.innerHTML = result.svg;
//       //   const height = (div?.firstChild as any)?.getBoundingClientRect()?.height;

//       //   if (height) {
//       //     div.style.height = height + 'px';
//       //   }
//     }, 100);

//     return div;
//   }
// }

// (CodeMirror as any).defineOption('mermaid', false, function (cm: CodeMirror.Editor, val: boolean) {
//   if (val) {
//     cm.state.mermaidView = new MermaidPreview(cm, val);
//   }
// });

CodeMirror.defineMode('mermaid', function (config, parserConfig) {
  var mermaidMode = CodeMirror.getMode(config, 'text/plain');
  var keywords = parserConfig.keywords || {};
  var operators = parserConfig.operators || {};

  function tokenBase(stream: CodeMirror.StringStream, state: unknown): string | null {
    if (stream.match(/^(\[[^\]]+\]|\{[^\}]+\})/)) {
      return 'string';
    }
    if (stream.match(/^("[^"]+")/)) {
      return 'string';
    }

    if (stream.match(/^(flowchart|sequenceDiagram|classDiagram|node|edge|classDef)|($|\s)/)) {
      return 'keyword';
    }
    if (
      stream.match(
        /^(def|for|LR|TD|TB|BT|RL|box|actor|participant|activate|deactivate|over|loop|end|subgraph|class|style|classDef|Note|alt|opt|par|critical|option|break|rect|right of)/i,
      )
    ) {
      return 'keyword';
    }
    if (stream.match(/^([+\-]([^ \(\)]+))/i)) {
      return 'property';
    }
    if (
      stream.match(
        /^(<\|--)|(\:\:\:)|(->>)|(-\))|(--\))|(---->)|(-->)|(--x)|(x--x)|(o--o)|(<-->)|(==>)|(==)|(\~\~\~)|(---)|(--)|(&)|(<--)|(\|)|(-\.->)|(-\.)|(\.-)/,
      )
    ) {
      return 'operator';
    }
    if (stream.match(/^\d+$/)) {
      return 'number';
    }
    if (stream.match(/^\w+:/)) {
      return 'property';
    }
    if (stream.match(/^\w+/)) {
      return 'word';
    }
    if (stream.match(/^%%.*/)) {
      return 'comment';
    }
    stream.next();
    return null;
  }

  return CodeMirror.overlayMode(mermaidMode, {
    token: function (stream, state) {
      return keywords.propertyIsEnumerable(stream.current())
        ? 'keyword'
        : operators.propertyIsEnumerable(stream.current())
        ? 'operator'
        : tokenBase(stream, state);
    },
  });
});
