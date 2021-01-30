import invert from 'invert-color';

// TODO(hackerwins): Replace with ActorID from yorkie-js-sdk
type ActorID = string;

// REF https://github.com/FujitsuLaboratories/cattaz/blob/master/src/AppEnabledWikiEditorCodeMirror.jsx#L24
export default class Cursor {
  private id: ActorID;

  private color: string;

  private height: number;

  private marker?: CodeMirror.TextMarker;

  private lineMarker?: CodeMirror.TextMarker;

  private nameRemoveTimeMap: Map<ActorID, ReturnType<typeof setTimeout>>;

  private nameAnimationDelay: number;

  private nameAnimationDuration: number;

  private nameRemoveTime: number;

  constructor(id: ActorID, color: string) {
    this.id = id;
    this.color = color;
    this.height = 0;

    this.nameRemoveTimeMap = new Map();
    this.nameAnimationDelay = 1;
    this.nameAnimationDuration = 0.2;
    this.nameRemoveTime = (this.nameAnimationDuration + this.nameAnimationDelay) * 1000;
  }

  updateCursor(cm: CodeMirror.Editor, cursorPos: CodeMirror.Position) {
    this.removeCursor();
    const cursorCoords = cm.cursorCoords(cursorPos);
    const cursorHolder = document.createElement('span');
    this.height = cursorCoords.bottom - cursorCoords.top;

    cursorHolder.classList.add('codePair-cursor');
    cursorHolder.style.borderLeftColor = this.color;
    cursorHolder.style.height = `${this.height}px`;

    this.marker = cm.setBookmark(cursorPos, {
      widget: cursorHolder,
      insertLeft: true,
    });

    this.showCursorNameReserve(cursorHolder);
  }

  updateLine(cm: CodeMirror.Editor, fromPos: CodeMirror.Position, toPos: CodeMirror.Position) {
    this.removeLine();

    this.lineMarker = cm.getDoc().markText(fromPos, toPos, {
      css: `background-color : ${this.color}; opacity:0.7`,
    });
  }

  // when user's cursor hover, show name
  private showCursorNameReserve(cursorHolder: Element) {
    const nameHolder = document.createElement('span');
    nameHolder.classList.add('codePair-name');

    cursorHolder.addEventListener('mouseenter', () => {
      if (this.nameRemoveTimeMap.has(this.id)) {
        clearTimeout(this.nameRemoveTimeMap.get(this.id)!);
      }

      nameHolder.textContent = this.id;
      nameHolder.style.top = `-${this.height}px`;
      nameHolder.style.backgroundColor = this.color;
      nameHolder.style.color = invert(this.color, true);

      /**
       * nameEl is being reused.
       * In order to keep the name visible while the mouse is hovering,
       * It need to delete the css class containing animation when it is mouseenter and add it when it is mouseleave.
       */
      nameHolder.classList.remove('text-remove');
      cursorHolder.appendChild(nameHolder);
    });

    cursorHolder.addEventListener('mouseleave', () => {
      nameHolder.classList.add('text-remove');
      nameHolder.style.animationDuration = `${this.nameAnimationDuration}s`;
      nameHolder.style.animationDelay = `${this.nameAnimationDelay}s`;

      this.removeNameReserve(nameHolder);
    });
  }

  // After animate, It should actually be deleted it.
  private removeNameReserve(nameHolder: HTMLSpanElement) {
    const timeoutId = setTimeout(() => {
      nameHolder.parentNode!.removeChild(nameHolder);
      this.nameRemoveTimeMap.delete(this.id);
    }, this.nameRemoveTime);

    this.nameRemoveTimeMap.set(this.id, timeoutId);
  }

  removeCursor() {
    if (this.marker) {
      this.marker.clear();
      this.marker = undefined;
    }
  }

  removeLine() {
    if (this.lineMarker) {
      this.lineMarker.clear();
      this.lineMarker = undefined;
    }
  }
}

