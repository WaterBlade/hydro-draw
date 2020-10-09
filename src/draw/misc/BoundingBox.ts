import { vec, Vector } from "./Vector";

export class BoundingBox {
  constructor(
    public left: number,
    public right: number,
    public bottom: number,
    public top: number
  ) {}

  static fromPoints(...pts: Vector[]): BoundingBox {
    const xs = pts.map((pt) => pt.x);
    const ys = pts.map((pt) => pt.y);
    return new BoundingBox(
      Math.min(...xs),
      Math.max(...xs),
      Math.min(...ys),
      Math.max(...ys)
    );
  }

  scale(factor: number): void {
    this.left *= factor;
    this.right *= factor;
    this.bottom *= factor;
    this.top *= factor;
  }

  move(vector: Vector): void {
    const { x, y } = vector;
    this.left += x;
    this.right += x;
    this.bottom += y;
    this.top += y;
  }

  merge(box: BoundingBox): BoundingBox {
    return new BoundingBox(
      Math.min(this.left, box.left),
      Math.max(this.right, box.right),
      Math.min(this.bottom, box.bottom),
      Math.max(this.top, box.top)
    );
  }

  get bottomLeft(): Vector {
    return vec(this.left, this.bottom);
  }
  get bottomRight(): Vector {
    return vec(this.right, this.bottom);
  }
  get bottomCenter(): Vector {
    return vec((this.left + this.right) / 2.0, this.bottom);
  }
  get topLeft(): Vector {
    return vec(this.left, this.top);
  }
  get topRight(): Vector {
    return vec(this.right, this.top);
  }
  get topCenter(): Vector {
    return vec((this.left + this.right) / 2.0, this.top);
  }
  get center(): Vector {
    return vec((this.left + this.right) / 2.0, (this.top + this.bottom) / 2.0);
  }
  get middleLeft(): Vector {
    return vec(this.left, (this.top + this.bottom) / 2.0);
  }
  get middleRight(): Vector {
    return vec(this.right, (this.top + this.bottom) / 2.0);
  }
  get width(): number {
    return this.right - this.left;
  }
  get height(): number {
    return this.top - this.bottom;
  }
}
