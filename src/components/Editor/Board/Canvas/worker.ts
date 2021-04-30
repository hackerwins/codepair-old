import { TimeTicket, Client, ActorID } from 'yorkie-js-sdk';

import { Tool } from 'features/boardSlices';
import { Peer } from 'features/peerSlices';

import { Root, Shape, Point, Line, Rect } from './Shape';
import { compressPoints, checkLineIntersection, isInnerBox, cloneBox } from './utils';
import { LineOption, createLine, createEraserLine, fixEraserPoint } from './line';
import { createRect, adjustRectBox } from './rect';
import * as schedule from './schedule';

interface SelectedShape {
  status: 'move';
  shape: Shape;
  point: Point; // pin
}

type ShapeOption = LineOption;

export default class Worker {
  private update: Function;

  private selectedShape: SelectedShape | undefined;

  private activePeerMap: Map<ActorID, Peer> = new Map();

  private client: Client;

  constructor(client: Client, update: Function) {
    this.update = update;
    this.client = client;
  }

  setActivePeerMap(activePeerMap: Map<ActorID, Peer>) {
    this.activePeerMap = activePeerMap;
  }

  /**
   * Create shape according to tool.
   */
  createShape(tool: Tool, point: Point, options: ShapeOption): TimeTicket {
    let timeTicket: TimeTicket;

    this.update((root: Root) => {
      let shape: Shape;
      if (tool === Tool.Line) {
        shape = createLine(point, options);
      } else if (tool === Tool.Eraser) {
        shape = createEraserLine(point);
      } else if (tool === Tool.Rect) {
        shape = createRect(point);
      } else {
        throw new Error(`Undefined tool ${tool}`);
      }

      this.beforeEditShape(shape);
      root.shapes.push(shape);
      timeTicket = root.shapes.getLast().getID();
    });

    return timeTicket!;
  }

  /**
   * Find the shape in the document.
   */
  findTarget(point: Point): Shape | undefined {
    let target;
    this.update((root: Root) => {
      for (const shape of root.shapes) {
        if (shape?.box && isInnerBox(shape.box, point)) {
          target = shape;
          return;
        }
      }
    });
    return target;
  }

  /**
   * Select a shape that can be controlled.
   */
  selectShape(point: Point): Shape | undefined {
    const target = this.findTarget(point);

    if (!target) {
      return undefined;
    }

    this.beforeEditShape(target);

    this.selectedShape = {
      shape: target,
      point,
      status: 'move',
    };

    return target;
  }

  isEmptySelectedShape() {
    return !this.selectedShape;
  }

  /**
   * Task execution by scheduler.
   */
  executeTask(createId: TimeTicket, tool: Tool, callback: Function) {
    schedule.requestHostCallback((tasks) => {
      if (tasks.length < 2) {
        return;
      }

      this.update((root: Root) => {
        if (tool === Tool.Line) {
          const points = compressPoints(tasks.map((task) => task.point));
          const lastShape = root.shapes.getElementByID(createId) as Line;

          lastShape.points.push(...points);
          callback(root.shapes);
        } else if (tool === Tool.Eraser) {
          const points = compressPoints(tasks.map((task) => task.point));
          const pointStart = fixEraserPoint(points[0]);
          const pointEnd = fixEraserPoint(points[points.length - 1]);
          const lastShape = root.shapes.getElementByID(createId);

          const findAndRemoveShape = (point1: Point, point2: Point) => {
            for (const shape of root.shapes) {
              // TODO(ppeeou) selectable shape
              if (shape.type === 'rect') {
                if (isInnerBox(shape.box, point2)) {
                  this.deleteShapeByID(root, shape.getID());
                }
              } else {
                for (let i = 1; i < shape.points.length; i += 1) {
                  const result = checkLineIntersection(point1, point2, shape.points[i - 1], shape.points[i]);
                  if (result.onLine1 && result.onLine2) {
                    this.deleteShapeByID(root, shape.getID());
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
          callback(root.shapes);
        } else if (tool === Tool.Rect) {
          const { point } = tasks[tasks.length - 1];
          const lastShape = root.shapes.getElementByID(createId) as Rect;
          const box = adjustRectBox(lastShape, point);
          lastShape.box = box;
          callback(root.shapes);
        } else if (tool === Tool.Selector) {
          if (this.isEmptySelectedShape()) {
            return;
          }

          // TODO(ppeeou) selectable shape
          const lastShape = root.shapes.getElementByID(createId) as Rect;
          const pointEnd = tasks[tasks.length - 1].point;
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
          callback(root.shapes);
        }
      });
    });
  }

  /**
   * Schedule the task to be executed in the scheduler.
   */
  reserveTask(task: schedule.Task) {
    schedule.reserveTask(task);
  }

  /**
   * Flush existing tasks in the scheduler.
   */
  flushTask(createId: TimeTicket, tool: Tool, callback: Function) {
    schedule.requestHostWorkFlush();

    if (!createId) {
      return;
    }

    this.update((root: Root) => {
      if (tool === Tool.Line) {
        const shape = root.shapes.getElementByID(createId);
        this.afterEditShape(shape);

        // When erasing a line, it checks that the lines overlap, so do not save if there are two points below
        if (shape.points.length < 2) {
          this.deleteShapeByID(root, createId);
          callback(root.shapes);
        }
      } else if (tool === Tool.Rect) {
        const shape = root.shapes.getElementByID(createId);
        this.afterEditShape(shape);
      } else if (tool === Tool.Eraser) {
        const shape = root.shapes.getElementByID(createId);
        this.afterEditShape(shape);
        this.deleteShapeByID(root, createId);
        callback(root.shapes);
      }
    });
  }

  beforeEditShape(shape: Shape) {
    shape.isEditing = true;
    shape.editorID = this.client.getID()!;
  }

  afterEditShape(shape: Shape) {
    shape.isEditing = false;
  }

  deleteShapeByID(root: Root, id: TimeTicket) {
    const shape = root.shapes.getElementByID(id);
    if (shape.isEditing && this.activePeerMap.has(shape.editorID)) {
      return;
    }

    root.shapes.deleteByID(id);
  }
}
