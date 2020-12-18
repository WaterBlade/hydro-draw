import { vec, Vector } from "./Vector";

export class Pos {
  points: Vector[] = [];
  constructor(x: number, y: number) {
    this.points.push(vec(x, y));
  }

  get cur(): Vector {
    return this.points.slice(-1)[0];
  }

  get pre(): Vector {
    if (this.points.length === 1) {
      return this.cur;
    }
    return this.points.slice(-2)[0];
  }

  last(index: number): Vector {
    if (this.points.length < index) {
      throw Error("location points length is less than index");
    }

    return this.points.slice(-index)[0];
  }
  to(x: number, y: number): this {
    this.points.push(vec(x, y));
    return this;
  }
  by(x: number, y: number): this {
    this.points.push(this.cur.add(vec(x, y)));
    return this;
  }
  left(dist: number): this {
    return this.by(-dist, 0);
  }
  right(dist: number): this {
    return this.by(dist, 0);
  }
  up(dist: number): this {
    return this.by(0, dist);
  }
  down(dist: number): this {
    return this.by(0, -dist);
  }
}
