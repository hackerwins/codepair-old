import invert from 'invert-color';

type actorId = string; // used in yorkie-sdk-js client
type nameRemoveTimerID = ReturnType<typeof setTimeout>;

// REF https://github.com/FujitsuLaboratories/cattaz/blob/master/src/AppEnabledWikiEditorCodeMirror.jsx#L24
class ClientCursor {
  id: actorId;
  color: string;
  height: number;

  marker: CodeMirror.TextMarker | null;
  lineMarker: CodeMirror.TextMarker | null;

  // Values to display the name on the cursor.
  nameRemoveTimeMap: Map<actorId, nameRemoveTimerID>;
  nameAnimationDelay: number;
  nameAnimationDuration: number;
  nameRemoveTime: number;

  constructor(id: actorId, color: string) {
    this.id = id;
    this.color = color;
    this.height = 0;
    this.marker = null;
    this.lineMarker = null;

    this.nameRemoveTimeMap = new Map();
    this.nameAnimationDelay = 1;
    this.nameAnimationDuration = 0.2;
    this.nameRemoveTime = (this.nameAnimationDuration + this.nameAnimationDelay) * 1000;
  }

  updateCursor(cm: CodeMirror.Editor, cursorPos: CodeMirror.Position) {
    this.removeCursor();
    const cursorCoords = cm.cursorCoords(cursorPos);
    const cursorEl = document.createElement('span');
    this.height = cursorCoords.bottom - cursorCoords.top;

    cursorEl.style.position = 'absolute';
    cursorEl.style.borderLeftStyle = 'solid';
    cursorEl.style.borderLeftWidth = '2.5px';
    cursorEl.style.borderLeftColor = this.color;
    cursorEl.style.height = `${this.height}px`;
    cursorEl.style.padding = '0px';

    this.marker = cm.setBookmark(cursorPos, {
      widget: cursorEl,
      insertLeft: true,
    });

    this.showCursorNameReserve(cursorEl);
  }

  updateLine(cm: CodeMirror.Editor, fromPos: CodeMirror.Position, toPos: CodeMirror.Position) {
    this.removeLine();

    this.lineMarker = cm.getDoc().markText(fromPos, toPos, {
      css: `background-color : ${this.color}; opacity:0.7`,
    });
  }

  // when user's cursor hover, show name
  private showCursorNameReserve(cursorEl: Element) {
    const nameEl = document.createElement('span');

    cursorEl.addEventListener('mouseenter', () => {
      if (this.nameRemoveTimeMap.has(this.id)) {
        clearTimeout(this.nameRemoveTimeMap.get(this.id)!);
      }

      nameEl.style.position = 'absolute';
      nameEl.textContent = this.id;
      nameEl.style.top = `-${this.height}px`;
      nameEl.style.left = '-2px';
      nameEl.style.backgroundColor = this.color;
      nameEl.style.padding = '1px 4px';
      nameEl.style.borderRadius = '4px 4px 4px 0px';
      nameEl.style.color = invert(this.color, true);

      /**
       * nameEl is being reused.
       * In order to keep the name visible while the mouse is hovering,
       * It need to delete the css class containing animation when it is mouseenter and add it when it is mouseleave.
       */
      nameEl.classList.remove('text-remove');
      cursorEl.appendChild(nameEl);
    });

    cursorEl.addEventListener('mouseleave', () => {
      nameEl.className = 'text-remove';
      nameEl.style.animationDuration = `${this.nameAnimationDuration}s`;
      nameEl.style.animationDelay = `${this.nameAnimationDelay}s`;

      this.removeNameReserve(nameEl);
    });
  }

  // After animate, It should actually be deleted it.
  private removeNameReserve(nameEl: HTMLSpanElement) {
    const timeoutId = setTimeout(() => {
      nameEl.parentNode!.removeChild(nameEl);
      this.nameRemoveTimeMap.delete(this.id);
    }, this.nameRemoveTime);

    this.nameRemoveTimeMap.set(this.id, timeoutId);
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
