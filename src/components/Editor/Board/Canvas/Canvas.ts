export default class Canvas {
  private canvas: HTMLCanvasElement;

  // eslint-disable-next-line react/static-property-placement
  private context: CanvasRenderingContext2D;

  width = 0;

  height = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d')!;
    this.resize();
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

  setWidth(width: number) {
    this.canvas.width = width;
    this.width = width;
    this.canvas.style.width = `${width}px`;
  }

  setHeight(height: number) {
    this.canvas.height = height;
    this.height = height;
    this.canvas.style.height = `${height}px`;
  }

  setSize(width: number, height: number) {
    this.setWidth(width);
    this.setHeight(height);
  }

  clear() {
    this.getContext().clearRect(0, 0, this.getWidth(), this.getHeight());
  }

  resize() {
    this.setSize(this.canvas.width, this.canvas.height);
  }
}
