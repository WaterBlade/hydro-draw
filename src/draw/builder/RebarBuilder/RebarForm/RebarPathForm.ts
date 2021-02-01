import { Arc, DrawItem, Line, Text } from "@/draw/drawItem";
import { last, RotateDirection, Side, TextAlign, vec } from "@/draw/misc";
import { RebarForm } from "./RebarForm";

export class RebarPathForm extends RebarForm {
  segments: (Arc | Line)[] = [];
  get entities(): DrawItem[] {
    return this.segments;
  }
  // generate rebar
  lineBy(x: number, y: number): this {
    if (Math.abs(x) > 8 || Math.abs(y) > 8) throw Error("tow large x or y");
    const end = vec(x, y).mul(this.baseUnit).add(this.pt);
    this.segments.push(new Line(this.pt, end).thickLine());
    this.pt = end;
    return this;
  }
  arcBy(
    x: number,
    y: number,
    angle: number,
    direction = RotateDirection.counterclockwise
  ): this {
    if (Math.abs(x) > 8 || Math.abs(y) > 8) throw Error("tow large x or y");
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
    if (length === undefined) throw Error("length is undefined");
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
      this.notes.push(
        this.genTextOnSeg(line, `${angle.toFixed(2)}°`, Side.Right)
      );
    }
    return this;
  }
  dimVector(x: number, y: number, side = Side.Left): this {
    const line = last(this.segments);
    if (!(line instanceof Line)) {
      throw Error("dim vector error: current item is not line");
    }
    const dir = line.end.sub(line.start).unit();
    const norm = dir.norm().mul(side === Side.Left ? 1 : -1);
    const mid = line.mid.add(norm.mul(0.5));

    const den = Math.min(Math.abs(dir.x), Math.abs(dir.y));
    if (den < 1e-6) throw Error("zero denomitor");
    const factor = this.numberHeight / den;
    const v = dir.mul(factor * 0.5);
    const p0 = mid.add(v);
    const p1 = mid.sub(v);

    const px = norm.x > 0 ? Math.max(p0.x, p1.x) : Math.min(p0.x, p1.x);
    const py = norm.y > 0 ? Math.max(p0.y, p1.y) : Math.min(p0.y, p1.y);

    const p2 = vec(px, py);

    const dx = norm.x > 0 ? 0.2 * this.numberHeight : -0.2 * this.numberHeight;

    this.notes.push(
      new Line(p0, p1),
      new Line(p1, p2),
      new Line(p2, p0),
      new Text(
        `${y}`,
        vec(px + dx, mid.y),
        0.8 * this.numberHeight,
        norm.x > 0 ? TextAlign.MiddleLeft : TextAlign.MiddleRight
      ),
      new Text(
        `${x}`,
        vec(mid.x, py),
        0.8 * this.numberHeight,
        norm.y > 0 ? TextAlign.BottomCenter : TextAlign.TopCenter
      )
    );

    return this;
  }
  protected guideLine?: Line;
  guideLineBy(x: number, y: number): this {
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
