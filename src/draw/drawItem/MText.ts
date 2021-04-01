import { BoundingBox, Vector } from "@/draw/misc";
import { DrawItem } from "./DrawItem";
import { Paper, PaperMText } from "./Paper.interface";

export class MText extends DrawItem implements PaperMText {
  protected rowSpaceFactor = 2;
  constructor(
    public content: string[],
    public insertPoint: Vector,
    public height: number,
    public maxWidth: number,
    public widthFactor = 1
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
      0,
      ...this.content.map((c) => c.length * this.height * this.widthFactor)
    );
  }
  accept(paper: Paper): void {
    paper.visitMText(this);
  }
  mirrorByVAxis(x = 0): MText {
    const insertPoint = this.insertPoint.mirrorByVAxis(x);
    const mt = new MText(this.content, insertPoint, this.height, this.maxWidth);
    mt.lineType = this.lineType;
    return mt;
  }
  mirrorByHAxis(x = 0): MText {
    const insertPoint = this.insertPoint.mirrorByHAxis(x);
    const mt = new MText(this.content, insertPoint, this.height, this.maxWidth);
    mt.lineType = this.lineType;
    return mt;
  }
  protected scaleItem(factor: number): void {
    this.insertPoint = this.insertPoint.mul(factor);
    this.height *= factor;
    this.maxWidth *= factor;
  }
  protected moveItem(vector: Vector): void {
    this.insertPoint = this.insertPoint.add(vector);
  }
  calcBoundingBox(): BoundingBox {
    const { x, y } = this.insertPoint;
    const w = this.width;
    const n = this.content.reduce((pre, cur) => {
      return pre + Math.ceil((cur.length * this.height * this.widthFactor) / w);
    }, 0);
    const h = this.height * this.rowSpaceFactor * n;
    return new BoundingBox(x, x + w, y - h, y);
  }
}
