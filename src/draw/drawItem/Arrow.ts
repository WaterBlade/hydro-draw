import { Vector, BoundingBox } from "@/draw/misc";
import { DrawItem } from "./DrawItem";
import { Paper, PaperArrow } from "./Paper.interface";

export class Arrow extends DrawItem implements PaperArrow {
  constructor(public start: Vector, public end: Vector, public width: number) {
    super();
  }
  accept(paper: Paper, insertPoint: Vector): void {
    paper.visitArrow(this, insertPoint);
  }
  scale(factor: number): void {
    this.start = this.start.mul(factor);
    this.end = this.end.mul(factor);
    this.width *= factor;
  }
  move(vector: Vector): void {
    this.start = this.start.add(vector);
    this.end = this.end.add(vector);
  }
  getBoundingBox(): BoundingBox {
    const { x: x1, y: y1 } = this.start;
    const { x: x2, y: y2 } = this.end;
    return new BoundingBox(
      Math.min(x1, x2),
      Math.max(x1, x2),
      Math.min(y1, y2),
      Math.max(y1, y2)
    );
  }
}
