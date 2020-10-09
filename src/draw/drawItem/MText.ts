import { BoundingBox, Vector } from "../misc";
import { DrawItem } from "./DrawItem";

export interface VisitMText {
  visitMText(mtext: MText, insertPoint: Vector): void;
}

export class MText extends DrawItem {
  protected widthFactor = 0.7;
  protected rowSpaceFactor = 1.5;
  constructor(
    public content: string[],
    public insertPoint: Vector,
    public height: number,
    public maxWidth: number
  ) {
    super();
  }
  get rowSpace(): number {
    return this.rowSpaceFactor * this.height;
  }
  get width(): number {
    return Math.min(this.maxWidth, this.getMaxContentWidth());
  }
  getMaxContentWidth(): number {
    return Math.max(
      ...this.content.map((c) => c.length * this.height * this.widthFactor)
    );
  }
  accept(paper: VisitMText, insertPoint: Vector): void {
    paper.visitMText(this, insertPoint);
  }
  scale(factor: number): void {
    this.insertPoint = this.insertPoint.mul(factor);
    this.height *= factor;
    this.maxWidth *= factor;
  }
  move(vector: Vector): void {
    this.insertPoint = this.insertPoint.add(vector);
  }
  getBoundingBox(): BoundingBox {
    const { x, y } = this.insertPoint;
    const w = this.width;
    const n = this.content.reduce((pre, cur) => {
      return pre + Math.ceil((cur.length * this.height * this.widthFactor) / w);
    }, 0);
    const h = this.height * this.rowSpaceFactor * n;
    return new BoundingBox(x, x + w, y - h, y);
  }
}