import { TimeTicket } from 'yorkie-js-sdk';
import { Tool } from 'features/boardSlices';
import { Shape } from 'features/docSlices';
import EventDispatcher from 'utils/eventDispatcher';

import Canvas from './Canvas';
import Worker from './worker';
import { Point, Line, EraserLine, Rect } from './Shape';
import { drawLine } from './line';
import { drawRect } from './rect';
import { addEvent, removeEvent, touchy, TouchyEvent } from './dom';

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

  eventDispatcher: EventDispatcher;

  constructor(el: HTMLCanvasElement, update: Function, options: Options) {
    this.pointY = 0;
    this.pointX = 0;
    this.tool = Tool.Line;
    this.dragStatus = DragStatus.Stop;
    this.update = update;
    this.options = options;
    this.scene = new Canvas(el);
    this.eventDispatcher = new EventDispatcher();

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

    touchy(this.scene.getCanvas(), addEvent, 'mouseup', this.onmouseup);
    touchy(this.scene.getCanvas(), addEvent, 'mouseout', this.onmouseup);
    touchy(this.scene.getCanvas(), addEvent, 'mousedown', this.onmousedown);
  }

  destroy() {
    touchy(this.scene.getCanvas(), removeEvent, 'mouseup', this.onmouseup);
    touchy(this.scene.getCanvas(), removeEvent, 'mouseout', this.onmouseup);
    touchy(this.scene.getCanvas(), removeEvent, 'mousedown', this.onmousedown);
  }

  setTool(tool: Tool) {
    this.setMouseClass(tool);

    this.tool = tool;
  }

  setMouseClass(tool: Tool) {
    this.scene.getCanvas().className = '';

    if (tool === Tool.Line || tool === Tool.Rect) {
      this.scene.getCanvas().classList.add('crosshair', 'canvas-touch-none');
    } else if (tool === Tool.Eraser) {
      this.scene.getCanvas().classList.add('eraser', 'canvas-touch-none');
    }
  }

  getMouse(evt: TouchyEvent): Point {
    let originY;
    let originX;
    if (window.TouchEvent && evt instanceof TouchEvent) {
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

  onmousedown(evt: TouchyEvent) {
    touchy(this.scene.getCanvas(), addEvent, 'mousemove', this.onmousemove);
    this.dragStatus = DragStatus.Drag;

    const point = this.getMouse(evt);
    if (this.tool === Tool.Line || this.tool === Tool.Eraser || this.tool === Tool.Rect) {
      this.createId = this.worker.createShape(this.tool, point);
      this.worker.executeTask(this.createId, this.tool, this.drawAll);
    } else if (this.tool === Tool.Selector) {
      const shape = this.worker.selectShape(point);
      if (shape) {
        this.worker.executeTask(shape.getID(), this.tool, this.drawAll);
      }
    }
  }

  onmousemove(evt: TouchyEvent) {
    const point = this.getMouse(evt);
    if (this.isOutSide(point)) {
      return;
    }

    if (this.dragStatus === DragStatus.Stop) {
      return;
    }

    if (
      this.tool === Tool.Line ||
      this.tool === Tool.Eraser ||
      this.tool === Tool.Rect ||
      this.tool === Tool.Selector
    ) {
      this.worker.reserveTask({
        point,
      });
    }
  }

  onmouseup() {
    touchy(this.scene.getCanvas(), removeEvent, 'mousemove', this.onmousemove);
    this.dragStatus = DragStatus.Stop;

    if (
      this.tool === Tool.Line ||
      this.tool === Tool.Eraser ||
      this.tool === Tool.Rect ||
      this.tool === Tool.Selector
    ) {
      this.worker.flushTask(this.createId!, this.tool, this.drawAll);
    }

    this.createId = undefined;
    this.emit('mouseup');
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
      drawLine(canvas.getContext(), shape as Line, this.options.color);
    } else if (shape.type === 'eraser') {
      drawLine(canvas.getContext(), shape as EraserLine, this.options.eraserColor);
    } else if (shape.type === 'rect') {
      drawRect(canvas.getContext(), shape as Rect);
    }
  }

  clear() {
    this.scene.clear();
  }

  emit(name: string, ...args: Array<unknown>) {
    this.eventDispatcher.emit(name, ...args);
  }

  on(name: string, cb: Function) {
    this.eventDispatcher.addEventListener(name, cb);
  }

  off(name: string, cb: Function) {
    this.eventDispatcher.removeEventListener(name, cb);
  }
}
