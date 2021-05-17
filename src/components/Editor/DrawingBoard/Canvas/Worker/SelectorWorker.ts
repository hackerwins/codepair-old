import { Root, Point, Shape } from 'features/docSlices';
import { ToolType } from 'features/boardSlices';
import { isInnerBox, cloneBox, isSelectable } from '../utils';
import Worker from './Worker';
import * as scheduler from '../scheduler';

class SelectorWorker implements Worker {
  type = ToolType.Selector;

  private update: Function;

  private emit: Function;

  private selectedShape?: { shape: Shape; point: Point };

  constructor(update: Function, emit: Function) {
    this.update = update;
    this.emit = emit;
  }

  mousedown(point: Point): void {
    const target = this.findTarget(point);
    if (target) {
      this.selectedShape = {
        shape: target,
        point,
      };
      return;
    }

    this.selectedShape = undefined;
  }

  mousemove(p: Point) {
    scheduler.reserveTask(p, (tasks: Array<scheduler.Task>) => {
      if (tasks.length < 2) {
        return;
      }

      this.update((root: Root) => {
        if (this.isEmptySelectedShape()) {
          return;
        }

        const lastShape = root.shapes.getElementByID(this.selectedShape!.shape.getID());
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
        this.emit('renderAll', root.shapes);
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
   * Find the shape in the document.
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
