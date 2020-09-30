import { DrawItem } from "./DrawItem";
import { Vector } from "../Vector";
import { BoundingBox } from "../BoundingBox";

export interface VisitLine {
  visitLine(line: Line, insertPoint: Vector): void;
}

export class Line extends DrawItem {
  constructor(public start: Vector, public end: Vector) {
    super();
  }
  accept(paper: VisitLine, insertPoint: Vector): void {
    paper.visitLine(this, insertPoint);
  }
  scale(factor: number): void {
    this.start = this.start.mul(factor);
    this.end = this.end.mul(factor);
  }
  move(vec: Vector): void {
    this.start = this.start.add(vec);
    this.end = this.end.add(vec);
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
