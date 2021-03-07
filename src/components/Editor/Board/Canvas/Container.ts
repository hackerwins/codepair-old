import { Tool } from 'features/boardSlices';
import Canvas from './Canvas';

import { Point, Line, Shapes, Shape, TimeTicket, EraserLine } from './Shape';
import { drawLine } from './line';
import Worker from './worker';

interface Options {
  color: string;
  eraserColor: string;
}

enum DragStatus {
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

  worker: Worker;

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

    this.worker = new Worker(this.update);
  }

  init() {
    this.scene.getContext().strokeStyle = this.options.color;

    this.drawAll = this.drawAll.bind(this);
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
    } else if (tool === Tool.Eraser) {
      this.scene.getCanvas().classList.add('eraser');
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

    this.dragStatus = DragStatus.Drag;

    if (this.worker.isRecordWork(this.tool)) {
      this.createId = this.worker.createShape(this.tool, point);
      this.worker.executeTask(this.createId, this.tool, this.drawAll);
    }
  }

  onmousemove(evt: MouseEvent) {
    const point = this.getMouse(evt);
    if (this.isOutSide(point)) {
      return;
    }

    if (this.dragStatus === DragStatus.Stop) {
      return;
    }

    if (this.worker.isRecordWork(this.tool)) {
      this.worker.reserveTask({
        point,
      });
    }
  }

  onmouseup() {
    this.dragStatus = DragStatus.Stop;

    if (this.worker.isRecordWork(this.tool)) {
      this.worker.flushTask(this.createId, this.tool, this.drawAll);
      this.createId = undefined;
    }
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
      drawLine(canvas.getContext(), this.options.color, shape as Line);
    } else if (shape.type === 'eraser') {
      drawLine(canvas.getContext(), this.options.eraserColor, shape as EraserLine);
    }
  }

  clear() {
    this.scene.clear();
  }
}
