import { TimeTicket } from 'yorkie-js-sdk';

import { Tool } from 'features/boardSlices';
import { Root, Shape, Point, Line, Rect } from 'features/docSlices';

import { compressPoints, checkLineIntersection, isInnerBox, cloneBox } from './utils';
import { LineOption, createLine, createEraserLine, fixEraserPoint } from './line';
import { createRect, adjustRectBox } from './rect';
import * as scheduler from './scheduler';

type ShapeOption = LineOption;

export default class Worker {
  private update: Function;

  private emit: Function;

  private tool: Tool = Tool.Line;

  private selectedShape?: { shape: Shape; point: Point; };

  private createId?: TimeTicket;

  constructor(update: Function, emit: Function) {
    this.update = update;
    this.emit = emit;
  }

  mousedown(p: Point, options: ShapeOption): void {
    if (this.tool === Tool.Selector) {
      const target = this.findTarget(p);
      if (target) {
        this.selectedShape = {
          shape: target,
          point: p,
        };
        return;
      }

      this.selectedShape = undefined;
      return;
    }

    if (this.tool === Tool.Line || this.tool === Tool.Eraser || this.tool === Tool.Rect) {
      this.createId = this.createShape(p, options);
    }
  }

  mousemove(p: Point) {
    scheduler.reserveTask(p, (tasks: Array<scheduler.Task>) => {
      const points = compressPoints(tasks);

      if (tasks.length < 2) {
        return;
      }

      this.update((root: Root) => {
        if (this.tool === Tool.Line) {
          const lastShape = root.shapes.getElementByID(this.createId!) as Line;
          lastShape.points.push(...points);
        } else if (this.tool === Tool.Eraser) {
          const pointStart = fixEraserPoint(points[0]);
          const pointEnd = fixEraserPoint(points[points.length - 1]);
          const lastShape = root.shapes.getElementByID(this.createId!);

          const findAndRemoveShape = (point1: Point, point2: Point) => {
            for (const shape of root.shapes) {
              if (this.isSelectable(shape)) {
                if (isInnerBox(shape.box, point2)) {
                  root.shapes.deleteByID(shape.getID());
                }
              } else {
                for (let i = 1; i < shape.points.length; i += 1) {
                  const result = checkLineIntersection(point1, point2, shape.points[i - 1], shape.points[i]);
                  if (result.onLine1 && result.onLine2) {
                    root.shapes.deleteByID(shape.getID());
                    break;
                  }
                }
              }
            }
          };

          if (lastShape.points.length > 0) {
            const lastPoint = lastShape.points[lastShape.points.length - 1];
            findAndRemoveShape(lastPoint, pointStart);
          }

          findAndRemoveShape(pointStart, pointEnd);
          lastShape.points = [pointStart, pointEnd];
        } else if (this.tool === Tool.Rect) {
          const point = tasks[tasks.length - 1];
          const lastShape = root.shapes.getElementByID(this.createId!) as Rect;
          const box = adjustRectBox(lastShape, point);
          lastShape.box = box;
        } else if (this.tool === Tool.Selector) {
          if (this.isEmptySelectedShape()) {
            return;
          }

          const lastShape = root.shapes.getElementByID(this.selectedShape!.shape.getID());
          if (!lastShape || lastShape.type !== 'rect') {
            return;
          }

          if (this.isSelectable(lastShape)) {
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
        }

        this.emit('renderAll', root.shapes);
      });
    });
  }

  mouseup() {
    this.flushTask();
  }

  /**
   * Register the tool to the worker.
   */
  setTool(tool: Tool) {
    this.tool = tool;
  }

  /**
   * Check if it is a shape that can be selected.
   */
  isSelectable(shape: Shape): shape is Rect {
    return shape.type === 'rect';
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

  /**
   * Create shape according to tool.
   */
  createShape(point: Point, options: ShapeOption): TimeTicket {
    let timeTicket: TimeTicket;

    this.update((root: Root) => {
      if (this.tool === Tool.Line) {
        const shape = createLine(point, options);
        root.shapes.push(shape);
      } else if (this.tool === Tool.Eraser) {
        const shape = createEraserLine(point);
        root.shapes.push(shape);
      } else if (this.tool === Tool.Rect) {
        const shape = createRect(point);
        root.shapes.push(shape);
      }

      const lastShape = root.shapes.getLast();
      timeTicket = lastShape.getID();
    });

    return timeTicket!;
  }

  /**
   * Flush existing tasks in the scheduler.
   */
  flushTask() {
    scheduler.requestHostWorkFlush();

    this.update((root: Root) => {
      if (this.tool === Tool.Line) {
        if (!this.createId) {
          return;
        }

        const shape = root.shapes.getElementByID(this.createId);
        // When erasing a line, it checks that the lines overlap, so do not save if there are two points below
        if (shape.points.length < 2) {
          root.shapes.deleteByID(this.createId!);
        }
      } else if (this.tool === Tool.Eraser) {
        if (!this.createId) {
          return;
        }
        root.shapes.deleteByID(this.createId);
      }

      this.emit('renderAll', root.shapes);
    });
  }
}
