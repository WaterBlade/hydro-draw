import {
  BoundingBox,
  last,
  LineType,
  removeDuplicate,
  RotateDirection,
  Side,
  StrecthSide,
  vec,
  Vector,
} from "@/draw/misc";
import { DrawItem } from "../DrawItem";
import { Paper } from "../Paper.interface";
import { Arc } from "./Arc";
import {
  ArcGeometry,
  CircleGeometry,
  Geometry,
  LineGeometry,
  PolylineGeometry,
  PolylineSegment,
} from "./Geometry";
import { Line } from "./Line";
import { offsetJoint } from "./OffsetPoint.function";

export class Polyline extends DrawItem implements PolylineGeometry {
  segments: (Arc | Line)[] = [];
  protected closed = false;
  public current: Vector;
  constructor(x = 0, y = 0) {
    super();
    this.current = vec(x, y);
  }
  get start(): Vector {
    return this.segments[0].start;
  }
  get end(): Vector {
    return last(this.segments).end;
  }
  get lengths(): number[] {
    return this.segments.map((s) => s.calcLength());
  }
  prepend(seg: Line | Arc | Polyline): Polyline {
    const p = new Polyline();
    if (!seg.end.closeTo(this.start, 1e-6)) {
      throw Error("cannot prepend to polyline");
    }
    if (seg instanceof Polyline) {
      p.segments.push(...seg.segments, ...this.segments);
    } else {
      p.segments.push(seg, ...this.segments);
    }
    return p;
  }
  append(seg: Line | Arc | Polyline): Polyline {
    const p = new Polyline();
    if (!seg.start.closeTo(this.end, 1e-6)) {
      throw Error("cannot prepend to polyline");
    }
    if (seg instanceof Polyline) {
      p.segments.push(...this.segments, ...seg.segments);
    } else {
      p.segments.push(...this.segments, seg);
    }
    return p;
  }
  moveTo(x: number, y: number): this {
    if (this.segments.length > 0) throw Error("move to forbidden");
    this.current = vec(x, y);
    return this;
  }
  close(): this {
    this.closed = true;
    this.segments.push(new Line(this.current, this.segments[0].start));
    return this;
  }
  lineTo(x: number, y: number): this {
    const pt = vec(x, y);
    const l = new Line(this.current, pt);
    this.segments.push(l);
    this.current = pt;
    if (this._boundingBox) this._boundingBox.merge(l.getBoundingBox());
    return this;
  }
  lineBy(x: number, y: number): this {
    const { x: x0, y: y0 } = this.current;
    return this.lineTo(x0 + x, y0 + y);
  }
  arcTo(
    x: number,
    y: number,
    angle: number,
    direction = RotateDirection.counterclockwise
  ): this {
    const pt = vec(x, y);
    const arc = Arc.createByEnds(this.current, pt, angle, direction);
    this.segments.push(arc);
    this.current = pt;
    if (this._boundingBox)
      this._boundingBox = this._boundingBox.merge(arc.getBoundingBox());
    return this;
  }
  arcBy(
    x: number,
    y: number,
    angle: number,
    direciton = RotateDirection.counterclockwise
  ): this {
    const { x: x0, y: y0 } = this.current;
    return this.arcTo(x + x0, y + y0, angle, direciton);
  }
  mirrorByVAxis(x = 0): Polyline {
    const p = new Polyline();
    p.segments = this.segments.map((s) => s.mirrorByVAxis(x));
    p.lineType = this.lineType;
    p.closed = this.closed;
    return p;
  }
  removeStart(): this {
    this.segments.shift();
    return this;
  }
  removeEnd(): this {
    this.segments.pop();
    return this;
  }
  removeBothPt(): this {
    this.removeStartPt();
    this.removeEndPt();
    return this;
  }
  removeStartPt(): this {
    this.segments[0].points.shift();
    return this;
  }
  removeEndPt(): this {
    last(this.segments).points.pop();
    return this;
  }
  calcLength(): number {
    return this.segments
      .map((s) => s.calcLength())
      .reduce((pre, cur) => pre + cur);
  }
  includeTest(pt: Vector): boolean {
    for (const seg of this.segments) {
      if (seg.includeTest(pt)) return true;
    }
    return false;
  }
  resetStart(pt: Vector): this {
    this.segments[0].resetStart(pt);
    return this;
  }
  resetEnd(pt: Vector): this {
    last(this.segments).resetEnd(pt);
    return this;
  }
  distanceTo(pt: Vector): number {
    return Math.min(...this.segments.map((s) => s.distanceTo(pt)));
  }
  getNearestPt(pt: Vector): Vector {
    const segs = this.segments;
    let nearPt = segs[0].getNearestPt(pt);
    let nearDist = nearPt.sub(pt).length();
    for (let i = 1; i < segs.length; i++) {
      const p = segs[i].getNearestPt(pt);
      const d = p.sub(pt).length();
      if (d < nearDist) {
        nearPt = p;
        nearDist = d;
      }
    }
    return nearPt;
  }
  getNearestSegment(pt: Vector): PolylineSegment {
    const segs = this.segments;
    let nearSeg = segs[0];
    let nearDist = nearSeg.distanceTo(pt);
    for (let i = 1; i < segs.length; i++) {
      const seg = segs[i];
      const d = seg.distanceTo(pt);
      if (d < nearDist) {
        nearSeg = seg;
        nearDist = d;
      }
    }
    return nearSeg;
  }

  offset(dist: number, side = Side.Left): Polyline {
    const p = new Polyline();
    const len = this.segments.length;
    if (len === 1) {
      p.segments.push(this.segments[0].offset(dist, side));
      return p;
    }
    const first = this.segments[0];
    const last = this.segments[len - 1];
    let start: Vector;
    let end: Vector;
    if (this.closed) {
      start = offsetJoint(first, last, dist, side);
      p.closed = true;
    } else {
      start = first.offsetStart(dist, side);
    }
    for (let i = 0; i < len - 1; i++) {
      const seg = this.segments[i];
      end = offsetJoint(seg, this.segments[i + 1], dist, side);
      p.segments.push(seg.create(start, end));
      start = end;
    }
    if (this.closed) {
      end = offsetJoint(first, last, dist, side);
    } else {
      end = last.offsetEnd(dist, side);
    }
    p.segments.push(last.create(start, end));
    return p;
  }
  divide(space: number, side = StrecthSide.both, minimunRatio = 0.5): this {
    this.segments.forEach((i) => i.divide(space, side, minimunRatio));
    return this;
  }
  get points(): Vector[] {
    const res: Vector[] = [];
    const segs = this.segments;
    for (let i = 0; i < segs.length; i++) {
      const seg = segs[i];
      res.push(...seg.points.slice(0, -1));
    }
    if (!this.closed) res.push(last(last(segs).points));

    return res;
  }
  project(dist: number, side = Side.Left): Polyline {
    const p = this.offset(dist, side);
    for (let i = 0; i < this.segments.length; i++) {
      const origin = this.segments[i];
      const proj = p.segments[i];
      const originPts = origin.points;
      const pts = origin.project(dist, side).points;
      for (const pt of pts) {
        if (proj.includeTest(pt)) {
          proj.points.push(pt);
        } else {
          proj.points.push(proj.getNeighbourPoint(pt));
        }
      }
      if (originPts[0].closeTo(origin.start, 1e-6)) proj.points[0] = proj.start;
      if (last(originPts).closeTo(origin.end, 1e-6))
        proj.points[pts.length - 1] = proj.end;
    }
    return p;
  }
  rayIntersect(pt: Vector, direction: Vector): Vector[] {
    const res = [];
    for (const seg of this.segments) {
      res.push(...seg.rayIntersect(pt, direction));
    }
    return res;
  }
  intersect(geo: Geometry): Vector[] {
    return geo.intersectPolyline(this);
  }
  intersectArc(arc: ArcGeometry): Vector[] {
    return arc.intersectPolyline(this);
  }
  intersectCircle(circle: CircleGeometry): Vector[] {
    return circle.intersectPolyline(this);
  }
  intersectLine(line: LineGeometry): Vector[] {
    return line.intersectPolyline(this);
  }
  intersectPolyline(polyline: PolylineGeometry): Vector[] {
    const res: Vector[] = [];
    for (const seg of this.segments) {
      res.push(...seg.intersectPolyline(polyline));
    }
    return removeDuplicate((left, right) => left.closeTo(right, 1e-6), res);
  }
  accept(paper: Paper): void {
    paper.visitPolyline(this);
  }
  protected moveItem(v: Vector): void {
    for (const seg of this.segments) {
      seg.move(v);
    }
  }
  protected scaleItem(factor: number): void {
    for (const seg of this.segments) {
      seg.scale(factor);
    }
  }
  calcBoundingBox(): BoundingBox {
    if (this.segments.length === 0) {
      throw Error("getBoundingBox error: polyline is empty");
    }
    return this.segments
      .map((s) => s.getBoundingBox())
      .reduce((pre, cur) => pre.merge(cur));
  }
  protected setLineType(lineType: LineType): void {
    this.lineType = lineType;
    for (const seg of this.segments) {
      seg.lineType = lineType;
    }
  }
  thinLine(): this {
    this.setLineType(LineType.Thin);
    return this;
  }
  middleLine(): this {
    super.middleLine();
    this.setLineType(LineType.Middle);
    return this;
  }
  thickLine(): this {
    this.setLineType(LineType.Thick);
    return this;
  }
  thickerLine(): this {
    this.setLineType(LineType.Thicker);
    return this;
  }
  dashedLine(): this {
    this.setLineType(LineType.Dashed);
    return this;
  }
  centeredLine(): this {
    this.setLineType(LineType.Centered);
    return this;
  }
  greyLine(): this {
    this.setLineType(LineType.Grey);
    return this;
  }
}
