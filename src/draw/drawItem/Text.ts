import { DrawItem } from "./DrawItem";
import { TextAlign } from "../TextAlign";
import { Vector, BoundingBox, vec, toRadian } from "../misc";

export interface VisitText {
  visitText(text: Text, insertPoint: Vector): void;
}

export class Text extends DrawItem {
  constructor(
    public content: string,
    public insertPoint: Vector,
    public height: number,
    public textAlign = TextAlign.LeftBottom,
    public rotateAngle = 0
  ) {
    super();
  }
  accept(paper: VisitText, insertPoint: Vector): void {
    paper.visitText(this, insertPoint);
  }
  scale(factor: number): void {
    this.insertPoint = this.insertPoint.mul(factor);
    this.height *= factor;
  }
  move(vec: Vector): void {
    this.insertPoint = this.insertPoint.add(vec);
  }
  getBoundingBox(): BoundingBox {
    const l = this.content.length * this.height;
    const h = this.height;

    const b = this.insertPoint;

    const v = vec(
      l * Math.cos(toRadian(this.rotateAngle)),
      l * Math.sin(toRadian(this.rotateAngle))
    );
    const v2 = v.mul(0.5);

    const n = v.perpend().unit().mul(h);
    const n2 = n.mul(0.5);

    const corners: Vector[] = [];
    switch (this.textAlign) {
      case TextAlign.LeftBottom:
        corners.push(b, b.add(v), b.add(n), b.add(v).add(n));
        break;
      case TextAlign.RightBottom:
        corners.push(b, b.sub(v), b.add(n), b.sub(v).add(n));
        break;
      case TextAlign.MiddleBottom:
        corners.push(b.add(v2), b.sub(v2), b.add(v2).add(n), b.sub(v2).add(n));
        break;
      case TextAlign.LeftTop:
        corners.push(b, b.add(v), b.sub(n), b.add(v).sub(n));
        break;
      case TextAlign.RightTop:
        corners.push(b, b.sub(v), b.sub(n), b.sub(v).sub(n));
        break;
      case TextAlign.MiddleTop:
        corners.push(b.add(v2), b.sub(v2), b.add(v2).sub(n), b.sub(v2).sub(n));
        break;
      case TextAlign.LeftCenter:
        corners.push(b.add(n2), b.sub(n2), b.add(n2).add(v), b.sub(n2).add(v));
        break;
      case TextAlign.RightCenter:
        corners.push(b.add(n2), b.sub(n2), b.add(n2).sub(v), b.sub(n2).sub(v));
        break;
      case TextAlign.MiddleCenter:
        corners.push(
          b.add(n2).add(v2),
          b.sub(n2).add(v2),
          b.add(n2).sub(v2),
          b.sub(n2).sub(v2)
        );
        break;
    }

    return BoundingBox.fromPoints(...corners);
  }
}
