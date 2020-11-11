import { vec, Vector } from "../../../misc";
import { RotateDirection } from "../../../RotateDirection";

export enum OffsetDirection{
  Left,
  Right
}

export class Path {
  segments: Segment[] =[];
  offset(dist: number): void {
    dist;
  }
  divide(count: number): void{
    count;

  }
}

export class PointPath {
    

}


export abstract class Segment{
  abstract intersectLine(line: LineSegment): Vector[];
  abstract intersectArc(arc: ArcSegment): Vector[];
}


export class LineSegment extends Segment{
  constructor(public start: Vector, public end: Vector){
    super();
  }
  offset(dist: number, direction = OffsetDirection.Left): void{
    const flag = direction === OffsetDirection.Left ? 1 : -1;
    const norm = this.start.sub(this.end).perpend().unit().mul(flag * dist);
    this.start = this.start.add(norm);
    this.end = this.end.add(norm);
  }
  intersectLine(line: LineSegment): Vector[]{
    return intersectLineAndLine(this, line);
  }
  intersectArc(arc: ArcSegment): Vector[]{
    return intersectLineAndArc(this, arc);
  }
  intersect(segment: Segment): Vector[]{
    return segment.intersectLine(this);
  }
}

export class ArcSegment extends Segment{
  constructor(
    public center: Vector, 
    public radius: number, 
    public startAngle: number, 
    public endAngle: number, 
    public direction: RotateDirection){
      super();

    }
  
  offset(dist: number, direction = OffsetDirection.Left): void{
    if(direction === OffsetDirection.Left){
      if(this.direction === RotateDirection.counterclockwise){
        this.radius -= dist;
      }else{
        this.radius += dist;
      }
    }else{
      if(this.direction === RotateDirection.counterclockwise){
        this.radius += dist;
      }else{
        this.radius -= dist;
      }
    }
    
  }

  intersectLine(line: LineSegment): Vector[]{
    return intersectLineAndArc(line, this);
  }
  
  intersectArc(arc: ArcSegment): Vector[]{
    return intersectArcAndArc(this, arc);
  }

  intersect(segment: Segment): Vector[]{
    return segment.intersectArc(this);
  }
}


export function intersectLineAndLine(left: LineSegment, right: LineSegment): Vector[]{
  const {x: ax, y: ay} = left.start;
  const {x: bx, y: by} = left.end;
  const {x: cx, y: cy} = right.start;
  const {x: dx, y: dy} = right.end;

  const denom = 
    ax * (dy - cy) + bx * (cy - dy) + dx * (by-ay) + cx * (ay - by);
  if(Math.abs(denom) < 1e-6){
    return [];
  }
  const sNum = ax * (dy-cy) + cx*(ay-dy) + dx*(cy-ay);
  const s = sNum / denom;
  return [vec(ax + s * (bx-ax), ay + s * (by - ay))];
  
}

export function intersectLineAndArc(line: LineSegment, arc: ArcSegment): Vector[]{
  const d = line.end.sub(line.start);
  const D = line.start.sub(arc.center);
  const r = arc.radius;

  const root = d.dot(D) ** 2 - d.dot(d) * (D.dot(D) - r ** 2);
  if(root < 0 && Math.abs(root) / d.dot(d) > 1e-6){
    return [];
  }
  if(Math.abs(root) / d.dot(d) < 1e-6) {
    const t = - d.dot(D) / d.dot(d);
    return [line.start.add(d.mul(t))];
  }else{
    const left = - d.dot(D) / d.dot(d);
    const right = Math.sqrt(root) / d.dot(d);
    const t1 = left + right;
    const t2 = left - right;
    return [line.start.add(d.mul(t1)), line.start.add(d.mul(t2))];
  }
}

export function intersectArcAndArc(left: ArcSegment, right: ArcSegment): Vector[]{
  const dist = left.center.sub(right.center).length();
  if(dist > left.radius + right.radius){
    return [];
  }
  if(Math.abs(dist - left.radius - right.radius) < 1e-6){
    return [left.center.add(right.center.sub(left.center).mul(left.radius / (left.radius+right.radius)))]
  }
  const u = right.center.sub(left.center);
  const v = vec(u.y, -u.x);

  const r02 = left.radius ** 2;
  const r12 = right.radius ** 2;
  const u2 = u.dot(u);
  
  const s = 0.5 * ((r02 - r12)/u2 + 1);
  const t = Math.sqrt(r02 / u2 - s**2);

  return [
    left.center.add(u.mul(s)).add(v.mul(t)),
    left.center.add(u.mul(s)).add(v.mul(-t))
  ];
}