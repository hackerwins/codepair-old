import { Tool } from 'features/boardSlices';
import Canvas from './Canvas';

import { Root, Point, Line, Shapes, Shape, TimeTicket } from './Shape';
import { drawLine, createLine } from './utils';

interface Options {
  color: string;
}

enum DragStatus {
  Drag,
  Stop,
}

let dragStatus = DragStatus.Stop;

export default class Container {
  pointY: number;

  pointX: number;

  offsetY: number;

  offsetX: number;

  scene: Canvas;

  tool: Tool;

  createId?: TimeTicket;

  update: Function;

  options: Options;

  constructor(el: HTMLCanvasElement, update: Function, options: Options) {
    this.pointY = 0;
    this.pointX = 0;
    this.tool = Tool.Line;
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
    this.scene.getCanvas().onmousedown = this.onmousedown.bind(this);
    this.scene.getCanvas().onmousemove = this.onmousemove.bind(this);
  }

  setTool(tool: Tool) {
    this.setMouseClass(this.tool);

    this.tool = tool;
  }

  setMouseClass(tool: Tool) {
    this.scene.getCanvas().className = '';

    if (tool === Tool.Line) {
      this.scene.getCanvas().classList.add('crosshair');
    }
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

    dragStatus = DragStatus.Drag;

    this.update((root: Root) => {
      if (this.tool === Tool.Line) {
        const shape = createLine(point);
        root.shapes.push(shape);
        const lastShape = root.shapes.getLast();
        this.createId = lastShape.getID();
      }
    });
  }

  onmousemove(evt: MouseEvent) {
    const point = this.getMouse(evt);
    if (this.isOutSide(point)) {
      return;
    }

    if (dragStatus === DragStatus.Stop) {
      return;
    }

    this.update((root: Root) => {
      if (this.tool === Tool.Line) {
        const lastShape = root.shapes.getElementByID(this.createId) as Line;
        lastShape.points.push(point);
        this.drawAll(root.shapes);
      }
    });
  }

  onmouseup() {
    dragStatus = DragStatus.Stop;
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
    }
  }

  clear() {
    this.scene.clear();
  }
}
