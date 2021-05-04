import { Tool, Color } from 'features/boardSlices';
import { Point, Shape } from 'features/docSlices';
import EventDispatcher from 'utils/eventDispatcher';

import CanvasWrapper from './CanvasWrapper';
import Worker from './worker';
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

  lowerWrapper: CanvasWrapper;

  upperWrapper: CanvasWrapper;

  color: Color = Color.Black;

  update: Function;

  worker: Worker;

  eventDispatcher: EventDispatcher;

  dragStatus: DragStatus = DragStatus.Stop;

  constructor(el: HTMLCanvasElement, update: Function) {
    this.lowerWrapper = new CanvasWrapper(el);
    this.upperWrapper = this.createUpperWrapper();

    this.update = update;

    this.eventDispatcher = new EventDispatcher();

    this.initialize();

    this.worker = new Worker(this.update, this.emit);
  }

  initialize() {
    this.initializeSize();
    this.initializeOffset();
    this.emit = this.emit.bind(this);
    this.drawAll = this.drawAll.bind(this);
    this.onmouseup = this.onmouseup.bind(this);
    this.onmousedown = this.onmousedown.bind(this);
    this.onmousemove = this.onmousemove.bind(this);

    touchy(this.upperWrapper.getCanvas(), addEvent, 'mouseup', this.onmouseup);
    touchy(this.upperWrapper.getCanvas(), addEvent, 'mouseout', this.onmouseup);
    touchy(this.upperWrapper.getCanvas(), addEvent, 'mousedown', this.onmousedown);

    this.on('renderAll', this.drawAll);
  }

  destroy() {
    touchy(this.upperWrapper.getCanvas(), removeEvent, 'mouseup', this.onmouseup);
    touchy(this.upperWrapper.getCanvas(), removeEvent, 'mouseout', this.onmouseup);
    touchy(this.upperWrapper.getCanvas(), removeEvent, 'mousedown', this.onmousedown);

    this.destroyUpperCanvas();
    this.off('renderAll');
  }

  initializeOffset() {
    const { y, x } = this.lowerWrapper.getCanvas().getBoundingClientRect();
    this.offsetY = y;
    this.offsetX = x;
  }

  initializeSize() {
    this.lowerWrapper.resize();
    this.upperWrapper.resize();
  }

  createUpperWrapper(): CanvasWrapper {
    const canvas = document.createElement('canvas');
    const wrapper = new CanvasWrapper(canvas);

    wrapper.setWidth(this.lowerWrapper.getWidth());
    wrapper.setHeight(this.lowerWrapper.getHeight());

    this.lowerWrapper.getCanvas().parentNode?.appendChild(canvas);

    return wrapper;
  }

  destroyUpperCanvas() {
    const upperCanvas = this.upperWrapper?.getCanvas();

    if (upperCanvas) {
      upperCanvas.parentNode?.removeChild(upperCanvas);
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
    this.upperWrapper.getCanvas().className = 'canvas canvas-upper';

    if (tool === Tool.Line || tool === Tool.Rect) {
      this.upperWrapper.getCanvas().classList.add('crosshair', 'canvas-touch-none');
    } else if (tool === Tool.Eraser) {
      this.upperWrapper.getCanvas().classList.add('eraser', 'canvas-touch-none');
    } else if (tool === Tool.Selector) {
      this.upperWrapper.getCanvas().classList.add('canvas-touch-none');
    }
  }

  getPointFromTouchyEvent(evt: TouchyEvent): Point {
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
    touchy(this.upperWrapper.getCanvas(), addEvent, 'mousemove', this.onmousemove);
    this.dragStatus = DragStatus.Drag;

    const point = this.getPointFromTouchyEvent(evt);

    this.worker.mousedown(point, { color: this.color });
  }

  onmousemove(evt: TouchyEvent) {
    const point = this.getPointFromTouchyEvent(evt);
    if (this.isOutside(point)) {
      this.onmouseup();
      return;
    }

    if (this.dragStatus === DragStatus.Stop) {
      return;
    }

    this.worker.mousemove(point);
  }

  onmouseup() {
    touchy(this.upperWrapper.getCanvas(), removeEvent, 'mousemove', this.onmousemove);
    this.dragStatus = DragStatus.Stop;

    this.worker.mouseup();
    this.emit('mouseup');
  }

  isOutside(point: Point): boolean {
    if (point.y < 0 || point.x < 0 || point.y > this.lowerWrapper.getHeight() || point.x > this.lowerWrapper.getWidth()) {
      return true;
    }
    return false;
  }

  drawAll(shapes: Array<Shape>, wrapper: CanvasWrapper = this.lowerWrapper) {
    this.clear(wrapper);
    for (const shape of shapes) {
      this.draw(shape, wrapper);
    }
  }

  draw(shape: Shape, wrapper: CanvasWrapper = this.lowerWrapper) {
    if (shape.type === 'line') {
      drawLine(wrapper.getContext(), shape);
    } else if (shape.type === 'eraser') {
      drawLine(wrapper.getContext(), shape);
    } else if (shape.type === 'rect') {
      drawRect(wrapper.getContext(), shape);
    }
  }

  clear(wrapper: CanvasWrapper = this.lowerWrapper) {
    wrapper.clear();
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
