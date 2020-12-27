import {
  Vector,
  BoundingBox,
  polar,
  RotateDirection,
  Side,
  toRadian,
  StrecthSide,
  vec,
  remainIf,
  removeDuplicate,
  angleMirrorByYAxis,
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
  rawInterCircleAndCircle,
  rawInterLineAndCircle,
} from "./RawIntersect.function";

export class Arc extends DrawItem implements ArcGeometry {
  points: Vector[] = [];
  closed = false;
  constructor(
    public center: Vector,
    public radius: number,
    public startAngle: number,
    public endAngle: number,
    public direction = RotateDirection.counterclockwise
  ) {
    super();
  }
  static createByEnds(
    start: Vector,
    end: Vector,
    angle: number,
    direction = RotateDirection.counterclockwise
  ): Arc {
    const dir = end.sub(start);

    const dirFactor = direction === RotateDirection.counterclockwise ? 1 : -1;
    const angleFactor = angle < 180 ? 1 : -1;
    const norm = dir.norm().mul(dirFactor * angleFactor);
    const mid = start.add(end).mul(0.5);

    const cord = dir.length();
    const dist = 0.5 * cord * Math.tan(0.5 * Math.PI - toRadian(0.5 * angle));
    const radius = Math.sqrt((0.5 * cord) ** 2 + dist ** 2);
    const center = mid.add(norm.unit().mul(dist));

    return new Arc(
      center,
      radius,
      start.sub(center).quadrantAngle(),
      end.sub(center).quadrantAngle(),
      direction
    );
  }
  get start(): Vector {
    return polar(this.radius, this.startAngle).add(this.center);
  }
  get end(): Vector {
    return polar(this.radius, this.endAngle).add(this.center);
  }
  get mid(): Vector {
    let angle: number;
    if (this.direction === RotateDirection.counterclockwise) {
      angle = (this.startAngle + this.calcAngle() / 2) % 360;
    } else {
      angle = (this.endAngle + this.calcAngle() / 2) % 360;
    }
    return polar(this.radius, angle).add(this.center);
  }
  get startNorm(): Vector {
    const n = this.start.sub(this.center).unit();
    if (this.direction === RotateDirection.counterclockwise) {
      return n.mul(-1);
    }
    return n;
  }
  get endNorm(): Vector {
    const n = this.end.sub(this.center).unit();
    if (this.direction === RotateDirection.counterclockwise) {
      return n.mul(-1);
    }
    return n;
  }
  get startTangent(): Vector {
    return this.startNorm.norm();
  }
  get endTangent(): Vector {
    return this.endNorm.norm().mul(-1);
  }
  mirrorByYAxis(): Arc {
    const c = this.center.mirrorByYAxis();
    const start = angleMirrorByYAxis(this.startAngle);
    const end = angleMirrorByYAxis(this.endAngle);
    const dir =
      this.direction === RotateDirection.counterclockwise
        ? RotateDirection.clockwise
        : RotateDirection.counterclockwise;
    const a = new Arc(c, this.radius, start, end, dir);
    a.points = this.points.map((p) => p.mirrorByYAxis());
    return a;
  }
  offsetStart(dist: number, side: Side): Vector {
    return this.offsetPoint(this.start, dist, side);
  }
  offsetEnd(dist: number, side: Side): Vector {
    return this.offsetPoint(this.end, dist, side);
  }
  create(start: Vector, end: Vector): Arc {
    const startAngle = start.sub(this.center).quadrantAngle();
    const endAngle = end.sub(this.center).quadrantAngle();
    const radius = start.sub(this.center).length();
    return new Arc(this.center, radius, startAngle, endAngle, this.direction);
  }
  getPointTangent(pt: Vector): Vector {
    const d = this.direction === RotateDirection.counterclockwise ? 1 : -1;
    const c = this.center;
    return pt.sub(c).norm().unit().mul(d);
  }
  getPointNorm(pt: Vector): Vector {
    const d = this.direction === RotateDirection.counterclockwise ? -1 : 1;
    const c = this.center;
    return pt.sub(c).unit().mul(d);
  }
  checkAhead(left: Vector, right: Vector): boolean {
    const a0 = left.sub(this.center).quadrantAngle();
    const a1 = right.sub(this.center).quadrantAngle();
    if (this.direction === RotateDirection.counterclockwise) {
      if (this.endAngle < this.startAngle) {
        if (a0 > this.endAngle && a1 < this.endAngle) {
          return true;
        }
        if (a1 > this.endAngle && a0 < this.endAngle) {
          return false;
        }
      }
      return a1 > a0;
    } else {
      if (this.endAngle > this.startAngle) {
        if (a0 > this.startAngle && a1 < this.startAngle) {
          return false;
        }
        if (a1 > this.startAngle && a0 < this.startAngle) {
          return true;
        }
      }
      return a1 < a0;
    }
  }
  includeTest(pt: Vector): boolean {
    const r = pt.sub(this.center).length();
    if (Math.abs(r - this.radius) > 1e-6) {
      return false;
    }
    const a = pt.sub(this.center).quadrantAngle();
    const start = this.startAngle;
    const end = this.endAngle;
    if (this.direction === RotateDirection.counterclockwise) {
      if (start < end && a > start && a < end) return true;
      if (start > end && (a > start || a < end)) return true;
      return false;
    } else {
      if (start > end && a < start && a > end) return true;
      if (start < end && (a < start || a > end)) return true;
      return false;
    }
  }
  resetStart(pt: Vector): this {
    this.startAngle = pt.sub(this.center).quadrantAngle();
    return this;
  }
  resetEnd(pt: Vector): this {
    this.endAngle = pt.sub(this.center).quadrantAngle();
    return this;
  }
  distanceTo(pt: Vector): number {
    const iters = this.rayIntersect(pt, pt.sub(this.center));
    return Math.min(
      ...iters.map((p) => p.sub(pt).length()),
      pt.sub(this.start).length(),
      pt.sub(this.end).length()
    );
  }
  getNearestPt(pt: Vector): Vector {
    const iters = this.rayIntersect(pt, pt.sub(this.center));
    const pts = [...iters, this.start, this.end];

    let nearId = 0;
    let nearDist = pts[0].sub(pt).length();
    for (let i = 1; i < pts.length; i++) {
      const d = pts[i].sub(pt).length();
      if (d < nearDist) {
        nearId = i;
        nearDist = d;
      }
    }
    return pts[nearId];
  }
  offset(dist: number, side: Side): Arc {
    const r = this.offsetRadius(dist, side);
    return new Arc(
      this.center,
      r,
      this.startAngle,
      this.endAngle,
      this.direction
    );
  }
  offsetPoint(pt: Vector, dist: number, side: Side): Vector {
    const c0 = side === Side.Left ? 1 : -1;
    const c1 = this.direction === RotateDirection.counterclockwise ? -1 : 1;
    const d = dist * c0 * c1;
    const cen = this.center;
    return pt.add(pt.sub(cen).unit().mul(d));
  }
  protected offsetRadius(dist: number, side: Side): number {
    const c0 = side === Side.Left ? 1 : -1;
    const c1 = this.direction === RotateDirection.counterclockwise ? -1 : 1;
    const r = this.radius + c0 * c1 * dist;
    return r;
  }
  calcLength(): number {
    return toRadian(this.calcAngle()) * this.radius;
  }
  calcAngle(): number {
    const start = this.startAngle;
    const end = this.endAngle;
    let angle: number;
    if (this.direction === RotateDirection.counterclockwise) {
      if (end > start) {
        angle = end - start;
      } else {
        angle = 360 + end - start;
      }
    } else {
      if (start > end) {
        angle = start - end;
      } else {
        angle = 360 + start - end;
      }
    }
    return angle;
  }
  divide(space: number, side = StrecthSide.both, minimunRatio = 0.5): this {
    this.points = [];
    const angle = toRadian(this.calcAngle());
    const spaceRadian = space / this.radius;
    const dir = this.direction === RotateDirection.counterclockwise ? 1 : -1;
    const count = Math.floor(angle / spaceRadian);
    const minimun = minimunRatio * spaceRadian;

    const startRadian = toRadian(this.startAngle);

    this.points.push(this.start);

    const r = this.radius;
    const c = this.center;
    if (count >= 2) {
      if (angle - count * spaceRadian < 1e-6) {
        for (let i = 1; i < count; i++) {
          const a = startRadian + i * spaceRadian * dir;
          this.points.push(c.add(vec(r * Math.cos(a), r * Math.sin(a))));
        }
      } else if (side === StrecthSide.both) {
        const a0 =
          startRadian + (dir * (angle - spaceRadian * (count - 1))) / 2;
        for (let i = 0; i < count; i++) {
          const a = a0 + i * spaceRadian * dir;
          this.points.push(c.add(vec(r * Math.cos(a), r * Math.sin(a))));
        }
      } else {
        const spaceLeft = angle - count * spaceRadian;
        const n = spaceLeft < minimun ? count : count + 1;
        if (side === StrecthSide.head) {
          const a0 = startRadian + dir * (angle - (n - 1) * spaceRadian);
          for (let i = 0; i < n - 1; i++) {
            const a = a0 + i * spaceRadian * dir;
            this.points.push(c.add(vec(r * Math.cos(a), r * Math.sin(a))));
          }
        } else {
          for (let i = 1; i < n; i++) {
            const a = startRadian + i * spaceRadian * dir;
            this.points.push(c.add(vec(r * Math.cos(a), r * Math.sin(a))));
          }
        }
      }
    }
    this.points.push(this.end);
    return this;
  }
  divideByCount(count: number): this {
    const angleSpace = this.calcAngle() / count;
    const start = this.startAngle;
    const c = this.center;
    const r = this.radius;
    const dir = this.direction === RotateDirection.counterclockwise ? 1 : -1;
    for (let i = 1; i < count; i++) {
      const angle = start + i * angleSpace * dir;
      this.points.push(c.add(vec(r * Math.cos(angle), r * Math.sin(angle))));
    }
    return this;
  }
  project(dist: number, side: Side): Arc {
    if (this.points.length === 0) {
      throw Error("ArcSegment project error: not divided");
    }
    const c0 = side === Side.Left ? 1 : -1;
    const c1 = this.direction === RotateDirection.counterclockwise ? -1 : 1;
    const d = dist * c0 * c1;
    const cen = this.center;
    const pts = this.points.map((p) => p.add(p.sub(cen).unit().mul(d)));
    const l = this.offset(dist, side);
    l.points = pts;
    return l;
  }
  rayIntersect(pt: Vector, direciton: Vector): Vector[] {
    const iters = rawInterLineAndCircle(
      pt,
      pt.add(direciton),
      this.center,
      this.radius
    );
    const res = [];
    for (const p of iters) {
      if (this.includeTest(p)) res.push(p);
    }
    return res;
  }
  intersect(geo: Geometry): Vector[] {
    return geo.intersectArc(this);
  }
  intersectArc(arc: ArcGeometry): Vector[] {
    const iters = rawInterCircleAndCircle(
      this.center,
      this.radius,
      arc.center,
      arc.radius
    );
    return remainIf((pt) => this.includeTest(pt) && arc.includeTest(pt), iters);
  }
  intersectCircle(circle: CircleGeometry): Vector[] {
    const iters = rawInterCircleAndCircle(
      this.center,
      this.radius,
      circle.center,
      circle.radius
    );
    return remainIf((pt) => this.includeTest(pt), iters);
  }
  intersectLine(line: LineGeometry): Vector[] {
    const iters = rawInterLineAndCircle(
      line.start,
      line.end,
      this.center,
      this.radius
    );
    return remainIf(
      (pt) => this.includeTest(pt) && line.includeTest(pt),
      iters
    );
  }
  intersectPolyline(polyline: PolylineGeometry): Vector[] {
    const iters = polyline.segments
      .map((s) => s.intersectArc(this))
      .reduce((res, cur) => {
        res.push(...cur);
        return res;
      }, []);
    return removeDuplicate((left, right) => left.closeTo(right, 1e-6), iters);
  }
  getNeighbourPoint(pt: Vector): Vector {
    const start = this.start;
    const end = this.end;
    if (pt.sub(start).length() > pt.sub(end).length()) return end;
    return start;
  }
  accept(paper: Paper, insertPoint: Vector): void {
    paper.visitArc(this, insertPoint);
  }
  protected scaleItem(factor: number): void {
    this.center = this.center.mul(factor);
    this.radius *= factor;
  }
  protected moveItem(vector: Vector): void {
    this.center = this.center.add(vector);
  }
  calcBoundingBox(): BoundingBox {
    const { x, y } = this.center;
    const pt1 = polar(this.radius, this.startAngle).add(this.center);
    const pt2 = polar(this.radius, this.endAngle).add(this.center);
    let left = Math.min(pt1.x, pt2.x);
    let right = Math.max(pt1.x, pt2.x);
    let bottom = Math.min(pt1.y, pt2.y);
    let top = Math.max(pt1.y, pt2.y);

    const isCounter = this.direction === RotateDirection.counterclockwise;
    const start = isCounter ? this.startAngle : this.endAngle;
    const end = isCounter ? this.endAngle : this.startAngle;

    if (start > end) {
      right = x + this.radius;
    }
    if (start <= 90 && 90 <= end) {
      top = y + this.radius;
    }
    if (start <= 180 && 180 <= end) {
      left = x - this.radius;
    }
    if (start <= 270 && 270 <= end) {
      bottom = y - this.radius;
    }

    return new BoundingBox(left, right, bottom, top);
  }
}
