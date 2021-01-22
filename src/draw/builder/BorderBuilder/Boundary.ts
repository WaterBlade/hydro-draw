import { last, toLeftTest, vec, Vector } from "@/draw/misc";

export class Boundary {
  edges: Edge[] = [];
  constructor(protected current?: Vector) {}
  clone(): Boundary{
    const b = new Boundary();
    b.edges = this.edges.map(e => e.clone());
    return b;
  }
  scale(factor: number): void {
    this.edges.forEach((e) => e.scale(factor));
  }
  scaleBy(pt: Vector, xFactor: number, yFactor: number): void{
    this.edges.forEach(e => e.scaleBy(pt, xFactor, yFactor));
  }
  h(dist: number): this {
    if (dist < 0) throw Error("neg dist not support in boundary");
    this.edgeBy(vec(dist, 0));
    return this;
  }
  v(dist: number): this {
    if (dist < 0) throw Error("neg dist not support in boundary");
    this.edgeBy(vec(0, dist));
    return this;
  }
  corner(xDist: number, yDist: number): void {
    this.h(xDist).v(yDist);
  }
  protected edgeBy(v: Vector): void {
    if(!this.current){
      throw Error('boundary current pt is undefined')
    }
    const pt = this.current.add(v);
    this.edges.push(new Edge(this.current, pt));
    this.current = pt;
  }
  insideTest(pt: Vector): boolean {
    for (const e of this.edges) {
      if (e.insideTest(pt)) {
        return e.leftTest(pt);
      }
    }
    return false;
  }
  getBottom(left: number, right: number): number {
    let bottom = this.bottom;
    for (const e of this.edges) {
      if (e.xOverlapTest(left, right)) bottom = Math.max(e.top, bottom);
    }
    return bottom;
  }
  getRight(bottom: number, top: number): number {
    let right = this.right;
    for (const e of this.edges) {
      if (e.yOverlapTest(bottom, top)) right = Math.min(e.left, right);
    }
    return right;
  }
  get left(): number{
    return this.edges[0].left;
  }
  get right(): number{
    return last(this.edges).right;
  }
  get bottom(): number{
    return this.edges[0].bottom;
  }
  get top(): number{
    return last(this.edges).top;
  }
  genSubByH(left: number, right: number): Boundary{
    if(left > right) throw Error('left is above right');
    if(this.edges.length === 0) throw Error('empty boundary');
    const b = new Boundary();
    for(const e of this.edges){
      if(e.xOverlapTest(left, right)){
        b.edges.push(e.clone());
      }
    }
    const head = b.edges[0];
    if(head.left < left){
      head.start = vec(left, head.start.y);
    }
    const tail = last(b.edges);
    if(tail.right > right){
      tail.end = vec(right, tail.end.y);
    }
    if(tail.top < this.top){
      b.edges.push(new Edge(tail.end, vec(right, this.top)));
    }
    return b;
  }
  genSubByV(bottom: number, top: number): Boundary{
    if(bottom > top) throw Error('bottom is above top');
    const b = new Boundary();
    for(const e of this.edges){
      if(e.yOverlapTest(bottom, top)){
        b.edges.push(e.clone());
      }
    }
    const head = b.edges[0];
    if(head.bottom < bottom){
      head.start = vec(head.start.x, bottom);
    }
    const tail = last(b.edges);
    if(tail.top > top){
      tail.end = vec(tail.end.x, top);
    }
    if(head.left > this.left){
      b.edges.unshift(new Edge(vec(this.left, bottom), head.start));
    }
    return b;
  }
}

export class Edge {
  constructor(public start: Vector, public end: Vector) {
  }
  clone(): Edge{
    return new Edge(this.start, this.end);
  }
  scale(factor: number): void {
    this.start = this.start.mul(factor);
    this.end = this.end.mul(factor);
  }
  scaleBy(pt: Vector, xFactor: number, yFactor: number): void{
    this.start = this.start.scaleBy(pt, xFactor, yFactor);
    this.end = this.end.scaleBy(pt, xFactor, yFactor);
  }
  get left(): number{
    return Math.min(this.start.x, this.end.x);
  }
  get right(): number{
    return Math.max(this.start.x, this.end.x);
  }
  get bottom(): number{
    return Math.min(this.start.y, this.end.y);
  }
  get top(): number{
    return Math.max(this.start.y, this.end.y);
  }
  insideTest(pt: Vector): boolean {
    return this.xInsideTest(pt) || this.yInsideTest(pt);
  }
  xInsideTest(pt: Vector): boolean {
    return this.left <= pt.x && pt.x < this.right;
  }
  yInsideTest(pt: Vector): boolean {
    return this.bottom < pt.y && pt.y <= this.top;
  }
  xOverlapTest(left: number, right: number): boolean {
    if (this.right <= left || this.left >= right) return false;
    return true;
  }
  yOverlapTest(bottom: number, top: number): boolean {
    if (this.top <= bottom || this.bottom >= top) return false;
    return true;
  }
  leftTest(pt: Vector): boolean {
    return toLeftTest(this.start, this.end, pt);
  }
}
