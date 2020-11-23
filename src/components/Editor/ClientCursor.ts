import invert from 'invert-color';

// REF https://github.com/FujitsuLaboratories/cattaz/blob/master/src/AppEnabledWikiEditorCodeMirror.jsx#L24
class ClientCursor {
  id: string;
  color: string;
  marker: CodeMirror.TextMarker | null;
  lineMarker: CodeMirror.TextMarker | null;

  constructor(id: string, color: string) {
    this.id = id;
    this.color = color;
    this.marker = null;
    this.lineMarker = null;
  }

  static of(id: string, color: string) {
    return new ClientCursor(id, color);
  }

  updateCursor(cm: CodeMirror.Editor, cursorPos: CodeMirror.Position) {
    this.removeCursor();
    const cursorCoords = cm.cursorCoords(cursorPos);
    const cursorElement = document.createElement('span');
    const size = cursorCoords.bottom - cursorCoords.top;

    cursorElement.style.position = 'absolute';
    cursorElement.style.borderLeftStyle = 'solid';
    cursorElement.style.borderLeftWidth = '2px';
    cursorElement.style.borderLeftColor = this.color;
    cursorElement.style.height = `${size}px`;
    cursorElement.style.padding = '0px';
    cursorElement.style.zIndex = '0';

    const nameElement = document.createElement('span');
    nameElement.textContent = this.id;
    nameElement.style.position = 'absolute';
    nameElement.style.top = `-${size}px`;
    nameElement.style.backgroundColor = this.color;
    nameElement.style.padding = '1px 4px';
    nameElement.style.borderRadius = '4px';
    nameElement.style.color = invert(this.color, true);
    nameElement.className = 'text-remove';

    cursorElement.appendChild(nameElement);

    this.marker = cm.setBookmark(cursorPos, {
      widget: cursorElement,
      insertLeft: true,
    });
  }

  updateLine(cm: CodeMirror.Editor, fromPos: CodeMirror.Position, toPos: CodeMirror.Position) {
    this.removeLine();
    this.lineMarker = cm.getDoc().markText(fromPos, toPos, {
      css: `background-color : ${this.color}; opacity:0.7`,
    });
  }

  removeCursor() {
    if (this.marker) {
      this.marker.clear();
      this.marker = null;
    }
  }

  removeLine() {
    if (this.lineMarker) {
      this.lineMarker.clear();
      this.lineMarker = null;
    }
  }
}

export default ClientCursor;
