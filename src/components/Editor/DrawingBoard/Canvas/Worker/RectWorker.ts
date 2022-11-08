import { TimeTicket } from 'yorkie-js-sdk';
import { Root, Point, Rect } from 'features/docSlices';
import { ToolType } from 'features/boardSlices';
import Board from 'components/Editor/DrawingBoard/Canvas/Board';
import { createRect, adjustRectBox } from '../rect';
import Worker, { MouseMoveCallback, MouseUpCallback, Options } from './Worker';
// import * as scheduler from '../scheduler';

class RectWorker extends Worker {
  type = ToolType.Rect;

  update: Function;

  board: Board;

  private createID?: TimeTicket;

  private previewRect: Omit<Rect, 'getID'>;

  constructor(update: Function, board: Board, options: Options) {
    super(options);
    this.update = update;
    this.board = board;
    this.previewRect = {
      type: 'rect',
      color: this.options!.color,
      box: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      },
      points: [],
    };
  }

  mousedown(point: Point): void {
    this.previewRect = createRect(point, this.options!);
  }

  mousemove(point: Point, callback: MouseMoveCallback) {
    const box = adjustRectBox(this.previewRect as Rect, point);
    this.previewRect.box = box;
    callback({ rect: { ...this.previewRect } });
  }

  mouseup(callback: MouseUpCallback) {
    this.flushTask();
    this.previewRect = { ...this.previewRect, box: { x: 0, y: 0, height: 0, width: 0 }, points: [] };
    callback({});
  }

  flushTask() {
    if (this.previewRect.box.width !== 0 && this.previewRect.box.height !== 0) {
      this.update((root: Root) => {
        root.shapes.push(this.previewRect as Rect);

        const lastShape = root.shapes.getLast();
        this.createID = lastShape.getID();
        this.board.drawAll(root.shapes);
      });
    }
  }
}

export default RectWorker;
