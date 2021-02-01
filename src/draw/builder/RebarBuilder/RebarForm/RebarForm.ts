import {
  Arc,
  Arrow,
  CompositeItem,
  DrawItem,
  Line,
  Text,
} from "@/draw/drawItem";
import {
  RebarDiameter,
  RotateDirection,
  Side,
  sum,
  TextAlign,
  vec,
  Vector,
} from "@/draw/misc";
import { Builder } from "../../Builder.interface";

export abstract class RebarForm implements Builder<CompositeItem> {
  protected textHeight: number;
  protected numberHeight: number;
  protected arrowSize: number;
  protected hookRadius: number;
  protected hookRadiusStep = 0.15;

  protected pt = vec(0, 0);
  hooks: (Arc | Line)[] = [];
  notes: DrawItem[] = [];
  texts: Text[] = [];

  abstract get entities(): DrawItem[];

  constructor(public diameter: RebarDiameter, public baseUnit = 5) {
    this.textHeight = (3.5 / 5) * baseUnit;
    this.numberHeight = (2.5 / 5) * baseUnit;
    this.arrowSize = (0.5 / 5) * baseUnit;
    this.hookRadius = this.hookRadiusStep * baseUnit;
  }

  generate(): CompositeItem {
    const c = new CompositeItem();
    c.push(...this.entities);
    c.push(...this.hooks);
    c.push(...this.notes);
    c.push(...this.texts);
    return c;
  }

  get length(): number {
    return this._length;
  }

  setLength(length: number): this {
    this._length = length;
    return this;
  }

  protected _length = 0;
  protected addUp(length: number | number[]): void {
    if (typeof length === "number") {
      this._length += length;
    } else {
      this._length += sum(...length) / length.length;
    }
  }

  protected genHook(
    pt: Vector,
    norm: Vector,
    tangent: Vector,
    side: Side
  ): [Arc, Line] {
    this.addUp(6.25 * this.diameter);
    const r = this.hookRadius;
    const dir = side === Side.Left ? 1 : -1;
    norm = norm.mul(dir * r);
    tangent = tangent.mul(r);
    const p1 = tangent.add(norm).unit().mul(r).add(pt).add(norm);
    const p2 = tangent
      .mul(-1)
      .add(norm)
      .unit()
      .mul(2 * r)
      .add(p1);
    const rDir =
      tangent.cross(norm) > 0
        ? RotateDirection.counterclockwise
        : RotateDirection.clockwise;
    return [
      Arc.createByEnds(pt, p1, 135, rDir).thickLine(),
      new Line(p1, p2).thickLine(),
    ];
  }

  protected genNumContent(
    length: number | number[],
    option: { prefix?: string; suffix?: string; precision?: number } = {}
  ): string {
    const { prefix, suffix, precision } = option;
    const pre = prefix ? prefix : "";
    const suf = suffix ? suffix : "";
    const fixed = precision ? precision : 0;
    if (typeof length === "number") {
      return `${pre}${Math.round(length).toFixed(fixed)}${suf}`;
    } else {
      const min = Math.min(...length);
      const max = Math.max(...length);
      return `${pre}${Math.round(min).toFixed(fixed)}${suf}~${pre}${Math.round(
        max
      ).toFixed(fixed)}${suf}`;
    }
  }

  protected genTextOnSeg(
    seg: Arc | Line,
    content: string,
    side = Side.Left
  ): Text {
    const mid = seg.mid;
    let pt: Vector, angle: number, align: TextAlign;
    if (seg instanceof Line) {
      const v = seg.end.sub(seg.start);
      const dir = side === Side.Left ? 1 : -1;
      pt = v
        .norm()
        .unit()
        .mul(0.25 * this.numberHeight * dir)
        .add(mid);
      angle = v.quadrantAngle();
      if (angle > 90 && angle <= 270) {
        align =
          side === Side.Left ? TextAlign.TopCenter : TextAlign.BottomCenter;
      } else {
        align =
          side === Side.Left ? TextAlign.BottomCenter : TextAlign.TopCenter;
      }
    } else {
      const n = mid.sub(seg.center);
      pt = n
        .unit()
        .mul(0.25 * this.numberHeight + seg.radius)
        .add(seg.center);
      angle = n.norm().quadrantAngle();
      if (Math.abs(n.y) < 1e-6) {
        align = n.x < 0 ? TextAlign.BottomCenter : TextAlign.TopCenter;
      } else if (n.y < 0) {
        align = TextAlign.TopCenter;
      } else {
        align = TextAlign.BottomCenter;
      }
    }
    if (angle > 90 && angle <= 270) angle = (angle + 180) % 360;
    return new Text(content, pt, this.numberHeight, align, angle);
  }
  protected genArrow(start: Vector, end: Vector): Arrow {
    return new Arrow(
      start,
      start.add(
        end
          .sub(start)
          .unit()
          .mul(this.arrowSize * 3)
      ),
      this.arrowSize
    );
  }

  // text
  text(content: string, side: Side, vertical = false): this {
    if (this.entities.length === 0) {
      throw Error("text error: segments empty");
    }
    const entities = this.notes.concat(this.entities, this.hooks);
    const box = entities
      .map((s) => s.getBoundingBox())
      .reduce((pre, cur) => pre.merge(cur));
    let align: TextAlign;
    const isLeft = side === Side.Left;
    if (vertical) {
      align = isLeft ? TextAlign.BottomCenter : TextAlign.TopCenter;
    } else {
      align = isLeft ? TextAlign.MiddleRight : TextAlign.MiddleLeft;
    }
    const d = (isLeft ? -0.25 : 0.25) * this.textHeight;
    const pt = isLeft ? box.MiddleLeft : box.MiddleRight;
    const angle = vertical ? 90 : 0;

    this.texts.push(
      new Text(content, pt.add(vec(d, 0)), this.textHeight, align, angle)
    );

    return this;
  }
}
