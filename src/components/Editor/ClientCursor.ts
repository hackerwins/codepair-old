import invert from 'invert-color';

const markerRemoveMap = new Map<string, number>();

const duration = 0.2;
const delay = 1;
const SECOND = 1000;
const REMOVE_TIME = (duration + delay) * SECOND;

// REF https://github.com/FujitsuLaboratories/cattaz/blob/master/src/AppEnabledWikiEditorCodeMirror.jsx#L24
class ClientCursor {
  id: string; // actor id
  color: string;
  height: number;
  marker: CodeMirror.TextMarker | null;
  lineMarker: CodeMirror.TextMarker | null;

  constructor(id: string, color: string) {
    this.id = id;
    this.color = color;
    this.height = 0;
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
    this.height = cursorCoords.bottom - cursorCoords.top;

    cursorElement.style.position = 'absolute';
    cursorElement.style.borderLeftStyle = 'solid';
    cursorElement.style.borderLeftWidth = '2.5px';
    cursorElement.style.borderLeftColor = this.color;
    cursorElement.style.height = `${this.height}px`;
    cursorElement.style.padding = '0px';

    this.showCursorNameReserve(cursorElement);
    this.marker = cm.setBookmark(cursorPos, {
      widget: cursorElement,
      insertLeft: true,
    });
  }

  updateLine(
    cm: CodeMirror.Editor,
    fromPos: CodeMirror.Position,
    toPos: CodeMirror.Position,
  ) {
    this.removeLine();
    this.lineMarker = cm.getDoc().markText(fromPos, toPos, {
      css: `background-color : ${this.color}; opacity:0.7`,
    });
  }

  // when user's cursor hover, show name
  showCursorNameReserve(parentEl: Element) {
    const nameElement = document.createElement('span');

    parentEl.addEventListener('mouseenter', () => {
      nameElement.textContent = this.id;
      nameElement.classList.remove('text-remove');
      nameElement.style.position = 'absolute';
      nameElement.style.top = `-${this.height}px`;
      nameElement.style.left = '-2px';
      nameElement.style.backgroundColor = this.color;
      nameElement.style.padding = '1px 4px';
      nameElement.style.borderRadius = '4px 4px 4px 0px';
      nameElement.style.color = invert(this.color, true);

      parentEl.appendChild(nameElement);
    });

    parentEl.addEventListener('mouseleave', () => {
      nameElement.className = 'text-remove';
      nameElement.style.animationDuration = `${duration}s`;
      nameElement.style.animationDelay = `${delay}s`;

      this.removeNameReserve(nameElement);
    });
  }

  // After animate, It should actually be deleted it.
  removeNameReserve(el: Element) {
    if (markerRemoveMap.has(this.id)) {
      clearTimeout(markerRemoveMap.get(this.id));
    }

    const timeoutId = window.setTimeout(() => {
      if (el.parentNode) {
        el.parentNode.removeChild(el);
        markerRemoveMap.delete(this.id);
      }
    }, REMOVE_TIME);

    markerRemoveMap.set(this.id, timeoutId);
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
