import { BoundingBox } from "../BoundingBox";
import { Vector } from "../Vector";
import { DrawItem } from "./DrawItem";

export interface VisitCircle {
  visitCircle(circle: Circle, insertPoint: Vector): void;
}

export class Circle extends DrawItem {
  constructor(public center: Vector, public radius: number) {
    super();
  }
  accept(paper: VisitCircle, insertPoint: Vector): void {
    paper.visitCircle(this, insertPoint);
  }
  scale(factor: number): void {
    this.center = this.center.mul(factor);
    this.radius *= factor;
  }
  move(vec: Vector): void {
    this.center = this.center.add(vec);
  }
  getBoundingBox(): BoundingBox {
    const { x, y } = this.center;
    const r = this.radius;
    return new BoundingBox(x - r, x + r, y - r, y + r);
  }
}
