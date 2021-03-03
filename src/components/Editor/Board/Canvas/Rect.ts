import { Point, Rect, Box } from './Shape';
import { cloneBox, hexToRgb } from './utils';

export function createRect(pos: Point): Rect {
  return {
    type: 'rect',
    box: {
      x: pos.x,
      y: pos.y,
      width: 1,
      height: 1,
    },
    pin: { x: pos.x, y: pos.y },
  } as Rect;
}

export function drawRect(context: CanvasRenderingContext2D, rect: Rect, color: string) {
  const originalStroke = context.fillStyle;
  const [R, G, B] = hexToRgb(color);
  context.fillStyle = `rgb(${R},${G},${B},0.3)`;
  context.fillRect(rect.box.x, rect.box.y, rect.box.width, rect.box.height);
  context.strokeRect(rect.box.x, rect.box.y, rect.box.width, rect.box.height);
  context.fillStyle = originalStroke;
}

export function adjustRectBox(shape: Rect, pos: Point): Box {
  const box = cloneBox(shape.box);
  const { pin } = shape;

  const width = pos.x - pin.x;
  const height = pos.y - pin.y;
  const aWidth = Math.abs(width);
  const aHeight = Math.abs(height);

  box.x = pin.x - (width > 0 ? 0 : -width);
  box.y = pin.y - (height > 0 ? 0 : -height);
  box.width = aWidth;
  box.height = aHeight;

  return box;
}
