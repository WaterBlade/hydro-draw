import { DrawItem } from "./DrawItem";
import {
  Vector,
  BoundingBox,
  vec,
  toRadian,
  TextAlign,
  polar,
  angleMirrorByVAxis,
  angleMirrorByHAxis,
} from "@/draw/misc";
import { Paper, PaperText } from "./Paper.interface";
import { Content } from "./Content";

export class TextDraw extends DrawItem implements PaperText {
  public content;
  constructor(
    content: string | Content,
    public insertPoint: Vector,
    public height: number,
    public textAlign = TextAlign.BottomLeft,
    public rotateAngle = 0,
    public widthFactor = 1
  ) {
    super();
    if (typeof content === "string") {
      this.content = new Content().text(content);
    } else {
      this.content = content;
    }
  }
  static properVector(v: Vector): Vector {
    return polar(1, TextDraw.properAngle(v.quadrantAngle()));
  }
  static properAngle(angle: number): number {
    if (angle > 90 && angle <= 270) return (angle + 180) % 360;
    return angle % 360;
  }
  static properAlign(angle: number, align: TextAlign): TextAlign {
    if (angle > 90 && angle <= 270) {
      switch (align) {
        case TextAlign.BottomRight:
          return TextAlign.BottomLeft;
        case TextAlign.BottomLeft:
          return TextAlign.BottomRight;
        case TextAlign.BottomCenter:
          return TextAlign.BottomCenter;
        case TextAlign.TopRight:
          return TextAlign.TopLeft;
        case TextAlign.TopLeft:
          return TextAlign.TopRight;
        case TextAlign.TopCenter:
          return TextAlign.TopCenter;
        case TextAlign.MiddleRight:
          return TextAlign.MiddleLeft;
        case TextAlign.MiddleLeft:
          return TextAlign.MiddleRight;
        case TextAlign.MiddleCenter:
          return TextAlign.MiddleCenter;
      }
    }
    return align;
  }
  accept(paper: Paper): void {
    paper.visitText(this);
  }
  mirrorByVAxis(x = 0): TextDraw {
    const insertPoint = this.insertPoint.mirrorByVAxis(x);
    const angle = angleMirrorByVAxis(this.rotateAngle);
    const t = new TextDraw(
      this.content,
      insertPoint,
      this.height,
      TextDraw.properAlign(angle, this.textAlign),
      TextDraw.properAngle(angle)
    );
    t.lineType = this.lineType;
    return t;
  }
  mirrorByHAxis(y = 0): TextDraw {
    const insertPoint = this.insertPoint.mirrorByHAxis(y);
    const angle = angleMirrorByHAxis(this.rotateAngle);
    const t = new TextDraw(
      this.content,
      insertPoint,
      this.height,
      TextDraw.properAlign(angle, this.textAlign),
      TextDraw.properAngle(angle)
    );
    t.lineType = this.lineType;
    return t;
  }
  protected scaleItem(factor: number): void {
    this.insertPoint = this.insertPoint.mul(factor);
    this.height *= factor;
  }
  protected moveItem(vec: Vector): void {
    this.insertPoint = this.insertPoint.add(vec);
  }
  calcBoundingBox(): BoundingBox {
    const l = Math.max(1, this.content.length) * this.height * this.widthFactor;
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
