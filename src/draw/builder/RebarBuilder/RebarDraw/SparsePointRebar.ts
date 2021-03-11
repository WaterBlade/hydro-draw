import { Circle, Line, rawInterLineAndLine } from "@/draw/drawItem";
import { Side, Vector } from "@/draw/misc";
import { PointRebar } from "./PointRebar";

export class SparsePointRebar extends PointRebar {
  constructor(textHeight = 3.5, drawRadius = 0.3, public leaderAngle = 30) {
    super(textHeight, drawRadius);
  }
  protected _points: Vector[] = [];
  points(...pts: Vector[]): this {
    this._points.push(...pts);
    const r = this.drawRadius;
    this.rebars.push(...pts.map((p) => new Circle(p, r).thickLine()));
    return this;
  }
  parallelLeader(pt: Vector, leaderVector: Vector, noteVector?: Vector): this {
    const pts = this._points;
    const iters = this.genIters(pt, leaderVector);
    const start = this.findFarest(pt, iters);
    const notes = this.notes;
    for (let i = 0; i < iters.length; i++) {
      notes.push(new Line(iters[i], pts[i]));
    }
    notes.push(...this.genLeader(start, pt, noteVector));
    return this;
  }
  parrallelOnline(pt: Vector, dir: Vector, side = Side.Left): this {
    const pts = this._points;
    const iters = this.genIters(pt, dir);
    const [start, end] = this.findTwoEnds(pt, dir, iters);
    const notes = this.notes;
    notes.push(new Line(start, end));
    for (let i = 0; i < iters.length; i++) {
      notes.push(new Line(iters[i], pts[i]));
    }
    notes.push(...this.genOnlineText(pt, dir, side));
    return this;
  }
  protected genIters(pt: Vector, dir: Vector): Vector[] {
    const n = dir.norm();
    const ptOnDir = pt.add(dir);
    const res: Vector[] = [];
    for (const p of this._points) {
      const lineToPt = pt.sub(p);
      let angle: number;
      const dotRes = n.dot(lineToPt);
      const crossRes = n.cross(lineToPt);
      if (dotRes > 0) {
        if (crossRes > 0) {
          angle = this.leaderAngle;
        } else {
          angle = -this.leaderAngle;
        }
      } else {
        if (crossRes > 0) {
          angle = 180 - this.leaderAngle;
        } else {
          angle = 180 + this.leaderAngle;
        }
      }
      const v = n.rotate(angle);

      const rayIter = rawInterLineAndLine(p, p.add(v), pt, ptOnDir)[0];
      if (!rayIter) {
        throw Error("gen iters error: line do not iter each other");
      }

      res.push(rayIter);
    }
    return res;
  }

  jointLeader(joint: Vector, pt: Vector, noteVector?: Vector): this {
    this.notes.push(
      ...this._points.map((p) => new Line(p, joint)),
      ...this.genLeader(joint, pt, noteVector)
    );
    return this;
  }
}
