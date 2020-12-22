import {
  Vector,
  BoundingBox,
  Side,
  StrecthSide,
  remainIf,
  removeDuplicate,
} from "@/draw/misc";
import { DrawItem } from "../DrawItem";
import { Paper } from "../Paper.interface";
import {
  ArcGeometry,
  CircleGeometry,
  Geometry,
  LineGeometry,
  PolylineGeometry,
} from "./Geometry";
import {
  rawInterLineAndCircle,
  rawInterLineAndLine,
} from "./RawIntersect.function";

export class Line extends DrawItem implements LineGeometry {
  points: Vector[] = [];
  closed = false;
  constructor(public start: Vector, public end: Vector) {
    super();
  }
  get mid(): Vector {
    return this.start.add(this.end).mul(0.5);
  }
  get startNorm(): Vector {
    return this.end.sub(this.start).norm().unit();
  }
  get endNorm(): Vector {
    return this.startNorm;
  }
  get startTangent(): Vector {
    return this.start.sub(this.end).unit();
  }
  get endTangent(): Vector {
    return this.end.sub(this.start).unit();
  }
  offsetStart(dist: number, side: Side): Vector {
    return this.offsetPoint(this.start, dist, side);
  }
  offsetEnd(dist: number, side: Side): Vector {
    return this.offsetPoint(this.end, dist, side);
  }
  create(start: Vector, end: Vector): Line {
    return new Line(start, end);
  }
  getPointTangent(): Vector {
    return this.end.sub(this.start).unit();
  }
  getPointNorm(): Vector {
    return this.end.sub(this.start).norm().unit();
  }
  checkAhead(left: Vector, right: Vector): boolean {
    return right.sub(left).dot(this.end.sub(this.start)) > 0;
  }
  includeTest(pt: Vector): boolean {
    const v0 = this.end.sub(this.start);
    const v1 = pt.sub(this.start);
    const v2 = pt.sub(this.end);
    if (Math.abs(v0.cross(v1)) > 1e-6) {
      return false;
    }
    if (v1.dot(v2) < 0) return true;
    return false;
  }
  resetStart(pt: Vector): this {
    this.start = pt;
    return this;
  }
  resetEnd(pt: Vector): this {
    this.end = pt;
    return this;
  }
  distanceTo(pt: Vector): number {
    const n = this.end.sub(this.start).norm();
    const iters = this.rayIntersect(pt, n);
    return Math.min(
      ...iters.map((p) => p.sub(pt).length()),
      pt.sub(this.start).length(),
      pt.sub(this.end).length()
    );
  }
  getNearestPt(pt: Vector): Vector {
    const n = this.end.sub(this.start).norm();
    const iters = this.rayIntersect(pt, n);
    if (iters.length > 0) {
      return iters[0];
    }
    if (pt.sub(this.start).length() < pt.sub(this.end).length()) {
      return this.start;
    } else {
      return this.end;
    }
  }
  offset(dist: number, side: Side): Line {
    return new Line(
      this.offsetPoint(this.start, dist, side),
      this.offsetPoint(this.end, dist, side)
    );
  }
  offsetPoint(pt: Vector, dist: number, side: Side): Vector {
    const d = side === Side.Left ? dist : -dist;
    const n = this.end.sub(this.start).norm().unit().mul(d);
    return pt.add(n);
  }
  divide(space: number, side = StrecthSide.both, minimunRatio = 0.5): this {
    this.points = [];
    const length = this.calcLength();
    const dir = this.end.sub(this.start).unit();
    const count = Math.floor(length / space);
    const minimun = minimunRatio * space;
    const start = this.start;
    this.points.push(start);
    if (count >= 2) {
      if (length - count * space < 1e-6) {
        for (let i = 1; i < count; i++) {
          this.points.push(start.add(dir.mul(i * space)));
        }
      } else if (side === StrecthSide.both) {
        const p1 = start.add(dir.mul((length - (count - 1) * space) / 2));
        for (let i = 0; i < count; i++) {
          this.points.push(p1.add(dir.mul(i * space)));
        }
      } else {
        const spaceLeft = length - count * space;
        const n = spaceLeft < minimun ? count : count + 1;
        if (side === StrecthSide.head) {
          const p1 = start.add(dir.mul(length - (n - 1) * space));
          for (let i = 0; i < n - 1; i++) {
            this.points.push(p1.add(dir.mul(i * space)));
          }
        } else {
          for (let i = 1; i < n; i++) {
            this.points.push(start.add(dir.mul(i * space)));
          }
        }
      }
    }
    this.points.push(this.end);
    return this;
  }
  divideByCount(count: number): this {
    const space = this.calcLength() / count;
    const start = this.start;
    const dir = this.end.sub(this.start).unit();
    for (let i = 1; i < count; i++) {
      this.points.push(start.add(dir.mul(i * space)));
    }
    return this;
  }
  calcLength(): number {
    return this.end.sub(this.start).length();
  }
  project(dist: number, side: Side): Line {
    if (this.points.length === 0) {
      throw Error("LineSegment project error: not divided");
    }
    const v = this.offsetNorm(dist, side);
    const pts = this.points.map((p) => p.add(v));
    const l = this.offset(dist, side);
    l.points = pts;
    return l;
  }
  rayIntersect(pt: Vector, direction: Vector): Vector[] {
    const iters = rawInterLineAndLine(
      pt,
      pt.add(direction),
      this.start,
      this.end
    );
    const res = [];
    for (const p of iters) {
      if (this.includeTest(p)) res.push(p);
    }
    return res;
  }
  intersect(geo: Geometry): Vector[] {
    return geo.intersectLine(this);
  }
  intersectArc(arc: ArcGeometry): Vector[] {
    const iters = rawInterLineAndCircle(
      this.start,
      this.end,
      arc.center,
      arc.radius
    );
    return remainIf((pt) => this.includeTest(pt) && arc.includeTest(pt), iters);
  }
  intersectCircle(circle: CircleGeometry): Vector[] {
    const iters = rawInterLineAndCircle(
      this.start,
      this.end,
      circle.center,
      circle.radius
    );
    return remainIf((pt) => this.includeTest(pt), iters);
  }
  intersectLine(line: LineGeometry): Vector[] {
    const iters = rawInterLineAndLine(
      this.start,
      this.end,
      line.start,
      line.end
    );
    return remainIf(
      (pt) => this.includeTest(pt) && line.includeTest(pt),
      iters
    );
  }
  intersectPolyline(polyline: PolylineGeometry): Vector[] {
    const iters = polyline.segments
      .map((s) => s.intersectLine(this))
      .reduce((res, cur) => {
        res.push(...cur);
        return res;
      }, []);
    return removeDuplicate((left, right) => left.closeTo(right, 1e-6), iters);
  }
  protected offsetNorm(dist: number, side: Side): Vector {
    const c0 = side === Side.Left ? 1 : -1;
    const norm = this.end
      .sub(this.start)
      .norm()
      .unit()
      .mul(c0 * dist);
    return norm;
  }
  getNeighbourPoint(pt: Vector): Vector {
    const start = this.start;
    const end = this.end;
    if (pt.sub(start).length() > pt.sub(end).length()) return end;
    return start;
  }
  accept(paper: Paper, insertPoint: Vector): void {
    paper.visitLine(this, insertPoint);
  }
  scale(factor: number): void {
    this.start = this.start.mul(factor);
    this.end = this.end.mul(factor);
  }
  move(vec: Vector): void {
    this.start = this.start.add(vec);
    this.end = this.end.add(vec);
  }
  getBoundingBox(): BoundingBox {
    const { x: x1, y: y1 } = this.start;
    const { x: x2, y: y2 } = this.end;
    return new BoundingBox(
      Math.min(x1, x2),
      Math.max(x1, x2),
      Math.min(y1, y2),
      Math.max(y1, y2)
    );
  }
}
