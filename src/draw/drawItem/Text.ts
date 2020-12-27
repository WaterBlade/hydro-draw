import { DrawItem } from "./DrawItem";
import {
  Vector,
  BoundingBox,
  vec,
  toRadian,
  TextAlign,
  polar,
} from "@/draw/misc";
import { Paper, PaperText } from "./Paper.interface";
import { Content } from "./Content";

export class Text extends DrawItem implements PaperText {
  public content;
  constructor(
    content: string | Content,
    public insertPoint: Vector,
    public height: number,
    public textAlign = TextAlign.BottomLeft,
    public rotateAngle = 0
  ) {
    super();
    if (typeof content === "string") {
      this.content = new Content().text(content);
    } else {
      this.content = content;
    }
  }
  static properVector(v: Vector): Vector {
    return polar(1, Text.properAngle(v.quadrantAngle()));
  }
  static properAngle(angle: number): number {
    if (angle > 90 && angle <= 270) return (angle + 180) % 360;
    return angle;
  }
  static properAlign(angle: number, align: TextAlign): TextAlign {
    if (angle > 90 && angle <= 270) {
      switch (align) {
        case TextAlign.BottomRight:
          return TextAlign.BottomLeft;
          break;
        case TextAlign.BottomLeft:
          return TextAlign.BottomRight;
          break;
        case TextAlign.BottomCenter:
          return TextAlign.BottomCenter;
          break;
        case TextAlign.TopRight:
          return TextAlign.TopLeft;
          break;
        case TextAlign.TopLeft:
          return TextAlign.TopRight;
          break;
        case TextAlign.TopCenter:
          return TextAlign.TopCenter;
          break;
        case TextAlign.MiddleRight:
          return TextAlign.MiddleLeft;
          break;
        case TextAlign.MiddleLeft:
          return TextAlign.MiddleRight;
          break;
        case TextAlign.MiddleCenter:
          return TextAlign.MiddleCenter;
          break;
      }
    }
    return align;
  }
  accept(paper: Paper, insertPoint: Vector): void {
    paper.visitText(this, insertPoint);
  }
  protected scaleItem(factor: number): void {
    this.insertPoint = this.insertPoint.mul(factor);
    this.height *= factor;
  }
  protected moveItem(vec: Vector): void {
    this.insertPoint = this.insertPoint.add(vec);
  }
  calcBoundingBox(): BoundingBox {
    const l = Math.max(1, this.content.length) * this.height;
    const h = this.height;

    const b = this.insertPoint;

    const v = vec(
      l * Math.cos(toRadian(this.rotateAngle)),
      l * Math.sin(toRadian(this.rotateAngle))
    );
    const v2 = v.mul(0.5);

    const n = v.norm().unit().mul(h);
    const n2 = n.mul(0.5);

    const corners: Vector[] = [];
    switch (this.textAlign) {
      case TextAlign.BottomLeft:
        corners.push(b, b.add(v), b.add(n), b.add(v).add(n));
        break;
      case TextAlign.BottomRight:
        corners.push(b, b.sub(v), b.add(n), b.sub(v).add(n));
        break;
      case TextAlign.BottomCenter:
        corners.push(b.add(v2), b.sub(v2), b.add(v2).add(n), b.sub(v2).add(n));
        break;
      case TextAlign.TopLeft:
        corners.push(b, b.add(v), b.sub(n), b.add(v).sub(n));
        break;
      case TextAlign.TopRight:
        corners.push(b, b.sub(v), b.sub(n), b.sub(v).sub(n));
        break;
      case TextAlign.TopCenter:
        corners.push(b.add(v2), b.sub(v2), b.add(v2).sub(n), b.sub(v2).sub(n));
        break;
      case TextAlign.MiddleLeft:
        corners.push(b.add(n2), b.sub(n2), b.add(n2).add(v), b.sub(n2).add(v));
        break;
      case TextAlign.MiddleRight:
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
