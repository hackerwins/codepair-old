/* eslint-disable */
import CodeMirror from 'codemirror';
class MermaidPreview {
  cm: CodeMirror.Editor;
  val: any;
  widget: any;
  markers: any;
  constructor(cm: CodeMirror.Editor, val: boolean) {
    this.cm = cm;
    this.val = val;
    this.widget = null;
    this.markers = {};

    this.initEvent();
  }

  initEvent() {
    this.cm.on('mousedown', this.onMousedown.bind(this));
    this.cm.on('change', this.change.bind(this));
    this.cm.on('refresh', this.refresh.bind(this));
  }

  onMousedown(cm: CodeMirror.Editor, evt: any) {
    var target = evt.target || evt.srcElement;
    if (target.className === 'mermaid-preview') {
      evt.preventDefault();
      var pos = this.cm.coordsChar({ left: evt.clientX, top: evt.clientY });

      // Find any markers at the clicked position
      var marks = this.cm.findMarksAt(pos);

      const currentLineNo = (marks[0] as any).lines[0].lineNo();
      const totalLineNo = this.cm.lineCount();
      let lastLineNo = totalLineNo - 1;

      // if current line is last line, then insert new line
      for (var i = currentLineNo + 1; i < totalLineNo; i++) {
        if (this.cm.getLine(i).startsWith('```')) {
          lastLineNo = i;
          break;
        }
      }

      // how to show mermaid sample list ?
      this.showMermaidSampleList(currentLineNo, lastLineNo);
    } else {
      document.querySelector('.mermaid-sample-list')?.remove();
    }
  }

  showMermaidSampleList(currentLineNo: number, lastLineNo: number) {
    // TODO: show mermaid sample list with sidebar
    const mermaidSampleList = [
      'flowchart TD\n\tA[Christmas] -->|Get money| B(Go shopping)\n\tB --> C{Let me think}\n\tC -->|One| D[Laptop]\n\tC -->|Two| E[iPhone]\n\tC -->|Three| F[fa:fa-car Car]',
      'sequenceDiagram\n\tAlice->>John: Hello John, how are you?\n\tJohn-->>Alice: Great!',
      'gantt\n\ttitle A Gantt Diagram\n\tsection Section\n\tA task           :a1, 2014-01-01, 30d\n\tAnother task     :after a1  , 20d\n\tsection Another\n\tTask in sec      :2014-01-12  , 12d\n\tanther task      : 24d',
    ];

    const sidebarDiv = document.createElement('div');
    sidebarDiv.className = 'mermaid-sample-list';
    sidebarDiv.style.position = 'absolute';
    sidebarDiv.style.top = '0';
    sidebarDiv.style.left = '0';
    sidebarDiv.style.width = '300px';
    sidebarDiv.style.height = '100%';
    sidebarDiv.style.backgroundColor = '#fff';
    sidebarDiv.style.zIndex = '9999';

    const ul = document.createElement('ul');
    ul.style.listStyle = 'none';
    ul.style.padding = '0';
    ul.style.margin = '0';

    mermaidSampleList.forEach((mermaidSample) => {
      const li = document.createElement('li');
      li.style.padding = '10px';
      li.style.borderBottom = '1px solid #eee';
      li.style.cursor = 'pointer';
      li.innerHTML = `<pre>${mermaidSample}</pre>`;
      li.style.backgroundColor = '#ececec';
      li.style.color = '#333';

      li.addEventListener('click', () => {
        this.cm.operation(() => {
          this.cm.replaceRange(
            '' + mermaidSample + '\n',
            { line: currentLineNo + 1, ch: 0 },
            { line: lastLineNo, ch: 0 },
          );
        });

        sidebarDiv.remove();
      });

      ul.appendChild(li);
    });

    sidebarDiv.appendChild(ul);

    document.body.appendChild(sidebarDiv);
  }

  change(cm: CodeMirror.Editor, evt: any) {
    this.updateAll();
  }

  refresh() {
    this.change(this.cm, { origin: 'setValue' });
  }

  updateAll() {
    this.cm.operation(() => {
      var max = this.cm.lineCount();
      for (var lineNo = 0; lineNo < max; lineNo++) {
        this.match(lineNo);
      }
    });
  }

  match(lineNo: number) {
    let lastLineNo = lineNo;

    const tokens = this.cm.getLineTokens(lineNo);

    if (tokens[0]?.string === '```mermaid') {
      const target = {
        line: lineNo,
        ch: tokens[0]?.end,
      };

      const markers = this.cm.findMarksAt(target);

      if (!markers.length) {
        const el = this.create_marker(target.line, target.ch);

        this.set_mark(target.line, target.ch, el);
      }
    } else {
      //   this.empty_marker(lineNo);
    }
  }

  make_element() {
    const div = document.createElement('div');
    div.className = 'mermaid-preview';
    // div.innerHTML = content;
    div.style.display = 'inline-block';
    div.style.position = 'relative';
    div.style.verticalAlign = 'middle';
    div.textContent = 'M';
    div.style.backgroundColor = 'yellow';
    div.style.width = '1em';
    div.style.height = '1em';
    div.style.borderRadius = '4px';
    div.style.textAlign = 'center';
    div.style.lineHeight = '1em';
    div.style.fontSize = '0.8em';
    div.style.fontWeight = 'bold';
    div.style.color = 'black';
    div.style.cursor = 'pointer';
    div.style.marginLeft = '0.5em';

    return div;
  }

  key(lineNo: number, ch: number) {
    return [lineNo, ch].join(':');
  }

  init() {
    this.markers = {}; // initialize marker list
  }

  addMarker(div: HTMLElement, lineNo: number, ch: number) {
    this.markers[this.key(lineNo, ch)] = div;
  }

  //   empty_marker(lineNo: number) {
  //     var lineHandle = this.cm.getLineHandle(lineNo);

  //     const ch = lineHandle.text.length;

  //     var list = this.cm.findMarks({ line: lineNo, ch: 0 }, { line: lineNo, ch: 100 }) || [];

  //     for (var i = 0, len = list.length; i < len; i++) {
  //       var key = this.key(lineNo, list[i].from);

  //       if (key) {
  //         delete this.markers[key];
  //         list[i].marker.clear();
  //       }
  //     }
  //   }

  set_state(lineNo: number, start: number) {
    var marker = this.create_marker(lineNo, start);

    marker.lineNo = lineNo;
    marker.ch = start;

    return marker;
  }

  create_marker(lineNo: number, start: number) {
    if (!this.has_marker(lineNo, start)) {
      this.init_marker(lineNo, start);
    }

    return this.get_marker(lineNo, start);
  }

  init_marker(lineNo: number, start: number) {
    this.markers[this.key(lineNo, start)] = this.make_element();
  }

  has_marker(lineNo: number, start: number) {
    return !!this.get_marker(lineNo, start);
  }

  get_marker(lineNo: number, start: number) {
    var key = this.key(lineNo, start);
    return this.markers[key];
  }

  set_mark(line: number, ch: number, el: HTMLElement) {
    const marker = this.cm.setBookmark({ line: line, ch: ch }, { widget: el, handleMouseEvents: true });
    (el as any).marker = marker;
  }
}

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

    if (stream.match(/^(flowchart|sequenceDiagram|gantt|classDiagram|node|edge|classDef)|($|\s)/)) {
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
