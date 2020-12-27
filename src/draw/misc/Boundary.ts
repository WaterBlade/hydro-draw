import { vec, Vector } from "./Vector";

export class Boundary {
  protected points: Vector[];
  protected rightMost: number;
  protected leftMost: number;
  protected top: number;
  protected bottom: number;
  constructor(...pts: Vector[]) {
    this.points = pts;
    this.rightMost = Math.max(...pts.map((pt) => pt.x));
    this.leftMost = Math.min(...pts.map((pt) => pt.x));
    this.top = Math.max(...pts.map(p=>p.y));
    this.bottom = Math.min(...pts.map(p=>p.y));
  }

  insideTest(p0: Vector): boolean {
    const {x, y} = p0;
    if(x < this.leftMost || x > this.rightMost || y < this.bottom || y > this.top ) return false;
    const p1 = vec(2 * this.rightMost - this.leftMost, p0.y);
    let isInside = false;
    const length = this.points.length;
    for (let i = 1; i <= length; i++) {
      const start = (i - 1) % length;
      const end = i % length;
      if (intersectTest(p0, p1, this.points[start], this.points[end])) {
        isInside = !isInside;
      }
    }
    return isInside;
  }
}

function triangleArea2(p: Vector, q: Vector, s: Vector): number {
  return p.x * q.y - p.y * q.x + q.x * s.y - q.y * s.x + s.x * p.y - s.y * p.x;
}

function intersectTest(
  p1: Vector,
  p2: Vector,
  p3: Vector,
  p4: Vector
): boolean {
  const a1 = triangleArea2(p1, p2, p3);
  const a2 = triangleArea2(p2, p1, p4);
  const a3 = triangleArea2(p3, p4, p1);
  const a4 = triangleArea2(p4, p3, p2);
  if (Math.abs(a1 * a2 * a3 * a4) < 1e-6) return true;
  return a1 * a2 * a3 * a4 > 0;
}
