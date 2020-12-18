import { Arc, Circle, CompositeItem, Content, DrawItem, Geometry, Line, Polyline, PolylineSegment, Text } from "@/draw/drawItem";
import { last, polar, RotateDirection, Side, TextAlign, vec, Vector } from "@/draw/misc";
import { RebarSpec } from "./RebarSpec";


export class PathPointNote{
  constructor(public textHeight=3.5, public drawRadius=0.3) {
  }
  
  notes: DrawItem[] = [];
  generate(): CompositeItem {
    const c = new CompositeItem();
    const r = this.drawRadius;
    if(!this._dividedPath){
      throw Error('path point note error: divide path not initialized');
    }
    c.push(
      ...this.notes, 
      ...this._dividedPath.points.map(p => new Circle(p, r).thickLine())
    );
    return c;
  }
  protected _dividedPath?: Polyline;
  path(path: Polyline, remainHead=true, remainTail=true): this {
    if(!remainHead) path.points.shift();
    if(!remainTail) path.points.pop();
    this._dividedPath = path;
    return this;
  }

  protected _offsetLine?: Polyline;
  protected _offsetSide = Side.Left;
  offset(dist: number, side = Side.Left): this{
    if(!this._dividedPath){
      throw Error('path point note error: divide path not initialized');
    }
    const p = this._dividedPath;
    const op = p.project(dist, side);
    const pts = p.points;
    const offPts = op.points;
    const notes = this.notes;
    for(let i = 0; i < pts.length; i++){
      notes.push(new Line(pts[i], offPts[i]));
    }

    op.resetStart(offPts[0]);
    op.resetEnd(last(offPts));

    notes.push(op);
    this._offsetLine = op;
    this._offsetSide = side;
    return this;
  }

  protected _content = new Content();
  protected _id = "";
  spec(s: RebarSpec, count = 0, space = 0): this {
    this._content = new Content();
    this._id = s.id;
    if (count) this._content.text(`${count}`);
    this._content.special(s.grade).text(`${s.diameter}`);
    if (space) this._content.text(`@${space}`);
    return this;
  }

  onlineNote(pt: Vector): this{
    const op = this._offsetLine;
    if(!op){
      throw Error('online note error: path not specified or not offseted');
    }

    const l = this._content.length * this.textHeight * 0.7;
    const r = this.textHeight;

    const nearSeg = op.getNearestSegment(pt);
    let d = 0;
    if(nearSeg instanceof Arc){
      const isCounter = nearSeg.direction === RotateDirection.counterclockwise;
      const isLeft = this._offsetSide === Side.Left;
      if((isCounter && isLeft) || (!isCounter && !isLeft)){
        const segR = nearSeg.radius;
        d = segR - Math.sqrt(segR**2 - 0.25 * (l+2*r)**2);
      }
    }
    const nearPt = nearSeg.getNearestPt(pt);
    const norm = nearSeg.getPointNorm(nearPt);
    const factor = this._offsetSide === Side.Left ? 1: -1;

    const base = nearPt.add(norm.mul(factor * (d+r)));
    
    const dir = Text.properVector(nearSeg.getPointTangent(pt));
    const angle = dir.quadrantAngle();
    const start = base.add(dir.mul(-(l+2*r)/2+2*r));
    const c = start.add(dir.mul(-r));

    this.notes.push(
      new Circle(c, r),
      new Text(this._id, c, this.textHeight, TextAlign.MiddleCenter, angle),
      new Text(this._content, start, this.textHeight, Text.properAlign(angle, TextAlign.MiddleLeft), angle)
    );

    return this;
  }
  leaderNote(pt: Vector, leaderVector: Vector, noteVector?: Vector): this{
    return this;
  }
}