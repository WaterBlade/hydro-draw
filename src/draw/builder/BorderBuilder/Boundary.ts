import { toLeftTest, vec, Vector } from "@/draw/misc";

export class Boundary{
  edges: Edge[] = [];
  bottom = 0;
  top = 0;
  left = 0;
  right = 0;
  constructor(protected current: Vector){
    this.bottom = current.y;
    this.top = current.y;
    this.left = current.x;
    this.right = current.x;
  }
  scale(factor: number): void{
    this.edges.forEach(e => e.scale(factor));
    this.bottom *= factor;
    this.top *= factor;
    this.left *= factor;
    this.right *= factor;
  }
  h(dist: number): this{
    if(dist < 0) throw Error('neg dist not support in boundary');
    this.edgeBy(vec(dist, 0));
    this.right += dist;
    return this;
  }
  v(dist: number): this{
    if(dist < 0) throw Error('neg dist not support in boundary');
    this.edgeBy(vec(0, dist));
    this.top += dist;
    return this;
  }
  corner(xDist: number, yDist: number): void{
    this.h(xDist).v(yDist);
  }
  protected edgeBy(v: Vector): void{
    const pt = this.current.add(v);
    this.edges.push(new Edge(this.current, pt));
    this.current = pt;
  }
  insideTest(pt: Vector): boolean{
    for(const e of this.edges){
      if(e.insideTest(pt)){
        return e.leftTest(pt);
      }
    }
    return false;
  }
  getBottom(left: number, right: number): number{
    let bottom = this.bottom;
    for(const e of this.edges){
      if(e.xOverlapTest(left, right)) bottom = Math.max(e.top, bottom);
    }
    return bottom;
  }
  getRight(bottom: number, top: number): number{
    let right = this.right;
    for(const e of this.edges){
      if(e.yOverlapTest(bottom, top)) right = Math.min(e.left, right);
    }
    return right;
  }
}

export class Edge{
  left: number;
  right: number;
  bottom: number;
  top: number;
  constructor(public start: Vector, public end: Vector){
    this.left = Math.min(start.x, end.x);
    this.right = Math.max(start.x, end.x);
    this.bottom = Math.min(start.y, end.y);
    this.top = Math.max(start.y, end.y);
  }
  scale(factor: number): void{
    this.start = this.start.mul(factor);
    this.end = this.end.mul(factor);
    this.left *= factor;
    this.right *= factor;
    this.bottom *= factor;
    this.top *= factor;
  }
  insideTest(pt: Vector): boolean{
    return this.xInsideTest(pt) || this.yInsideTest(pt);
  }
  xInsideTest(pt: Vector): boolean{
    return this.left <= pt.x && pt.x < this.right;
  }
  yInsideTest(pt: Vector): boolean{
    return this.bottom < pt.y && pt.y <= this.top;
  }
  xOverlapTest(left: number, right: number): boolean{
    if(this.right < left || this.left > right) return false;
    return true;
  }
  yOverlapTest(bottom: number, top: number): boolean{
    if(this.top < bottom || this.bottom > top) return false;
    return true;
  }
  leftTest(pt: Vector): boolean{
    return toLeftTest(this.start, this.end, pt);
  }
}