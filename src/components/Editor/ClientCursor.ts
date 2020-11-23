import invert from 'invert-color';

// REF https://github.com/FujitsuLaboratories/cattaz/blob/master/src/AppEnabledWikiEditorCodeMirror.jsx#L24
class ClientCursor {
  id: string;
  color: string;
  marker: any;
  lineMarker: any;

  constructor(id: string, color: string) {
    this.id = id;
    this.color = color;
  }

  static of(id: string, color: string) {
    return new ClientCursor(id, color);
  }

  updateCursor(cm: any, cursorPos: number) {
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

    const pos = cm.posFromIndex(cursorPos);
    this.marker = cm.setBookmark(pos, {
      widget: cursorElement,
      insertLeft: true,
    });
  }

  updateLine(cm: any, fromIdx: number, toIdx: number) {
    this.removeLine();
    this.lineMarker = cm.getDoc().markText(fromIdx, toIdx, {
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
