import { Root, Point, Shape } from 'features/docSlices';
import { ToolType } from 'features/boardSlices';
import Board from 'components/Editor/DrawingBoard/Canvas/Board';
import { isInnerBox, cloneBox, isSelectable, reverseIter } from '../utils';
import Worker from './Worker';
import * as scheduler from '../scheduler';

class SelectorWorker extends Worker {
  type = ToolType.Selector;

  update: Function;

  board: Board;

  private selectedShape?: { shape: Shape; point: Point; };

  constructor(update: Function, board: Board) {
    super();
    this.update = update;
    this.board = board;
  }

  mousedown(point: Point): void {
    const target = this.findTarget(point);
    if (target) {
      this.moveToFront(target);
      this.selectedShape = {
        shape: target,
        point,
      };
      return;
    }

    this.selectedShape = undefined;
  }

  mousemove(point: Point) {
    scheduler.reserveTask(point, (tasks: Array<scheduler.Task>) => {
      if (tasks.length < 2) {
        return;
      }

      this.update((root: Root) => {
        if (this.isEmptySelectedShape()) {
          return;
        }

        const lastShape = this.getElementByID(root, this.selectedShape!.shape.getID());
        if (!lastShape || lastShape.type !== 'rect') {
          return;
        }

        if (isSelectable(lastShape)) {
          const pointEnd = tasks[tasks.length - 1];
          const offsetY = pointEnd.y - this.selectedShape!.point.y;
          const offsetX = pointEnd.x - this.selectedShape!.point.x;
          this.selectedShape!.point = pointEnd;

          lastShape.box = {
            ...cloneBox(lastShape.box),
            y: lastShape.box.y + offsetY,
            x: lastShape.box.x + offsetX,
          };

          lastShape.points[0] = {
            y: lastShape.points[0].y + offsetY,
            x: lastShape.points[0].x + offsetX,
          };
        }
        this.board.drawAll(root.shapes);
      });
    });
  }

  mouseup() {
    this.flushTask();
  }

  flushTask() {
    scheduler.flushTask();
  }

  /**
   * Check if there is a selected shape.
   */
  isEmptySelectedShape() {
    return !this.selectedShape;
  }

  /**
   * findTarget find the shape in the document.
   */
  findTarget(point: Point): Shape | undefined {
    let target;
    this.update((root: Root) => {
      for (const shape of reverseIter(root.shapes)) {
        if (shape.type === 'rect' && isInnerBox(shape.box, point)) {
          target = shape;
          return;
        }
      }
    });
    return target;
  }

  /**
   * moveToFront move selected shape at the head
   */
  moveToFront(shape: Shape): void {
    this.update((root: Root) => {
      root.shapes.moveLast(shape.getID());
    });
  }
}

export default SelectorWorker;
