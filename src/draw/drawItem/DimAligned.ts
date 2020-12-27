import { Vector, BoundingBox } from "@/draw/misc";
import { Content } from "./Content";
import { DrawItem } from "./DrawItem";
import { Paper, PaperDimAligned } from "./Paper.interface";

export class DimAligned extends DrawItem implements PaperDimAligned {
  borderScale: number;
  override?: Content;
  constructor(
    public start: Vector,
    public end: Vector,
    public textPoint: Vector,
    public unitScale: number,
    public drawScale: number,
    override?: string | Content
  ) {
    super();
    this.borderScale = this.drawScale;
    if (typeof override === "string") {
      this.override = new Content().text(override);
    } else {
      this.override = override;
    }
  }
  accept(paper: Paper, insertPoint: Vector): void {
    paper.visitDimAligned(this, insertPoint);
  }
  protected scaleItem(factor: number): void {
    this.start = this.start.mul(factor);
    this.end = this.end.mul(factor);
    this.textPoint = this.textPoint.mul(factor);
    this.borderScale *= factor;
  }
  protected moveItem(vec: Vector): void {
    this.start = this.start.add(vec);
    this.end = this.end.add(vec);
    this.textPoint = this.textPoint.add(vec);
  }
  calcBoundingBox(): BoundingBox {
    const xs = [this.start.x, this.end.x, this.textPoint.x];
    const ys = [this.start.y, this.end.y, this.textPoint.y];

    const v0 = this.end.sub(this.start).unit();
    const v1 = this.textPoint.sub(this.start);

    const ptOnV = v0.mul(v0.dot(v1));
    const v2 = v1.sub(ptOnV);
    const mid = this.start.add(this.end).mul(0.5);
    const textV = v2.unit().mul((this.borderScale / this.unitScale) * 3);
    const pt = mid.add(v2).add(textV);
    xs.push(pt.x);
    ys.push(pt.y);

    return new BoundingBox(
      Math.min(...xs),
      Math.max(...xs),
      Math.min(...ys),
      Math.max(...ys)
    );
  }
}
