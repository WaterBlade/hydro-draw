import { BoundingBox } from "../BoundingBox";
import { RotateDirection } from "../RotateDirection";
import { polar, Vector } from "../Vector";
import { DrawItem } from "./DrawItem";

export interface VisitArc {
  visitArc(arc: Arc, insertPoint: Vector): void;
}

export class Arc extends DrawItem {
  constructor(
    public center: Vector,
    public radius: number,
    public startAngle: number,
    public endAngle: number,
    public direction = RotateDirection.counterclockwise
  ) {
    super();
  }
  accept(paper: VisitArc, insertPoint: Vector): void {
    paper.visitArc(this, insertPoint);
  }
  scale(factor: number): void {
    this.center = this.center.mul(factor);
    this.radius *= factor;
  }
  move(vector: Vector): void {
    this.center = this.center.add(vector);
  }
  getBoundingBox(): BoundingBox {
    const { x, y } = this.center;
    const pt1 = polar(this.radius, this.startAngle).add(this.center);
    const pt2 = polar(this.radius, this.endAngle).add(this.center);
    let left = Math.min(pt1.x, pt2.x);
    let right = Math.max(pt1.x, pt2.x);
    let bottom = Math.min(pt1.y, pt2.y);
    let top = Math.max(pt1.y, pt2.y);

    const isCounter = this.direction === RotateDirection.counterclockwise;
    const start = isCounter ? this.startAngle : this.endAngle;
    const end = isCounter ? this.endAngle : this.startAngle;

    if (start > end) {
      right = x + this.radius;
    }
    if (start <= 90 && 90 <= end) {
      top = y + this.radius;
    }
    if (start <= 180 && 180 <= end) {
      left = x - this.radius;
    }
    if (start <= 270 && 270 <= end) {
      bottom = y - this.radius;
    }

    return new BoundingBox(left, right, bottom, top);
  }
}
