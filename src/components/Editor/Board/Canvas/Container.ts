import { Tool } from 'features/boardSlices';
import Canvas from './Canvas';

export default class Container {
  scene: Canvas;

  tool: Tool;

  constructor(el: HTMLCanvasElement) {
    this.tool = Tool.Line;

    this.scene = new Canvas(el);
  }

  setTool(tool: Tool) {
    this.tool = tool;
  }

  //  onmousedown(update: Function): void {}

  //  onmousemove(update: Function): void {}

  //  onmouseup() {}

  //  drawAll(shapes: Array<any>) {}

  clear() {
    this.scene.clear();
  }
}
