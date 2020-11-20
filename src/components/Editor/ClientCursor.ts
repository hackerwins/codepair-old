// REF https://github.com/FujitsuLaboratories/cattaz/blob/master/src/AppEnabledWikiEditorCodeMirror.jsx#L24
class ClientCursor {
  id: string;
  color: string;
  marker: any;

  constructor(id: string, color: string) {
    this.id = id;
    this.color = color;
  }

  static of(id: string, color: string) {
    return new ClientCursor(id, color);
  }

  updateCursor(cursorPos: number, cm: any) {
    this.removeCursor();
    const cursorCoords = cm.cursorCoords(cursorPos);
    const cursorElement = document.createElement('span');
    cursorElement.style.borderLeftStyle = 'solid';
    cursorElement.style.borderLeftWidth = '2.5px';
    cursorElement.style.borderLeftColor = this.color;
    cursorElement.style.height = `${cursorCoords.bottom - cursorCoords.top}px`;
    cursorElement.style.padding = '0px';
    cursorElement.style.zIndex = '0';
    const pos = cm.posFromIndex(cursorPos);

    this.marker = cm.setBookmark(pos, {
      widget: cursorElement,
      insertLeft: true,
    });
  }

  removeCursor() {
    if (this.marker) {
      this.marker.clear();
      this.marker = null;
    }
  }
}

export default ClientCursor;
