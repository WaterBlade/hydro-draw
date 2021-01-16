import { last, toLeftTest, vec, Vector } from "@/draw/misc";

export class Boundary {
  edges: Edge[] = [];
  bottom = 0;
  top = 0;
  left = 0;
  right = 0;
  constructor(protected current?: Vector) {
    if(current){
      this.bottom = current.y;
      this.top = current.y;
      this.left = current.x;
      this.right = current.x;
    }
  }
  scale(factor: number): void {
    this.edges.forEach((e) => e.scale(factor));
    this.bottom *= factor;
    this.top *= factor;
    this.left *= factor;
    this.right *= factor;
  }
  h(dist: number): this {
    if (dist < 0) throw Error("neg dist not support in boundary");
    this.edgeBy(vec(dist, 0));
    this.right += dist;
    return this;
  }
  v(dist: number): this {
    if (dist < 0) throw Error("neg dist not support in boundary");
    this.edgeBy(vec(0, dist));
    this.top += dist;
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
  protected resetSide(): void{
    this.left = this.edges[0].left;
    this.right = last(this.edges).right;
    this.bottom = this.edges[0].bottom;
    this.top = last(this.edges).top;
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
    b.resetSide();
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
    b.resetSide();
    return b;
  }
}

export class Edge {
  _left = 0;
  _right = 0;
  _bottom = 0;
  _top = 0;
  constructor(protected _start: Vector, protected _end: Vector) {
    this.resetSide();
  }
  clone(): Edge{
    return new Edge(this.start, this.end);
  }
  scale(factor: number): void {
    this._start = this._start.mul(factor);
    this._end = this._end.mul(factor);
    this.resetSide();
  }
  get left(): number{
    return this._left;
  }
  get right(): number{
    return this._right;
  }
  get bottom(): number{
    return this._bottom;
  }
  get top(): number{
    return this._top;
  }
  set start(val: Vector){
    this._start = val;
    this.resetSide();
  }
  get start(): Vector{
    return this._start;
  }
  set end(val: Vector){
    this._end = val;
    this.resetSide();
  }
  get end(): Vector{
    return this._end;
  }
  protected resetSide(): void{
    this._left = Math.min(this._start.x, this._end.x);
    this._right = Math.max(this._start.x, this._end.x);
    this._bottom = Math.min(this._start.y, this._end.y);
    this._top = Math.max(this._start.y, this._end.y);
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
    return toLeftTest(this._start, this._end, pt);
  }
}
