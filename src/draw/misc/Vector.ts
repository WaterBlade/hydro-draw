import { toDegree, toRadian } from "./Misc";

export class Vector {
  constructor(public x: number, public y: number) {}
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
