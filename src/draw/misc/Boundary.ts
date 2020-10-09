import { vec, Vector } from "./Vector";

export class Boundary {
  points: Vector[];
  constructor(...pts: Vector[]) {
    this.points = pts;
  }
  get RightMost(): number {
    return Math.max(...this.points.map((pt) => pt.x));
  }

  get LeftMost(): number {
    return Math.min(...this.points.map((pt) => pt.x));
  }

  isInside(p0: Vector): boolean {
    const p1 = vec(2 * this.RightMost - this.LeftMost, p0.y);
    let count = 0;
    const length = this.points.length;
    for (let i = 1; i <= length; i++) {
      const start = (i - 1) % length;
      const end = i % length;
      if (intersectTest(p0, p1, this.points[start], this.points[end])) {
        count++;
      }
    }
    return count % 2 === 1;
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
