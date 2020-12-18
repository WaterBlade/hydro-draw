import {
  Arc,
  Arrow,
  Circle,
  CompositeItem,
  DrawItem,
  Line,
  Text,
} from "@/draw/drawItem";
import {
  last,
  RebarDiameter,
  RotateDirection,
  Side,
  TextAlign,
  vec,
  Vector,
} from "@/draw/misc";
import { Builder } from "../Builder.interface";

type SpecLength =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | -1
  | -2
  | -3
  | -4
  | -5
  | -6
  | -7
  | -8;

export abstract class RebarForm implements Builder<CompositeItem> {
  protected textHeight: number;
  protected numberHeight: number;
  protected arrowSize: number;
  protected hookRadius: number;

  protected pt = vec(0, 0);
  hooks: (Arc | Line)[] = [];
  notes: DrawItem[] = [];
  texts: Text[] = [];

  abstract get entities(): DrawItem[];

  constructor(public diameter: RebarDiameter, public baseUnit = 5) {
    this.textHeight = (3.5 / 5) * baseUnit;
    this.numberHeight = (2.5 / 5) * baseUnit;
    this.arrowSize = (0.5 / 5) * baseUnit;
    this.hookRadius = (0.2 / 5) * baseUnit;
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
    return this.totalLength;
  }

  protected totalLength = 0;
  protected addUp(length: number | number[]): void {
    if (typeof length === "number") {
      this.totalLength += length;
    } else {
      this.totalLength +=
        length.reduce((pre, cur) => pre + cur) / length.length;
    }
  }

  protected genHook(
    pt: Vector,
    norm: Vector,
    tangent: Vector,
    side: Side
  ): [Arc, Line] {
    this.addUp(6.25 * this.diameter);
    const r = 0.25 * this.numberHeight;
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
      return `${pre}${Math.round(length[0]).toFixed(
        fixed
      )}${suf}~${pre}${Math.round(last(length)).toFixed(fixed)}${suf}`;
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

export class RebarPathForm extends RebarForm {
  segments: (Arc | Line)[] = [];
  get entities(): DrawItem[] {
    return this.segments;
  }
  // generate rebar
  lineBy(x: SpecLength, y: SpecLength): this {
    const end = vec(x, y).mul(this.baseUnit).add(this.pt);
    this.segments.push(new Line(this.pt, end).thickLine());
    this.pt = end;
    return this;
  }
  arcBy(
    x: SpecLength,
    y: SpecLength,
    angle: number,
    direction = RotateDirection.counterclockwise
  ): this {
    const end = vec(x, y).mul(this.baseUnit).add(this.pt);
    this.segments.push(
      Arc.createByEnds(this.pt, end, angle, direction).thickLine()
    );
    this.pt = end;
    return this;
  }
  hook(option: { start?: Side; end?: Side }): this {
    const { start, end } = option;
    if (start === undefined && end === undefined) return this;
    if (start !== undefined) {
      const seg = this.segments[0];
      this.hooks.push(
        ...this.genHook(seg.start, seg.startNorm, seg.startTangent, start)
      );
    }
    if (end !== undefined) {
      const seg = last(this.segments);
      this.hooks.push(
        ...this.genHook(seg.end, seg.endNorm, seg.endTangent, end)
      );
    }
    return this;
  }

  // dim
  dimLength(length: number | number[], side = Side.Left): this {
    this.addUp(length);
    const content = this.genNumContent(length);
    const seg = last(this.segments);
    this.notes.push(this.genTextOnSeg(seg, content, side));
    return this;
  }
  dimArc(radius: number | number[], angle?: number): this {
    const arc = last(this.segments);
    if (!(arc instanceof Arc)) {
      throw Error("dim arc error: current item is not arc");
    }
    const mid = arc.mid;
    const c = arc.center;
    // line and arrow;
    const line = new Line(c, mid);
    this.notes.push(line, this.genArrow(mid, c));
    // radius;
    const content = this.genNumContent(radius, { prefix: "R" });
    this.notes.push(this.genTextOnSeg(line, content, Side.Left));
    // angle;
    if (angle) {
      this.notes.push(this.genTextOnSeg(line, `${angle}°`, Side.Right));
    }
    return this;
  }
  protected guideLine?: Line;
  guideLineBy(x: SpecLength, y: SpecLength): this {
    const end = vec(x, y).mul(this.baseUnit).add(this.pt);
    this.guideLine = new Line(this.pt, end);
    return this;
  }
  dimAngle(angle: number | number[]): this {
    const content = this.genNumContent(angle, { suffix: "°" });
    const pre = this.guideLine ? this.guideLine : this.segments.slice(-2)[0];
    const cur = this.segments.slice(-1)[0];
    if (!(pre instanceof Line) || !(cur instanceof Line)) {
      throw Error("dim angle error: last two element not Line");
    }
    const corner = pre.intersect(cur)[0];
    if (!corner) {
      throw Error("dim angle error: last two line is not contact");
    }
    const preEnd = corner.sub(pre.start).length() > 1e-6 ? pre.start : pre.end;
    const curEnd = corner.sub(cur.start).length() > 1e-6 ? cur.start : cur.end;

    const preVec = preEnd.sub(corner);
    const curVec = curEnd.sub(corner);
    const dir =
      preVec.cross(curVec) > 0
        ? RotateDirection.counterclockwise
        : RotateDirection.clockwise;

    if (this.guideLine) this.notes.push(this.guideLine);

    const arc = new Arc(
      corner,
      this.textHeight,
      preVec.quadrantAngle(),
      curVec.quadrantAngle(),
      dir
    );
    this.notes.push(arc, this.genTextOnSeg(arc, content));
    return this;
  }
}

export class RebarCircleForm extends RebarForm {
  get entities(): DrawItem[] {
    if (!this.circleItem) {
      throw Error("rebar spec error: entities is empty");
    }
    return [this.circleItem];
  }

  circleItem?: Circle;
  circle(dia: number | number[]): this {
    const r = 0.9 * this.baseUnit;
    const t = 0.25 * this.numberHeight;
    const h = 0.75 * this.numberHeight;
    this.circleItem = new Circle(vec(0, 0), r).thickLine();

    let len: number;
    if (typeof dia === "number") {
      len = Math.PI * dia;
      this.notes.push(
        new Text(
          this.genNumContent(dia, { prefix: "D" }),
          vec(0, t),
          h,
          TextAlign.BottomCenter
        )
      );
    } else {
      len = (dia.reduce((pre, cur) => pre + cur) * Math.PI) / dia.length;
      this.notes.push(
        new Text(
          this.genNumContent(dia[0], { prefix: "D" }),
          vec(0, t),
          h,
          TextAlign.BottomCenter
        ),
        new Text(
          this.genNumContent(last(dia), { prefix: "~D" }),
          vec(0, -t),
          h,
          TextAlign.TopCenter
        )
      );
    }

    this.addUp(len);
    this.notes.push(
      new Text(
        this.genNumContent(len),
        vec(r + t, 0),
        this.numberHeight,
        TextAlign.MiddleLeft
      ),
      new Line(vec(-r, 0), vec(r, 0)),
      this.genArrow(vec(-r, 0), vec(0, 0)),
      this.genArrow(vec(r, 0), vec(0, 0))
    );

    return this;
  }
}
