export interface Point2D {
  x: number;
  y: number;
}

export function domRectFromPoints(p1: Point2D, p2: Point2D): DOMRect {
  return new DOMRect(
    Math.min(p1.x, p2.x),
    Math.min(p1.y, p2.y),
    Math.abs(p1.x - p2.x),
    Math.abs(p1.y - p2.y),
  );
}
