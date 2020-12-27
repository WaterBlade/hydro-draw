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
  protected scaleItem(factor: number): void {
    this.start = this.start.mul(factor);
    this.end = this.end.mul(factor);
    this.width *= factor;
  }
  protected moveItem(vector: Vector): void {
    this.start = this.start.add(vector);
    this.end = this.end.add(vector);
  }
  calcBoundingBox(): BoundingBox {
    return BoundingBox.fromPoints(this.start, this.end);
  }
}
