import { ActorID } from 'yorkie-js-sdk';
import invert from 'invert-color';
import { Presence } from 'features/peerSlices';

enum CursorStatus {
  Deactivated = 'deactivated',
  Activated = 'activated',
}

// REF https://github.com/FujitsuLaboratories/cattaz/blob/master/src/AppEnabledWikiEditorCodeMirror.jsx#L24
export default class Cursor {
  private id: ActorID;

  private username: string;

  private color: string;

  private height: number;

  private marker?: CodeMirror.TextMarker;

  private lineMarker?: CodeMirror.TextMarker;

  private status: CursorStatus;

  private nameRemoveTimeMap: Map<ActorID, ReturnType<typeof setTimeout>>;

  private nameAnimationDelay: number;

  private nameAnimationDuration: number;

  private nameRemoveTime: number;

  private nameHolder?: HTMLSpanElement;

  private cursorHolder?: HTMLSpanElement;

  constructor(id: ActorID, presence: Presence) {
    this.id = id;
    this.username = presence.username;
    this.color = presence.color;
    this.height = 0;
    this.status = CursorStatus.Deactivated;

    this.nameRemoveTimeMap = new Map();
    this.nameAnimationDelay = 1;
    this.nameAnimationDuration = 0.2;
    this.nameRemoveTime = (this.nameAnimationDuration + this.nameAnimationDelay) * 1000;
  }

  updateCursor(cm: CodeMirror.Editor, cursorPos: CodeMirror.Position) {
    this.removeCursor();
    this.status = CursorStatus.Activated;
    const cursorCoords = cm.cursorCoords(cursorPos);
    this.height = cursorCoords.bottom - cursorCoords.top;

    if (!this.cursorHolder) {
      this.cursorHolder = document.createElement('span');
      this.cursorHolder.classList.add('codePair-cursor');
      this.cursorHolder.style.borderLeftColor = this.color;
      this.cursorHolder.addEventListener('mouseenter', () => {
        if (this.nameRemoveTimeMap.has(this.id)) {
          clearTimeout(this.nameRemoveTimeMap.get(this.id)!);
        }

        if (this.nameHolder) {
          /**
           * nameEl is being reused.
           * In order to keep the name visible while the mouse is hovering,
           * It need to delete the css class containing animation when it is mouseenter and add it when it is mouseleave.
           */
          this.nameHolder.classList.remove('text-remove');
          this.cursorHolder?.appendChild(this.nameHolder);
        }
      });

      this.cursorHolder.addEventListener('mouseleave', () => {
        if (this.nameHolder) {
          this.nameHolder.classList.add('text-remove');
          this.nameHolder.style.animationDuration = `${this.nameAnimationDuration}s`;
          this.nameHolder.style.animationDelay = `${this.nameAnimationDelay}s`;
        }
      });

      this.nameHolder?.addEventListener('animationend', () => {
        if (this.nameHolder?.classList.contains('text-remove')) {
          this.nameRemoveTimeMap.delete(this.id);
        }
      });
    }

    this.cursorHolder.style.height = `${this.height}px`;
    this.cursorHolder.setAttribute('data-pos', cursorCoords.top < 130 ? 'top' : 'bottom');
    this.marker = cm.setBookmark(cursorPos, {
      widget: this.cursorHolder,
      insertLeft: true,
    });

    this.showCursorNameReserve(this.cursorHolder);
  }

  updateLine(cm: CodeMirror.Editor, fromPos: CodeMirror.Position, toPos: CodeMirror.Position) {
    this.removeLine();
    this.status = CursorStatus.Activated;
    // Apply transparency to the background of selection.
    const redColor = parseInt(this.color.slice(1, 3), 16);
    const greenColor = parseInt(this.color.slice(3, 5), 16);
    const blueColor = parseInt(this.color.slice(5, 7), 16);
    const backgroundColor = `rgba(${redColor}, ${greenColor}, ${blueColor}, 0.15)`;

    this.lineMarker = cm.getDoc().markText(fromPos, toPos, {
      css: `background-color : ${backgroundColor};`,
    });
  }

  // when user's cursor hover, show name
  private showCursorNameReserve(cursorHolder: Element) {
    if (!this.nameHolder) {
      this.nameHolder = document.createElement('span');
      this.nameHolder.classList.add('codePair-name');
      this.nameHolder.textContent = this.username;
      this.nameHolder.style.backgroundColor = this.color;
      this.nameHolder.style.color = invert(this.color, true);
    }

    if (this.nameHolder.parentElement !== cursorHolder) {
      cursorHolder.appendChild(this.nameHolder);
    }

    // 커서가 변경 되었을 때는 항상 표시
    this.nameHolder.classList.remove('text-remove');
    this.resetRemoveNameReserve(this.nameHolder);
  }

  private resetRemoveNameReserve(nameHolder?: HTMLSpanElement) {
    if (this.nameRemoveTimeMap.has(this.id)) {
      clearTimeout(this.nameRemoveTimeMap.get(this.id)!);
    }

    this.removeNameReserve(nameHolder);
  }

  // After animate, It should actually be deleted it.
  private removeNameReserve(nameHolder?: HTMLSpanElement) {
    const timeoutId = setTimeout(() => {
      if (nameHolder) {
        nameHolder.classList.add('text-remove');
        const { style } = nameHolder;
        style.animationDuration = `${this.nameAnimationDuration}s`;
        style.animationDelay = `${this.nameAnimationDelay}s`;
      }
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

  clear() {
    this.removeCursor();
    this.removeLine();
  }

  isActive() {
    return this.status === CursorStatus.Activated;
  }
}
