import { toDegree, toRadian } from "./Misc";

export class Vector {
  constructor(public x: number, public y: number) {
    if (x === undefined) throw Error("x is undefined");
    if (y === undefined) throw Error("y is undefined");
  }
  toFixed(digit: number): string {
    return this.x.toFixed(digit) + "," + this.y.toFixed(digit);
  }
  add(right: Vector): Vector {
    return new Vector(this.x + right.x, this.y + right.y);
  }
  sub(right: Vector): Vector {
    return new Vector(this.x - right.x, this.y - right.y);
  }
  mul(factor: number): Vector {
    return new Vector(factor * this.x, factor * this.y);
  }
  dot(right: Vector): number {
    return this.x * right.x + this.y * right.y;
  }
  cross(right: Vector): number {
    return this.x * right.y - this.y * right.x;
  }
  length(): number {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }
  norm(): Vector {
    return new Vector(-this.y, this.x);
  }
  unit(): Vector {
    const len = this.length();
    if (len === 0) {
      throw Error("error: zero vector");
    }
    return new Vector(this.x / len, this.y / len);
  }
  mirrorByVAxis(x = 0): Vector {
    return new Vector(2 * x - this.x, this.y);
  }
  mirrorByHAxis(y=0): Vector{
    return new Vector(this.x, 2*y - this.y);
  }
  rotate(angle: number): Vector {
    // counterclockwise rotate
    const rad = toRadian(angle);
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    const { x, y } = this;
    return new Vector(x * cos - y * sin, x * sin + y * cos);
  }
  quadrantAngle(): number {
    const angle = toDegree(Math.acos(this.x / this.length()));
    if (this.y >= 0) return angle;
    return 360 - angle;
  }
  eq(right: Vector): boolean {
    return this.x === right.x && this.y === right.y;
  }
  closeTo(right: Vector, delta: number): boolean {
    return (
      Math.abs(this.x - right.x) < delta && Math.abs(this.y - right.y) < delta
    );
  }
  scaleBy(pt: Vector, xFactor: number, yFactor?: number): Vector {
    yFactor = yFactor !== undefined ? yFactor : xFactor;
    const x = pt.x + xFactor * (this.x - pt.x);
    const y = pt.y + yFactor * (this.y - pt.y);
    return new Vector(x, y);
  }
}

export function vec(x: number, y: number): Vector {
  return new Vector(x, y);
}

export function polar(dist: number, degree: number): Vector {
  const x = dist * Math.cos(toRadian(degree));
  const y = dist * Math.sin(toRadian(degree));
  return new Vector(x, y);
}

export function toLeftTest(p: Vector, q: Vector, s: Vector): boolean {
  return (
    p.x * q.y - p.y * q.x + q.x * s.y - q.y * s.x + s.x * p.y - s.y * p.x > 0
  );
}
