import { Circle, Line } from "@/draw/drawItem";
import { last, Side, Vector } from "@/draw/misc";
import { PointRebar } from "./PointRebar";

export class LinePointRebar extends PointRebar {
  protected _line?: Line;
  line(l: Line): this {
    const pts = l.points;
    const r = this.drawRadius;
    this.rebars = pts.map((p) => new Circle(p, r).thickLine());
    this._line = l;
    return this;
  }

  protected _offsetLine?: Line;
  protected _offsetSide = Side.Left;
  offset(dist: number, side = Side.Left): this {
    const p = this._line;
    if (!p) {
      throw Error("offset error: line not init");
    }

    const op = p.project(dist, side);
    const pts = p.points;
    const offPts = op.points;
    const d = Math.min(
      offPts[0].sub(offPts[1]).length() / 2,
      this.textHeight * 0.2
    );
    const v = p.end.sub(p.start).unit().mul(d);
    offPts[0] = offPts[0].add(v);
    offPts[offPts.length - 1] = last(offPts).add(v.mul(-1));
    const notes = this.notes;
    for (let i = 0; i < pts.length; i++) {
      notes.push(new Line(pts[i], offPts[i]));
    }
    notes.push(op);
    op.resetStart(offPts[0]);
    op.resetEnd(last(offPts));
    this._offsetLine = op;
    this._offsetSide = side;
    return this;
  }

  onlineNote(ratio = 0.5): this {
    if (ratio > 1 || ratio < 0) {
      throw Error("ratio must lesser than 1 and greater than 0");
    }
    const op = this._offsetLine;
    if (!op) {
      throw Error("online note error: circle not specified or not offseted");
    }

    const pt = op.start.add(op.end).mul(ratio);

    const dir = op.end.sub(op.start);
    this.notes.push(...this.genOnlineText(pt, dir, this._offsetSide, 0));

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
