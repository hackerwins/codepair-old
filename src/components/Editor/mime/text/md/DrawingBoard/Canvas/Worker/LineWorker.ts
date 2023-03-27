import { TimeTicket } from 'yorkie-js-sdk';
import { Root, Point, Line } from 'features/docSlices';
import { ToolType } from 'features/boardSlices';
import Board from 'components/Editor/mime/text/md/DrawingBoard/Canvas/Board';
import { createLine } from '../line';
import Worker, { MouseMoveCallback, MouseUpCallback, UpdateCallback, Options } from './Worker';
import { compressPoints } from '../utils';

class LineWorker extends Worker {
  type = ToolType.Line;

  update: (callback: UpdateCallback) => void;

  board: Board;

  private createID?: TimeTicket;

  private previewLine: Omit<Line, 'getID'>;

  constructor(update: (callback: UpdateCallback) => void, board: Board, options: Options) {
    super(options);
    this.update = update;
    this.board = board;
    this.previewLine = {
      type: 'line',
      color: this.options!.color,
      points: [],
    };
  }

  mousedown(point: Point): void {
    this.previewLine = createLine(point, this.options?.color!);
  }

  mousemove(point: Point, callback: MouseMoveCallback) {
    this.previewLine.points.push(point);
    callback({ line: { ...this.previewLine } });
  }

  mouseup(callback: MouseUpCallback) {
    this.flushTask();
    this.previewLine = { ...this.previewLine, points: [] };
    callback({});
  }

  flushTask() {
    if (this.previewLine.points.length > 0) {
      this.update((root: Root) => {
        this.previewLine.points = compressPoints(this.previewLine.points);
        root.shapes.push(this.previewLine as Line);

        const lastShape = root.shapes.getLast();
        this.createID = lastShape.getID();
        this.board.drawAll(root.shapes);
      });
    }
  }
}

export default LineWorker;
