import { Arc, Circle, Line, Polyline } from "@/draw/drawItem";
import { last, RotateDirection, Side, Vector } from "@/draw/misc";
import { PointNote } from "./PointNote";

export class PathPointNote extends PointNote {
  constructor(textHeight = 3.5, public drawRadius = 0.3) {
    super(textHeight);
  }

  protected _dividedPath?: Polyline;
  path(path: Polyline): this {
    this._dividedPath = path;
    const r = this.drawRadius;
    this.rebars = path.points.map((p) => new Circle(p, r).thickLine());
    return this;
  }

  protected _offsetLine?: Polyline;
  protected _offsetSide = Side.Left;
  offset(dist: number, side = Side.Left): this {
    if (!this._dividedPath) {
      throw Error("path point note error: divide path not initialized");
    }
    const p = this._dividedPath;
    const op = p.project(dist, side);
    const pts = p.points;
    const offPts = op.points;
    const notes = this.notes;
    for (let i = 0; i < pts.length; i++) {
      notes.push(new Line(pts[i], offPts[i]));
    }

    op.resetStart(offPts[0]);
    op.resetEnd(last(offPts));

    notes.push(op);
    this._offsetLine = op;
    this._offsetSide = side;
    return this;
  }

  onlineNote(pt: Vector): this {
    const op = this._offsetLine;
    if (!op) {
      throw Error("online note error: path not specified or not offseted");
    }

    const l = this.genNoteLength();
    const r = this.textHeight;

    const nearSeg = op.getNearestSegment(pt);
    let d = 0;
    if (nearSeg instanceof Arc) {
      const isCounter = nearSeg.direction === RotateDirection.counterclockwise;
      const isLeft = this._offsetSide === Side.Left;
      if ((isCounter && isLeft) || (!isCounter && !isLeft)) {
        const segR = nearSeg.radius;
        d = segR - Math.sqrt(segR ** 2 - 0.25 * (l + 2 * r) ** 2);
      }
    }
    const nearPt = nearSeg.getNearestPt(pt);
    const dir = nearSeg.getPointTangent(nearPt);
    this.notes.push(...this.genOnlineText(nearPt, dir, this._offsetSide, d));

    return this;
  }
  leaderNote(pt: Vector, leaderVector: Vector, noteVector?: Vector): this {
    if (!this._offsetLine) {
      throw Error("leader note error: offset not init");
    }
    const iters = this._offsetLine.rayIntersect(pt, leaderVector);
    const start = this.findNearest(pt, iters);

    this.notes.push(...this.genLeader(start, pt, noteVector));
    return this;
  }
}
