import { Circle, Line } from "@/draw/drawItem";
import { polar, Side, Vector } from "@/draw/misc";
import { PointRebar } from "./PointRebar";

export class CirclePointRebar extends PointRebar {
  protected _circle?: Circle;
  circle(c: Circle): this {
    const pts = c.points;
    const r = this.drawRadius;
    this.rebars = pts.map((p) => new Circle(p, r).thickLine());
    this._circle = c;
    return this;
  }

  protected _offsetCircle?: Circle;
  protected _offsetSide = Side.Left;
  offset(dist: number, side = Side.Left): this {
    const p = this._circle;
    if (!p) {
      throw Error("offset error: circle not init");
    }

    const op = p.project(dist, side);
    const pts = p.points;
    const offPts = op.points;
    const notes = this.notes;
    for (let i = 0; i < pts.length; i++) {
      notes.push(new Line(pts[i], offPts[i]));
    }
    notes.push(op);
    this._offsetCircle = op;
    this._offsetSide = side;
    return this;
  }

  onlineNote(angle = 90): this {
    const op = this._offsetCircle;
    if (!op) {
      throw Error("online note error: circle not specified or not offseted");
    }

    const pt = polar(op.radius, angle).add(op.center);

    const l = this.genNoteLength();
    const r = this.textHeight;

    let d = 0;
    if (this._offsetSide === Side.Left) {
      const offsetRadius = op.radius;
      d = offsetRadius - Math.sqrt(offsetRadius ** 2 - 0.25 * (l + 2 * r) ** 2);
    }
    const nearPt = op.center.add(pt.sub(op.center).unit().mul(op.radius));
    const dir = pt.sub(op.center).norm();
    this.notes.push(...this.genOnlineText(nearPt, dir, this._offsetSide, d));

    return this;
  }

  leaderNote(pt: Vector, leaderVector: Vector, noteVector?: Vector): this {
    if (!this._offsetCircle) {
      throw Error("leader note error: offset not init");
    }
    const iters = this._offsetCircle.rayIntersect(pt, leaderVector);
    const start = this.findNearest(pt, iters);

    this.notes.push(...this.genLeader(start, pt, noteVector));

    return this;
  }
}
