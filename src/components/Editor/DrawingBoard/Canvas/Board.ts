import { ToolType, Color } from 'features/boardSlices';
import { Point, Shape } from 'features/docSlices';
import EventDispatcher from 'utils/eventDispatcher';
import { Presence } from 'features/peerSlices';

import CanvasWrapper from './CanvasWrapper';
import { drawLine, drawEraser, drawTrace } from './line';
import { drawRect } from './rect';
import { addEvent, removeEvent, touchy, TouchyEvent } from './dom';
import { Worker, NoneWorker, LineWorker, EraserWorker, RectWorker, SelectorWorker, BoardPresence } from './Worker';

enum DragStatus {
  Drag,
  Stop,
}

export default class Board extends EventDispatcher {
  private offsetY: number = 0;

  private offsetX: number = 0;

  private color: Color = Color.Black;

  private dragStatus: DragStatus = DragStatus.Stop;

  private lowerWrapper: CanvasWrapper;

  private upperWrapper: CanvasWrapper;

  private presenceMap: Map<string, BoardPresence> = new Map();

  update: Function;

  worker!: Worker;

  constructor(el: HTMLCanvasElement, update: Function) {
    super();
    this.lowerWrapper = new CanvasWrapper(el);
    this.upperWrapper = this.createUpperWrapper();

    this.update = update;

    this.initialize();
  }

  initialize() {
    this.initializeSize();
    this.initializeOffset();
    this.emit = this.emit.bind(this);
    this.drawAll = this.drawAll.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);

    this.worker = new NoneWorker(this.update, this);

    touchy(this.upperWrapper.getCanvas(), addEvent, 'mouseup', this.onMouseUp);
    touchy(this.upperWrapper.getCanvas(), addEvent, 'mouseout', this.onMouseOut);
    touchy(this.upperWrapper.getCanvas(), addEvent, 'mousedown', this.onMouseDown);

    this.addEventListener('renderAll', this.drawAll);
  }

  destroy() {
    touchy(this.upperWrapper.getCanvas(), removeEvent, 'mouseup', this.onMouseUp);
    touchy(this.upperWrapper.getCanvas(), removeEvent, 'mouseout', this.onMouseOut);
    touchy(this.upperWrapper.getCanvas(), removeEvent, 'mousedown', this.onMouseDown);

    this.destroyUpperCanvas();
    this.removeEventListener('renderAll');
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
    this.worker.setOption({ color });
  }

  setWidth(width: number) {
    this.lowerWrapper.setWidth(width);
    this.upperWrapper.setWidth(width);
    this.resize();
  }

  setHeight(height: number) {
    this.lowerWrapper.setHeight(height);
    this.upperWrapper.setHeight(height);
    this.resize();
  }

  resize() {
    this.lowerWrapper.resize();
    this.upperWrapper.resize();
  }

  setTool(tool: ToolType) {
    this.setMouseClass(tool);

    if (this.worker.type === tool) {
      return;
    }

    this.worker.flushTask();
    this.worker = this.createWorker(tool);
  }

  createWorker(tool: ToolType) {
    if (tool === ToolType.Line) {
      return new LineWorker(this.update, this, { color: this.color });
    }
    if (tool === ToolType.Eraser) {
      return new EraserWorker(this.update, this);
    }
    if (tool === ToolType.Rect) {
      return new RectWorker(this.update, this, { color: this.color });
    }
    if (tool === ToolType.Selector) {
      return new SelectorWorker(this.update, this);
    }
    if (tool === ToolType.None || tool === ToolType.Clear) {
      return new NoneWorker(this.update, this);
    }
    throw new TypeError(`Undefined tool: ${tool}`);
  }

  setMouseClass(tool: ToolType) {
    this.upperWrapper.getCanvas().className = 'canvas canvas-upper';

    if (tool === ToolType.Line || tool === ToolType.Rect) {
      this.upperWrapper.getCanvas().classList.add('crosshair', 'canvas-touch-none');
    } else if (tool === ToolType.Eraser) {
      this.upperWrapper.getCanvas().classList.add('eraser', 'canvas-touch-none');
    } else if (tool === ToolType.Selector) {
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

  onMouseDown(evt: TouchyEvent) {
    touchy(this.upperWrapper.getCanvas(), addEvent, 'mousemove', this.onMouseMove);
    this.dragStatus = DragStatus.Drag;

    const point = this.getPointFromTouchyEvent(evt);

    this.worker.mousedown(point, (boardPresence: BoardPresence) => {
      this.emit('mousedown', boardPresence);
    });
  }

  onMouseMove(evt: TouchyEvent) {
    const point = this.getPointFromTouchyEvent(evt);
    if (this.isOutside(point)) {
      this.onMouseUp();
      return;
    }

    if (this.dragStatus === DragStatus.Stop) {
      return;
    }

    this.worker.mousemove(point, (boardPresence: BoardPresence) => {
      this.emit('mousemove', boardPresence);
    });
  }

  onMouseUp() {
    touchy(this.upperWrapper.getCanvas(), removeEvent, 'mousemove', this.onMouseMove);
    this.dragStatus = DragStatus.Stop;

    this.worker.mouseup((boardPresence: BoardPresence) => {
      this.emit('mousedown', boardPresence);
    });
    this.emit('mouseup');
  }

  onMouseOut() {
    this.dragStatus = DragStatus.Stop;
    this.worker.flushTask();
    this.emit('mouseout');
  }

  updatePresence(peerKey: string, presence: Presence) {
    this.clear(this.upperWrapper);

    this.presenceMap.set(peerKey, JSON.parse(presence.board || '{}'));

    for (const boardPresence of this.presenceMap.values()) {
      const { eraserPoints, line, rect } = boardPresence;
      if (eraserPoints && eraserPoints.length > 0) {
        drawEraser(this.upperWrapper.getContext(), {
          type: 'eraser',
          points: eraserPoints,
        });
      }
      if (line && line.points.length > 0) {
        drawTrace(this.upperWrapper.getContext(), line);
      }
      if (rect && rect.box.height !== 0 && rect.box.width !== 0) {
        drawRect(this.upperWrapper.getContext(), rect);
      }
    }
  }

  isOutside(point: Point): boolean {
    if (
      point.y < 0 ||
      point.x < 0 ||
      point.y > this.lowerWrapper.getHeight() ||
      point.x > this.lowerWrapper.getWidth()
    ) {
      return true;
    }
    return false;
  }

  drawAll(shapes: Array<Shape>, wrapper: CanvasWrapper = this.lowerWrapper) {
    this.clear(wrapper);
    for (const shape of shapes) {
      if (shape.type === 'line') {
        drawLine(wrapper.getContext(), shape);
      } else if (shape.type === 'eraser') {
        drawEraser(wrapper.getContext(), shape);
      } else if (shape.type === 'rect') {
        drawRect(wrapper.getContext(), shape);
      }
    }
  }

  clear(wrapper: CanvasWrapper = this.lowerWrapper) {
    wrapper.clear();
  }

  clearBoard() {
    this.clear(this.lowerWrapper);
    this.clear(this.upperWrapper);
    this.worker.clearAll();
  }
}
