import { last, sum } from "@/draw";

export class PosGen {
  dots: number[] = [];
  dot(...dots: number[]): this {
    this.dots.push(...dots);
    return this;
  }
  find(pt: number): number {
    if (this.dots.length === 0) {
      return pt;
    }
    if (pt < this.dots[0] || pt > last(this.dots)) return pt;
    let i = 0;
    while (this.dots[i] < pt) {
      i++;
    }
    return (this.dots[i - 1] + this.dots[i]) / 2;
  }
  get head(): number {
    return (this.dots[0] + this.dots[1]) / 2;
  }
  get tail(): number {
    return sum(...this.dots.slice(-2)) / 2;
  }
}

export class SpaceGen {
  protected spaces: Space[] = [];
  protected dots: number[] = [];
  left = 0;
  right = 0;
  set(left: number, right: number): this {
    this.left = left;
    this.right = right;
    this.spaces = [new Space(left, right)];
    this.dots = [];
    return this;
  }
  dot(...dots: number[]): this {
    this.dots.push(...dots);
    return this;
  }
  occupy(left: number, right: number): this {
    const res: Space[] = [];
    for (const i of this.spaces) {
      if (i.overlapTest(left, right)) {
        if (left > i.left) {
          res.push(new Space(i.left, left));
        }
        if (right < i.right) {
          res.push(new Space(right, i.right));
        }
      } else {
        res.push(i);
      }
    }
    this.spaces = res;
    return this;
  }
  find(size: number): Space | void {
    for (const i of this.spaces) {
      if (i.space > size) {
        this.occupy(i.left, i.left + size);
        return new Space(i.left, i.left + size);
      }
    }
  }
  findR(size: number): Space | void {
    for (let i = this.spaces.length - 1; i >= 0; i--) {
      const d = this.spaces[i];
      if (d.space > size) {
        this.occupy(d.right - size, d.right);
        return new Space(d.right - size, d.right);
      }
    }
  }
}

class Space {
  constructor(public left: number, public right: number) {}
  overlapTest(left: number, right: number): boolean {
    if (left >= this.right || right < this.left) return false;
    return true;
  }
  get space(): number {
    return this.right - this.left;
  }
  get mid(): number {
    return (this.left + this.right) / 2;
  }
}
