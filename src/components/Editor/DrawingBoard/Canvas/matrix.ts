import { Rect, Point, ShapeOptions } from 'features/docSlices';

type Matrix = [
  number, // Horizontal scaling. A value of 1 results in no scaling.
  number, // Vertical skewing.
  number, // Horizontal skewing.
  number, // Vertical scaling. A value of 1 results in no scaling.
  number, // Horizontal translation (moving).
  number, // Vertical translation (moving).
];

/**
 * getCenterPoint return the center coordinates of shape
 */
function getCenterPoint(shape: Rect): Point {
  return {
    x: shape.box.x + 0.5 * shape.box.width,
    y: shape.box.y + 0.5 * shape.box.height,
  };
}

/**
 * calcTranslateMatrix calculates the translation matrix for a shape transform
 */
function calcTranslateMatrix(shape: Rect) {
  const point = getCenterPoint(shape);
  return [1, 0, 0, 1, point.x, point.y];
}

/**
 * multiplyTransformMatrices multiply matrix A by matrix B
 */
function multiplyTransformMatrices(a: Matrix, b: Matrix): Matrix {
  // Matrix multiply a * b
  return [
    a[0] * b[0] + a[2] * b[1],
    a[1] * b[0] + a[3] * b[1],
    a[0] * b[2] + a[2] * b[3],
    a[1] * b[2] + a[3] * b[3],
    a[0] * b[4] + a[2] * b[5] + a[4],
    a[1] * b[4] + a[3] * b[5] + a[5],
  ];
}

/**
 * degreesToRadians transforms degree to radian
 */
function degreesToRadians(angle: number) {
  return (angle * Math.PI) / 180;
}

/**
 * calcRotateMatrix returns a transform matrix by angle
 */
function calcRotateMatrix(options: ShapeOptions): Matrix {
  const radian = degreesToRadians(options.angle);
  const cos = Math.cos(radian);
  const sin = Math.sin(radian);
  return [cos, sin, -sin, cos, 0, 0];
}

/**
 * calcDimensionsMatrix return a transform matrix by scale
 */
function calcDimensionsMatrix(options: ShapeOptions): Matrix {
  const { flipY, flipX, scaleX, scaleY } = options;
  return [flipX ? -scaleX : scaleX, 0, 0, flipY ? -scaleY : scaleY, 0, 0];
}

/**
 * composeMatrix returns a transform matrix
 */
function composeMatrix(options: ShapeOptions) {
  let matrix: Matrix = [1, 0, 0, 1, options.translateX, options.translateY];

  if (options.angle !== 0) {
    matrix = multiplyTransformMatrices(matrix, calcRotateMatrix(options));
  }

  if (options.scaleX !== 1 || options.scaleY !== 1) {
    matrix = multiplyTransformMatrices(matrix, calcDimensionsMatrix(options));
  }

  return matrix;
}

/**
 * calcMatrix calculates matrix that represents the current transforms
 * from the shape's properties
 */
function calcOwnMatrix(shape: Rect) {
  const matrix = calcTranslateMatrix(shape);
  const options = {
    angle: shape.options?.angle ?? 0,
    translateX: matrix[4],
    translateY: matrix[5],
    scaleX: shape.options?.scaleX ?? 1,
    scaleY: shape.options?.scaleY ?? 1,
    flipX: shape.options?.flipX ?? false,
    flipY: shape.options?.flipY ?? false,
  };

  return composeMatrix(options);
}

/**
 * transform transforms context when rendering a shape
 */
export function transform(context: CanvasRenderingContext2D, shape: Rect) {
  const matrix = calcOwnMatrix(shape);
  context.transform(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]);
}
