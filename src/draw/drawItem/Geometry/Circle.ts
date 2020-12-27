import {
  Vector,
  BoundingBox,
  Side,
  vec,
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
  rawInterCircleAndCircle,
  rawInterLineAndCircle,
} from "./RawIntersect.function";

export class Circle extends DrawItem implements CircleGeometry {
  points: Vector[] = [];
  constructor(public center: Vector, public radius: number) {
    super();
  }
  mirrorByYAxis(): Circle {
    const c = new Circle(this.center.mirrorByYAxis(), this.radius);
    c.points = this.points.map((p) => p.mirrorByYAxis());
    return c;
  }
  includeTest(pt: Vector): boolean {
    if (Math.abs(pt.sub(this.center).length() - this.radius) > 1e-6)
      return false;
    return true;
  }
  offset(dist: number, side: Side): Circle {
    const r = this.offsetRadius(dist, side);
    if (r < 0) {
      throw Error("circle offset error: offset circle radius less than 0");
    }
    return new Circle(this.center, r);
  }
  offsetPoint(pt: Vector, dist: number, side: Side): Vector {
    const c0 = side === Side.Left ? 1 : -1;
    const d = dist * c0;
    const cen = this.center;
    return pt.add(pt.sub(cen).unit().mul(d));
  }
  protected offsetRadius(dist: number, side: Side): number {
    const dir = side === Side.Left ? -1 : 1;
    return this.radius + dist * dir;
  }
  calcLength(): number {
    return Math.PI * 2 * this.radius;
  }
  divide(space: number): this {
    const count = Math.floor(this.calcLength() / space);
    this.divideByCount(count);
    return this;
  }
  divideByCount(count: number): this {
    const spaceAngle = (2 * Math.PI) / count;
    const r = this.radius;
    const c = this.center;
    for (let i = 0; i < count; i++) {
      const a = i * spaceAngle;
      const pt = vec(r * Math.cos(a), r * Math.sin(a)).add(c);
      this.points.push(pt);
    }
    return this;
  }
  project(dist: number, side: Side): Circle {
    if (this.points.length === 0) {
      throw Error("circle project error: not divided");
    }
    const circle = this.offset(dist, side);
    const r = this.offsetRadius(dist, side);
    const c = this.center;
    for (const pt of this.points) {
      circle.points.push(pt.sub(c).unit().mul(r).add(c));
    }
    return circle;
  }
  rayIntersect(pt: Vector, direction: Vector): Vector[] {
    return rawInterLineAndCircle(
      pt,
      pt.add(direction),
      this.center,
      this.radius
    );
  }
  intersect(geo: Geometry): Vector[] {
    return geo.intersectCircle(this);
  }
  intersectArc(arc: ArcGeometry): Vector[] {
    const iters = rawInterCircleAndCircle(
      this.center,
      this.radius,
      arc.center,
      arc.radius
    );
    return remainIf((pt) => arc.includeTest(pt), iters);
  }
  intersectCircle(circle: CircleGeometry): Vector[] {
    const iters = rawInterCircleAndCircle(
      this.center,
      this.radius,
      circle.center,
      circle.radius
    );
    return iters;
  }
  intersectLine(line: LineGeometry): Vector[] {
    const iters = rawInterLineAndCircle(
      line.start,
      line.end,
      this.center,
      this.radius
    );
    return remainIf((pt) => line.includeTest(pt), iters);
  }
  intersectPolyline(polyline: PolylineGeometry): Vector[] {
    const iters = polyline.segments
      .map((s) => s.intersectCircle(this))
      .reduce((res, cur) => {
        res.push(...cur);
        return res;
      }, []);
    return removeDuplicate((left, right) => left.closeTo(right, 1e-6), iters);
  }
  accept(paper: Paper, insertPoint: Vector): void {
    paper.visitCircle(this, insertPoint);
  }
  protected scaleItem(factor: number): void {
    this.center = this.center.mul(factor);
    this.radius *= factor;
  }
  protected moveItem(vec: Vector): void {
    this.center = this.center.add(vec);
  }
  calcBoundingBox(): BoundingBox {
    const { x, y } = this.center;
    const r = this.radius;
    return new BoundingBox(x - r, x + r, y - r, y + r);
  }
}
