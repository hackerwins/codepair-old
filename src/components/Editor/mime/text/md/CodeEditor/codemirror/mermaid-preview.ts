/* eslint-disable */
import CodeMirror from 'codemirror';

let idCounter = 0;

interface MermaidOptions {
  theme: string;
  emit: (event: string, message: any, trigger?: (event: string, message: any) => void) => void;
}

class MermaidPreview {
  cm: CodeMirror.Editor;
  val: any;
  widget: any;
  markers: any;
  options: MermaidOptions;
  constructor(cm: CodeMirror.Editor, options: MermaidOptions) {
    this.cm = cm;
    this.options = options;
    this.widget = null;
    this.markers = {};

    this.initEvent();
  }

  emit(event: string, message: any, trigger?: (event: string, message: any) => void) {
    this.options.emit(event, message, trigger);
  }

  initEvent() {
    this.cm.on('mousedown', this.onMousedown.bind(this));
    this.cm.on('change', this.change.bind(this));
    this.cm.on('refresh', this.refresh.bind(this));

    // this.emit('mermaid-preview-init', null);
  }

  getCodeInfo(evt: any) {
    var target = evt.target || evt.srcElement;
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

    const range = this.cm.getRange({ line: currentLineNo + 1, ch: 0 }, { line: lastLineNo, ch: 0 });

    let content: any = range;

    return {
      currentLineNo,
      lastLineNo,
      id: target.closest('.inline-menu').id,
      content,
    };
  }

  onMousedown(cm: CodeMirror.Editor, evt: any) {
    var target = evt.target || evt.srcElement;
    if (target.className === 'mermaid-preview-edit') {
      evt.preventDefault();

      const info = this.getCodeInfo(evt);

      this.emit('mermaid-preview-click', info, (event: string, message: any) => {
        if (event === 'mermaid-preview-save') {
          this.updateDraw(message);
        }
      });
    } else if (target.className === 'mermaid-preview-menu') {
      evt.preventDefault();

      const info = this.getCodeInfo(evt);

      this.emit('mermaid-preview-menu-click', info, (event: string, message: any) => {
        if (event === 'mermaid-preview-save') {
          this.updateDraw(message);
        }
      });
    }
  }

  updateDraw(message: any) {
    const currentMark = this.cm.getAllMarks().find((mark: any) => {
      return mark.replacedWith.id === message.id;
    });

    if (currentMark) {
      const currentLineNo = (currentMark as any).lines[0].lineNo();
      const totalLineNo = this.cm.lineCount();
      let lastLineNo = totalLineNo - 1;

      // if current line is last line, then insert new line
      for (var i = currentLineNo + 1; i < totalLineNo; i++) {
        if (this.cm.getLine(i).startsWith('```')) {
          lastLineNo = i;
          break;
        }
      }

      this.cm.operation(() => {
        this.cm.replaceRange(
          `${message.content.trim()}\n`,
          { line: currentLineNo + 1, ch: 0 },
          { line: lastLineNo, ch: 0 },
        );

        this.cm.foldCode({ line: currentLineNo, ch: 0 });
      });
    }
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

    if (tokens[0]?.string.startsWith('```mermaid')) {
      const target = {
        line: lineNo,
        ch: 10,
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
    div.className = 'mermaid-preview inline-menu';
    // div.innerHTML = content;
    div.id = `mermaid-id-${Date.now()}-${idCounter++}`;

    div.innerHTML = `
      <button type="button" class="mermaid-preview-edit">Edit</button>
      <button type="button" class="mermaid-preview-menu">&#9662;</button>
    `;

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

(CodeMirror as any).defineOption('mermaid', false, function (cm: CodeMirror.Editor, options: MermaidOptions) {
  if (options) {
    cm.state.mermaidView = new MermaidPreview(cm, options);
  }
});

const MERMAID_REGEX = {
  TAG_REGEX: /^(\[[^\]]+\]|\{[^\}]+\}|\([^\)]+\))/,
  STRING_REGEX: /^("[^"]+")/,
  PIPE_REGEX: /^(\|[^\|]+\|)/,
  KEYWORD_REGEX:
    /^(flowchart|timeline|graph|sequenceDiagram|gantt|erDiagram|classDiagram|node|edge|classDef|journey|mindmap)|($|\s)/,
  KEYWORD_REGEX_2:
    /^(def|for|box|actor|participant|activate|deactivate|over|loop|end|subgraph|class|style|classDef|Note|alt|opt|par|critical|option|break|rect|right of)/i,
  KEYWORD_REGEX_3: /^(title|dateFormat|excludes|section|Completed|Active|Future)/i,
  OPERATOR_REGEX: /^(-+>|->|->>|--)/,
  BRACKET_REGEX: /^(\(|\))/,
  NUMBER_REGEX: /^(\d+)/,
  PROPERTY_REGEX: /^\w+:/,
  COMMENT_REGEX: /^%%.*/,
  ATOM_REGEX: /^([^\s]+)/,
  PUNCTUATION_REGEX: /^(\.|,|:|;)/,
  SPACE_REGEX: /^(\s+)/,
};

CodeMirror.defineMode('mermaid', function (config, parserConfig) {
  var mermaidMode = CodeMirror.getMode(config, 'text/plain');
  var keywords = parserConfig.keywords || {};
  var operators = parserConfig.operators || {};

  function tokenBase(stream: CodeMirror.StringStream, state: unknown): string | null {
    if (stream.match(MERMAID_REGEX.TAG_REGEX)) {
      return 'tag';
    }
    if (stream.match(MERMAID_REGEX.STRING_REGEX)) {
      return 'string';
    }

    if (stream.match(MERMAID_REGEX.PIPE_REGEX)) {
      return 'string-2';
    }

    if (stream.match(MERMAID_REGEX.KEYWORD_REGEX)) {
      return 'keyword';
    }
    if (stream.match(MERMAID_REGEX.KEYWORD_REGEX_2)) {
      return 'keyword';
    }
    if (stream.match(MERMAID_REGEX.KEYWORD_REGEX_3)) {
      return 'keyword';
    }
    // if (stream.match(/^([+\-]([^ \(\)]+))/i)) {
    //   return 'property';
    // }
    if (stream.match(MERMAID_REGEX.OPERATOR_REGEX)) {
      return 'operator';
    }
    if (stream.match(MERMAID_REGEX.NUMBER_REGEX)) {
      return 'number';
    }
    if (stream.match(MERMAID_REGEX.PROPERTY_REGEX)) {
      return 'property';
    }
    if (stream.match(/^\w+/)) {
      return 'word';
    }
    if (stream.match(MERMAID_REGEX.COMMENT_REGEX)) {
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
