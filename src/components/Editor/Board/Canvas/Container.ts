import { Tool, Color } from 'features/boardSlices';
import { Shape } from 'features/docSlices';
import EventDispatcher from 'utils/eventDispatcher';

import Canvas from './Canvas';
import Worker from './worker';
import { Point, Line, EraserLine, Rect } from './Shape';
import { drawLine } from './line';
import { drawRect } from './rect';
import { addEvent, removeEvent, touchy, TouchyEvent } from './dom';

enum DragStatus {
  Drag,
  Stop,
}

export default class Container {
  pointY: number = 0;

  pointX: number = 0;

  offsetY: number = 0;

  offsetX: number = 0;

  lowerCanvas: Canvas;

  upperCanvas: Canvas;

  color: Color = Color.Black;

  update: Function;

  worker: Worker;

  eventDispatcher: EventDispatcher;

  dragStatus: DragStatus = DragStatus.Stop;

  constructor(el: HTMLCanvasElement, update: Function) {
    this.lowerCanvas = new Canvas(el);
    this.upperCanvas = this.createUpperCanvas();

    this.update = update;

    this.eventDispatcher = new EventDispatcher();

    this.init();

    this.worker = new Worker(this.update, this.emit);
  }

  init() {
    this.initResize();
    this.initOffset();
    this.emit = this.emit.bind(this);
    this.drawAll = this.drawAll.bind(this);
    this.onmouseup = this.onmouseup.bind(this);
    this.onmousedown = this.onmousedown.bind(this);
    this.onmousemove = this.onmousemove.bind(this);

    touchy(this.upperCanvas.getCanvas(), addEvent, 'mouseup', this.onmouseup);
    touchy(this.upperCanvas.getCanvas(), addEvent, 'mouseout', this.onmouseup);
    touchy(this.upperCanvas.getCanvas(), addEvent, 'mousedown', this.onmousedown);

    this.on('renderAll', this.drawAll);
  }

  destroy() {
    touchy(this.upperCanvas.getCanvas(), removeEvent, 'mouseup', this.onmouseup);
    touchy(this.upperCanvas.getCanvas(), removeEvent, 'mouseout', this.onmouseup);
    touchy(this.upperCanvas.getCanvas(), removeEvent, 'mousedown', this.onmousedown);

    this.destroyUpperCanvas();
    this.off('renderAll');
  }

  initOffset() {
    const { y, x } = this.lowerCanvas.getCanvas().getBoundingClientRect();
    this.offsetY = y;
    this.offsetX = x;
  }

  initResize() {
    this.lowerCanvas.resize();
    this.upperCanvas.resize();
  }

  createUpperCanvas(): Canvas {
    const canvas = document.createElement('canvas');
    const upperCanvas = new Canvas(canvas);

    upperCanvas.setWidth(this.lowerCanvas.getWidth());
    upperCanvas.setHeight(this.lowerCanvas.getHeight());

    this.lowerCanvas.getCanvas().parentNode?.appendChild(canvas);

    return upperCanvas;
  }

  destroyUpperCanvas() {
    const upperCanvas = this.upperCanvas?.getCanvas();

    if (upperCanvas) {
      this.upperCanvas.getCanvas().parentNode?.removeChild(upperCanvas);
    }
  }

  setColor(color: Color) {
    this.color = color;
  }

  setTool(tool: Tool) {
    this.setMouseClass(tool);

    this.worker.setTool(tool);
  }

  setMouseClass(tool: Tool) {
    this.upperCanvas.getCanvas().className = 'canvas canvas-upper';

    if (tool === Tool.Line || tool === Tool.Rect) {
      this.upperCanvas.getCanvas().classList.add('crosshair', 'canvas-touch-none');
    } else if (tool === Tool.Eraser) {
      this.upperCanvas.getCanvas().classList.add('eraser', 'canvas-touch-none');
    } else if (tool === Tool.Selector) {
      this.upperCanvas.getCanvas().classList.add('canvas-touch-none');
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
    touchy(this.upperCanvas.getCanvas(), addEvent, 'mousemove', this.onmousemove);
    this.dragStatus = DragStatus.Drag;

    const point = this.getMouse(evt);

    this.worker.mousedown(point, { color: this.color });
  }

  onmousemove(evt: TouchyEvent) {
    const point = this.getMouse(evt);
    if (this.isOutSide(point)) {
      return;
    }

    if (this.dragStatus === DragStatus.Stop) {
      return;
    }

    this.worker.mousemove(point);
  }

  onmouseup() {
    touchy(this.upperCanvas.getCanvas(), removeEvent, 'mousemove', this.onmousemove);
    this.dragStatus = DragStatus.Stop;

    this.worker.mouseup();
    this.emit('mouseup');
  }

  isOutSide(point: Point) {
    if (point.y < 0 || point.x < 0 || point.y > this.lowerCanvas.getHeight() || point.x > this.lowerCanvas.getWidth()) {
      this.onmouseup();
      return true;
    }
    return false;
  }

  drawAll(shapes: Array<Shape>, canvas: Canvas = this.lowerCanvas) {
    this.clear(canvas);
    for (const shape of shapes) {
      this.draw(shape, canvas);
    }
  }

  draw(shape: Shape, canvas: Canvas = this.lowerCanvas) {
    if (shape.type === 'line') {
      drawLine(canvas.getContext(), shape as Line);
    } else if (shape.type === 'eraser') {
      drawLine(canvas.getContext(), shape as EraserLine);
    } else if (shape.type === 'rect') {
      drawRect(canvas.getContext(), shape as Rect);
    }
  }

  clear(canvas: Canvas = this.lowerCanvas) {
    canvas.clear();
  }

  emit(name: string, ...args: Array<unknown>) {
    this.eventDispatcher.emit(name, ...args);
  }

  on(name: string, cb: Function) {
    this.eventDispatcher.addEventListener(name, cb);
  }

  off(name: string, cb?: Function) {
    this.eventDispatcher.removeEventListener(name, cb);
  }
}
