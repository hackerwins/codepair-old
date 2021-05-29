import Board from 'components/Editor/DrawingBoard/Canvas/Board';
import { Root, Point, Shape } from 'features/docSlices';
import { ToolType } from 'features/boardSlices';
import { isInnerBox, cloneBox, isSelectable } from '../utils';
import Worker from './Worker';
import * as scheduler from '../scheduler';

class SelectorWorker extends Worker {
  type = ToolType.Selector;

  update: Function;

  board: Board;

  private selectedShape?: { shape: Shape; point: Point };

  constructor(update: Function, board: Board) {
    super();
    this.update = update;
    this.board = board;
  }

  mousedown(point: Point): void {
    const target = this.findTarget(point);

    if (target) {
      if (this.selectedShape) {
        this.resetSelectShape();
      }

      this.setSelectShape(target, point);
      this.setIsEditShape(target.getID());
      this.drawAll();
      return;
    }

    this.resetSelectShape();
    this.drawAll();
  }

  setSelectShape(target: Shape, point: Point) {
    this.selectedShape = {
      shape: target,
      point,
    };
  }

  resetSelectShape() {
    if (this.selectedShape) {
      this.unsetIsEditShape(this.selectedShape.shape.getID());
      this.selectedShape = undefined;
    }
  }

  mousemove(point: Point) {
    scheduler.reserveTask(point, (tasks: Array<scheduler.Task>) => {
      if (tasks.length < 2) {
        return;
      }

      this.update((root: Root) => {
        if (!this.selectedShape) {
          return;
        }

        const lastShape = root.shapes.getElementByID(this.selectedShape.shape.getID());
        if (!lastShape || lastShape.type !== 'rect') {
          return;
        }

        if (isSelectable(lastShape)) {
          const pointEnd = tasks[tasks.length - 1];
          const offsetY = pointEnd.y - this.selectedShape.point.y;
          const offsetX = pointEnd.x - this.selectedShape.point.x;
          this.selectedShape.point = pointEnd;

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
      });

      this.drawAll();
    });
  }

  mouseup() {
    this.flushTask();
  }

  destroy() {
    this.flushTask();

    if (this.selectedShape) {
      this.unsetIsEditShape(this.selectedShape!.shape.getID());
    }
  }

  flushTask() {
    scheduler.flushTask();
  }

  /**
   * 'findTarget' find the shape in the document.
   */
  findTarget(point: Point): Shape | undefined {
    let target;
    this.update((root: Root) => {
      for (const shape of root.shapes) {
        if (shape.type === 'rect' && isInnerBox(shape.box, point)) {
          target = shape;
          return;
        }
      }
    });
    return target;
  }
}

export default SelectorWorker;
