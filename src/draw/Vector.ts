import { toRadian } from "./Misc";

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
  length(): number {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }
  perpend(): Vector {
    return new Vector(-this.y, this.x);
  }
  unit(): Vector {
    const len = this.length();
    return new Vector(this.x / len, this.y / len);
  }
  eq(right: Vector): boolean {
    return this.x === right.x && this.y === right.y;
  }
  closeTo(right: Vector, digit: number): boolean {
    const delta = 0.1 ** digit;
    return (
      Math.abs(this.x - right.x) < delta && Math.abs(this.y - right.y) < delta
    );
  }
  toArray(): number[] {
    return [this.x, this.y];
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
