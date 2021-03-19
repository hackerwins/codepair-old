import { TimeTicket } from 'yorkie-js-sdk';
import { Tool } from 'features/boardSlices';
import { Shape } from 'features/docSlices';
import Canvas from './Canvas';

import { Point, Line, EraserLine } from './Shape';
import { drawLine } from './line';
import Worker from './worker';
import { addEvent, removeEvent, touchy } from './dom';

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
    this.onmouseup = this.onmouseup.bind(this);
    this.onmousedown = this.onmousedown.bind(this);
    this.onmousemove = this.onmousemove.bind(this);

    touchy(this.scene.getCanvas(), addEvent, 'mouseup', this.onmouseup as EventListener);
    touchy(this.scene.getCanvas(), addEvent, 'mouseout', this.onmouseup as EventListener);
    touchy(this.scene.getCanvas(), addEvent, 'mousedown', this.onmousedown as EventListener);
  }

  destroy() {
    touchy(this.scene.getCanvas(), removeEvent, 'mouseup', this.onmouseup as EventListener);
    touchy(this.scene.getCanvas(), removeEvent, 'mouseout', this.onmouseup as EventListener);
    touchy(this.scene.getCanvas(), removeEvent, 'mousedown', this.onmousedown as EventListener);
  }

  setTool(tool: Tool) {
    this.setMouseClass(tool);

    this.tool = tool;
  }

  setMouseClass(tool: Tool) {
    this.scene.getCanvas().className = '';

    if (tool === Tool.Line) {
      this.scene.getCanvas().classList.add('crosshair', 'canvas-touch-none');
    } else if (tool === Tool.Eraser) {
      this.scene.getCanvas().classList.add('eraser', 'canvas-touch-none');
    }
  }

  getMouse(evt: MouseEvent | TouchEvent): Point {
    let originY;
    let originX;
    if (evt instanceof TouchEvent) {
      originY = evt.touches[0].clientY;
      originX = evt.touches[0].clientX;
    } else {
      originY = evt.clientY;
      originX = evt.clientX;
    }
    originY += window.scrollY;
    originX += window.scrollX;
    return {
      y: originY - this.offsetY,
      x: originX - this.offsetX,
    };
  }

  onmousedown(evt: MouseEvent) {
    touchy(this.scene.getCanvas(), addEvent, 'mousemove', this.onmousemove as EventListener);
    this.dragStatus = DragStatus.Drag;

    const point = this.getMouse(evt);
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
    touchy(this.scene.getCanvas(), removeEvent, 'mousemove', this.onmousemove as EventListener);
    this.dragStatus = DragStatus.Stop;

    if (this.worker.isRecordWork(this.tool)) {
      this.worker.flushTask(this.createId!, this.tool, this.drawAll);
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

  drawAll(shapes: Array<Shape>, canvas: Canvas = this.scene) {
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
