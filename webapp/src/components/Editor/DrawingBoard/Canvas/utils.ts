import { Point, Box, Shape, Rect } from 'features/docSlices';

/**
 * square distance between 2 points
 */
function getSqDist(p1: Point, p2: Point) {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;

  return dx * dx + dy * dy;
}

/**
 * square distance from a point to a segment
 */
function getSqSegDist(p: Point, p1: Point, p2: Point) {
  let { x, y } = p1;
  let dx = p2.x - x;
  let dy = p2.y - y;

  if (dx !== 0 || dy !== 0) {
    const t = ((p.x - x) * dx + (p.y - y) * dy) / (dx * dx + dy * dy);
    if (t > 1) {
      x = p2.x;
      y = p2.y;
    } else if (t > 0) {
      x += dx * t;
      y += dy * t;
    }
  }

  dx = p.x - x;
  dy = p.y - y;
  return dx * dx + dy * dy;
}

function douglasPeuckerStep(
  points: Array<Point>,
  first: number,
  last: number,
  tolerance: number,
  simplified: Array<Point>,
) {
  let maxDist = tolerance;
  let index = 0;

  for (let i = first + 1; i < last; i += 1) {
    const dist = getSqSegDist(points[i], points[first], points[last]);

    if (dist > maxDist) {
      index = i;
      maxDist = dist;
    }
  }

  if (maxDist > tolerance) {
    if (first + 1 < index) {
      douglasPeuckerStep(points, first, index, tolerance, simplified);
    }
    simplified.push(points[index]);
    if (index + 1 < last) {
      douglasPeuckerStep(points, index, last, tolerance, simplified);
    }
  }
}

function douglasPeucker(points: Array<Point>, tolerance: number): Array<Point> {
  const first = 0;
  const last = points.length - 1;
  const simplified = [];

  simplified.push(points[first]);
  douglasPeuckerStep(points, first, last, tolerance, simplified);
  simplified.push(points[last]);

  return simplified;
}

function simplifyRadialDist(points: Array<Point>, tolerance: number) {
  let point = points[0];
  let prevPoint = point;
  const simplified = [prevPoint];

  for (let i = 1, len = points.length; i < len; i += 1) {
    point = points[i];

    if (getSqDist(point, prevPoint) > tolerance) {
      simplified.push(point);
      prevPoint = point;
    }
  }

  if (prevPoint !== point) {
    simplified.push(point);
  }
  return simplified;
}

/**
 * @see {@link https://cartography-playground.gitlab.io/playgrounds/douglas-peucker-algorithm/}
 * @see {@link https://github.com/mourner/simplify-js}
 */
export function compressPoints(points: Array<Point>, tolerance: number = 10): Array<Point> {
  return douglasPeucker(simplifyRadialDist(points, tolerance), tolerance);
}

/**
 * Check if the two lines overlap
 * @see {@link http://jsfiddle.net/justin_c_rounds/Gd2S2/}
 * @see {@link https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection}
 */
export function checkLineIntersection(point1Start: Point, point1End: Point, point2Start: Point, point2End: Point) {
  // if the lines intersect, the result contains the x and y of the intersection (treating the lines as infinite) and booleans for whether line segment 1 or line segment 2 contain the point
  let a;
  let b;
  const result = {
    x: 0,
    y: 0,
    onLine1: false,
    onLine2: false,
  };

  const denominator =
    (point2End.y - point2Start.y) * (point1End.x - point1Start.x) -
    (point2End.x - point2Start.x) * (point1End.y - point1Start.y);
  if (denominator === 0) {
    return result;
  }
  a = point1Start.y - point2Start.y;
  b = point1Start.x - point2Start.x;
  const numerator1 = (point2End.x - point2Start.x) * a - (point2End.y - point2Start.y) * b;
  const numerator2 = (point1End.x - point1Start.x) * a - (point1End.y - point1Start.y) * b;
  a = numerator1 / denominator;
  b = numerator2 / denominator;

  // if we cast these lines infinitely in both directions, they intersect here:
  result.x = point1Start.x + a * (point1End.x - point1Start.x);
  result.y = point1Start.y + a * (point1End.y - point1Start.y);
  /*
  // it is worth noting that this should be the same as:
  x = point2Start.x + (b * (point2End.x - point2Start.x));
  y = point2Start.x + (b * (point2End.y - point2Start.y));
  */
  // if line1 is a segment and line2 is infinite, they intersect if:
  if (a > 0 && a < 1) {
    result.onLine1 = true;
  }
  // if line2 is a segment and line1 is infinite, they intersect if:
  if (b > 0 && b < 1) {
    result.onLine2 = true;
  }
  // if line1 and line2 are segments, they intersect if both of the above are true
  return result;
}

export function cloneBox(box: Box): Box {
  return {
    y: box.y,
    x: box.x,
    width: box.width,
    height: box.height,
  };
}

/**
 * Check if the point is contained inside the box.
 */
export function isInnerBox(box: Box, point: Point): boolean {
  const offsetY = box.y + box.height;
  const offsetX = box.x + box.width;

  if (box.height > 0 ? offsetY < point.y : offsetY > point.y) {
    return false;
  }
  if (box.y > point.y) {
    return false;
  }

  if (box.height > 0 ? offsetX < point.x : offsetX > point.x) {
    return false;
  }
  if (box.x > point.x) {
    return false;
  }
  return true;
}

/**
 * Check if it is a shape that can be selected.
 */
export function isSelectable(shape: Shape): shape is Rect {
  return shape.type === 'rect';
}

export function* reverseIter<T>(arr: T[]) {
  let l = arr.length - 1;
  while (l >= 0) {
    yield arr[l];
    l -= 1;
  }
}
