import { Side, StrecthSide, Vector } from "@/draw/misc";
import { DrawItem } from "../DrawItem";
import {
  PaperArc,
  PaperCircle,
  PaperLine,
  PaperPolyline,
} from "../Paper.interface";

export interface Geometry extends DrawItem {
  points: Vector[];
  includeTest(pt: Vector): boolean;
  calcLength(): number;
  mirrorByYAxis(): Geometry;
  offset(dist: number, side: Side): Geometry;
  divide(space: number, side: StrecthSide, minimunRatio: number): this;
  project(side: StrecthSide, minimunRatio: number): Geometry;
  rayIntersect(pt: Vector, direction: Vector): Vector[];
  intersect(geo: Geometry): Vector[];
  intersectArc(arc: ArcGeometry): Vector[];
  intersectCircle(circle: CircleGeometry): Vector[];
  intersectLine(line: LineGeometry): Vector[];
  intersectPolyline(polyline: PolylineGeometry): Vector[];
}

export interface PolylineSegment extends Geometry {
  start: Vector;
  end: Vector;
  mid: Vector;
  startNorm: Vector;
  endNorm: Vector;
  startTangent: Vector;
  endTangent: Vector;
  closed: boolean;
  offsetStart(dist: number, side: Side): Vector;
  offsetEnd(dist: number, side: Side): Vector;
  offsetPoint(pt: Vector, dist: number, side: Side): Vector;
  create(start: Vector, end: Vector): PolylineSegment;
  getPointTangent(pt: Vector): Vector;
  getPointNorm(pt: Vector): Vector;
  checkAhead(left: Vector, right: Vector): boolean;
  resetStart(pt: Vector): this;
  resetEnd(pt: Vector): this;
  distanceTo(pt: Vector): number;
  getNearestPt(pt: Vector): Vector;
  removeStartPt(): this;
  removeEndPt(): this;
}

export interface ArcGeometry extends PolylineSegment, PaperArc {}
export interface LineGeometry extends PolylineSegment, PaperLine {}
export interface CircleGeometry extends Geometry, PaperCircle {}
export interface PolylineGeometry extends Geometry, PaperPolyline {
  segments: (ArcGeometry | LineGeometry)[];
  distanceTo(pt: Vector): number;
  getNearestPt(pt: Vector): Vector;
  getNearestSegment(pt: Vector): PolylineSegment;
}
