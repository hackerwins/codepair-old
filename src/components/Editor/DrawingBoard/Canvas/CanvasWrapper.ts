export default class CanvasWrapper {
  private canvas: HTMLCanvasElement;

  // eslint-disable-next-line react/static-property-placement
  private context: CanvasRenderingContext2D;

  private width = 0;

  private height = 0;

  private styleWidth = 0;

  private styleHeight = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d')!;

    this.context.lineWidth = 3;
    this.context.lineCap = 'round';
    this.canvas.className = 'canvas';

    this.setWidth(canvas.width);
    this.setHeight(canvas.height);
  }

  getCanvas() {
    return this.canvas;
  }

  getContext() {
    return this.context;
  }

  getWidth() {
    return this.width;
  }

  getHeight() {
    return this.height;
  }

  setWidth(width: number, devicePixelRatio?: number) {
    this.width = width;
    this.styleWidth = width;

    this.canvas.width = devicePixelRatio ? width * devicePixelRatio : width;
    this.canvas.style.width = `${width}px`;
  }

  setHeight(height: number, devicePixelRatio?: number) {
    this.height = height;
    this.styleHeight = height;

    this.canvas.height = devicePixelRatio ? height * devicePixelRatio : height;
    this.canvas.style.height = `${height}px`;
  }

  setSize(width: number, height: number, devicePixelRatio?: number) {
    this.setWidth(width, devicePixelRatio);
    this.setHeight(height, devicePixelRatio);
  }

  clear() {
    this.getContext().clearRect(0, 0, this.width, this.height);
  }

  resize() {
    const { devicePixelRatio } = window;
    if (devicePixelRatio) {
      this.setSize(this.styleWidth, this.styleHeight, devicePixelRatio);
      this.context.scale(devicePixelRatio, devicePixelRatio);
    } else {
      this.setSize(this.styleWidth, this.styleHeight);
    }
  }
}
