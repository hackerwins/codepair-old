import { Tool } from 'features/boardSlices';
import Canvas from './Canvas';

import { Root, Point, Line, Shapes, Shape, TimeTicket, Rect } from './Shape';
import { compressPoints } from './utils';
import { drawLine, createLine, adjustLineBox } from './Line';
import { drawRect, createRect, adjustRectBox } from './Rect';
import * as schedule from './schedule';

interface Options {
  color: string;
  selectedColor: string;
}

export enum DragStatus {
  Drag,
  Stop,
}

export default class Container {
  pointY: number;

  pointX: number;

  offsetY: number;

  offsetX: number;

  scene: Canvas;

  tool: Tool;

  createId?: TimeTicket;

  dragStatus: DragStatus;

  update: Function;

  options: Options;

  constructor(el: HTMLCanvasElement, update: Function, options: Options) {
    this.pointY = 0;
    this.pointX = 0;
    this.tool = Tool.Line;
    this.dragStatus = DragStatus.Stop;
    this.update = update;
    this.options = options;
    this.scene = new Canvas(el);

    const { y, x } = this.scene.getCanvas().getBoundingClientRect();
    this.offsetY = y;
    this.offsetX = x;

    this.init();
  }

  init() {
    this.scene.getContext().strokeStyle = this.options.color;

    this.scene.getCanvas().onmouseup = this.onmouseup.bind(this);
    this.scene.getCanvas().onmouseout = this.onmouseup.bind(this);
    this.scene.getCanvas().onmousedown = this.onmousedown.bind(this);
    this.scene.getCanvas().onmousemove = this.onmousemove.bind(this);
  }

  setTool(tool: Tool) {
    this.setMouseClass(tool);

    this.tool = tool;
  }

  setMouseClass(tool: Tool) {
    this.scene.getCanvas().className = '';

    if (tool === Tool.Line) {
      this.scene.getCanvas().classList.add('crosshair');
    } else if (tool === Tool.Selector) {
      this.scene.getCanvas().classList.add('default');
    }
  }

  getDragStatus() {
    return this.dragStatus;
  }

  getMouse(evt: MouseEvent): Point {
    return {
      y: evt.pageY - this.offsetY,
      x: evt.pageX - this.offsetX,
    };
  }

  onmousedown(evt: MouseEvent) {
    const point = this.getMouse(evt);
    if (this.isOutSide(point)) {
      return;
    }

    this.dragStatus = DragStatus.Drag;

    this.update((root: Root) => {
      if (this.tool === Tool.Line) {
        const shape = createLine(point);
        root.shapes.push(shape);
      } else if (this.tool === Tool.Selector) {
        const shape = createRect(point);
        root.shapes.push(shape);
      }

      const lastShape = root.shapes.getLast();
      this.createId = lastShape.getID();
    });

    schedule.requestHostCallback((tasks) => {
      this.update((root: Root) => {
        if (this.tool === Tool.Line) {
          const points = compressPoints(tasks.map((task) => task.point));
          const lastShape = root.shapes.getElementByID(this.createId) as Line;
          const box = adjustLineBox(lastShape, points);

          lastShape.box = box;
          lastShape.points.push(...points);
          this.drawAll(root.shapes);
        } else if (this.tool === Tool.Selector) {
          const lastPoint = tasks[tasks.length - 1].point;
          const lastShape = root.shapes.getElementByID(this.createId) as Rect;
          const box = adjustRectBox(lastShape, lastPoint);

          lastShape.box = box;
          this.drawAll(root.shapes);
        }
      });
    });
  }

  onmousemove(evt: MouseEvent) {
    const point = this.getMouse(evt);
    if (this.isOutSide(point)) {
      return;
    }

    if (this.dragStatus === DragStatus.Stop) {
      return;
    }

    schedule.reserveTask({
      point,
    });
  }

  onmouseup() {
    this.dragStatus = DragStatus.Stop;

    schedule.requestHostWorkFlush();

    if (!this.createId) {
      return;
    }

    if (this.tool === Tool.Selector) {
      this.update((root: Root) => {
        root.shapes.deleteByID(this.createId);
        this.drawAll(root.shapes);
      });
    }

    this.createId = undefined;
  }

  isOutSide(point: Point) {
    if (point.y < 0 || point.x < 0 || point.y > this.scene.getHeight() || point.x > this.scene.getWidth()) {
      this.onmouseup();
      return true;
    }
    return false;
  }

  drawAll(shapes: Shapes, canvas: Canvas = this.scene) {
    canvas.clear();
    for (const shape of shapes) {
      this.draw(shape, canvas);
    }
  }

  draw(shape: Shape, canvas: Canvas = this.scene) {
    if (shape.type === 'line') {
      drawLine(canvas.getContext(), shape as Line);
    } else if (shape.type === 'rect') {
      drawRect(canvas.getContext(), shape as Rect, this.options.selectedColor);
    }
  }

  clear() {
    this.scene.clear();
  }
}
