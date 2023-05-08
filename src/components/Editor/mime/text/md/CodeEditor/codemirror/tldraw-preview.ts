/* eslint-disable */
import CodeMirror from 'codemirror';

interface TldrawOptions {
  theme: string;
  emit: (event: string, message: any, trigger?: (event: string, message: any) => void) => void;
}

let idCounter = 0;

class TldrawPreview {
  cm: CodeMirror.Editor;
  options: TldrawOptions;
  widget: any;
  markers: any;
  constructor(cm: CodeMirror.Editor, options: TldrawOptions) {
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

    // this.emit('tldraw-preview-init', null);
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

    try {
      content = JSON.parse(range);
    } catch (e) {
      content = '';
    }

    return {
      currentLineNo,
      lastLineNo,
      id: target.closest('.inline-menu').id,
      content,
    };
  }

  onMousedown(cm: CodeMirror.Editor, evt: any) {
    var target = evt.target || evt.srcElement;
    if (target.className === 'tldraw-preview-edit') {
      evt.preventDefault();

      const info = this.getCodeInfo(evt);

      this.emit('tldraw-preview-click', info, (event: string, message: any) => {
        if (event === 'tldraw-preview-save') {
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
          '' + JSON.stringify(message.content) + '\n',
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

    if (tokens[0]?.string.trim() === '```tldraw') {
      const target = {
        line: lineNo,
        ch: 9,
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
    div.className = 'tldraw-preview inline-menu';
    div.id = `tldraw-id-${Date.now()}-${idCounter++}`;

    div.innerHTML = `
      <button type="button" class="tldraw-preview-edit">Edit</button>
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

  updateAllFold() {
    // fold tldraw code blocks
    const editor = this.cm;
    const last = editor.lineCount();
    for (let i = 0; i < last; i += 1) {
      if (editor.getLine(i).startsWith('```tldraw')) {
        editor.foldCode({ line: i, ch: 0 });
      }
    }
  }

  refreshFold() {
    this.updateAllFold();
  }
}

(CodeMirror as any).defineOption('tldraw', false, function (cm: CodeMirror.Editor, options: TldrawOptions) {
  if (options) {
    cm.state.tldrawView = new TldrawPreview(cm, options);
  }
});

(CodeMirror as any).defineExtension('foldTldrawCode', function (this: { state: { tldrawView: TldrawPreview } }) {
  if (this.state.tldrawView) {
    this.state.tldrawView.refreshFold();
  }
});
