import { Vector, BoundingBox } from "@/draw/misc";
import { DrawItem } from "./DrawItem";
import { Paper, PaperDimAligned } from "./Paper.interface";

export class DimAligned extends DrawItem implements PaperDimAligned {
  borderScale: number;
  constructor(
    public start: Vector,
    public end: Vector,
    public textPoint: Vector,
    public unitScale: number,
    public drawScale: number,
    public override?: string
  ) {
    super();
    this.borderScale = this.drawScale;
  }
  accept(paper: Paper, insertPoint: Vector): void {
    paper.visitDimAligned(this, insertPoint);
  }
  scale(factor: number): void {
    this.start = this.start.mul(factor);
    this.end = this.end.mul(factor);
    this.textPoint = this.textPoint.mul(factor);
    this.borderScale *= factor;
  }
  move(vec: Vector): void {
    this.start = this.start.add(vec);
    this.end = this.end.add(vec);
    this.textPoint = this.textPoint.add(vec);
  }
  getBoundingBox(): BoundingBox {
    const xs = [this.start.x, this.end.x, this.textPoint.x];
    const ys = [this.start.y, this.end.y, this.textPoint.y];

    const { x: xc, y: yc } = this.textPoint;

    const dir = this.end
      .sub(this.start)
      .norm()
      .unit()
      .mul((this.borderScale / this.unitScale) * 3);

    if (dir.y > 0) {
      xs.push(xc + dir.x);
      ys.push(yc + dir.y);
    } else if (dir.y < 0) {
      xs.push(xc - dir.x);
      ys.push(yc - dir.y);
    } else {
      xs.push(xc + Math.abs(dir.x));
    }

    return new BoundingBox(
      Math.min(...xs),
      Math.max(...xs),
      Math.min(...ys),
      Math.max(...ys)
    );
  }
}
