import {
  Arrow,
  CompositeItem,
  DrawItem,
  Line,
  Geometry,
  Polyline,
} from "@/draw/drawItem";
import { last, Side, Vector } from "@/draw/misc";
import { RebarDrawBuilder } from "./RebarDrawBuilder";

export class PlaneRebar extends RebarDrawBuilder {
  protected arrowLength: number;
  protected arrowWidth: number;
  constructor(textHeight = 3.5) {
    super(textHeight);
    this.arrowLength = textHeight;
    this.arrowWidth = this.arrowLength / 3;
  }
  notes: DrawItem[] = [];
  generate(): CompositeItem {
    const c = new CompositeItem();
    this._rebarDraw.forEach((r) => r.thickLine());
    c.push(...this.notes, ...this._rebarDraw);
    return c;
  }
  protected _rebarDraw: (Geometry & DrawItem)[] = [];
  rebar(...draws: (Geometry & DrawItem)[]): this {
    this._rebarDraw = draws;
    return this;
  }
  protected _crossLine?: Polyline;
  cross(polyline: Polyline): this {
    this._crossLine = polyline;
    return this;
  }

  note(noteVector: Vector): this {
    const polyline = this._crossLine;
    if (!polyline) {
      throw Error("note error: cross line not specified");
    }
    const end = polyline.end;
    this.notes.push(
      polyline,
      ...this.genArrowOnCross(polyline),
      new Line(end, this.genLeaderEnd(end, noteVector)),
      ...this.genLeaderText(end, noteVector)
    );
    return this;
  }

  leaderNote(pt: Vector, leaderVector: Vector, noteVector?: Vector): this {
    let start: Vector;
    if (this._crossLine) {
      start = this.findNearest(
        pt,
        this._crossLine.rayIntersect(pt, leaderVector)
      );
      if (!start) {
        throw Error("leader error: no intersection!");
      }
      this.notes.push(
        this._crossLine,
        ...this.genArrowOnCross(this._crossLine, start)
      );
    } else {
      const iters = this.genRayIters(pt, leaderVector);
      this.notes.push(...this.genArrow(pt, iters));
      start = this.findFarest(pt, iters);
    }
    this.notes.push(...this.genLeader(start, pt, noteVector));
    return this;
  }
  onlineNote(pt: Vector, dir: Vector, side = Side.Left): this {
    const iters = this.genRayIters(pt, dir);
    const [left, right] = this.findTwoEnds(pt, dir, iters);
    this.notes.push(
      new Line(left, right),
      ...this.genOnlineText(pt, dir, side),
      ...this.genDirectArrow(pt, iters)
    );

    return this;
  }
  protected genRayIters(pt: Vector, dir: Vector): Vector[] {
    const iters = [];
    for (const rebar of this._rebarDraw) {
      const pts = rebar.rayIntersect(pt, dir);
      if (pts.length == 0) {
        throw Error("gen iters error: no iters");
      }
      let nearest = pts[0];
      let minDist = nearest.sub(pt).length();
      for (let i = 1; i < pts.length; i++) {
        const p = pts[i];
        const d = p.sub(pt).length();
        if (d < minDist) {
          nearest = p;
          minDist = d;
        }
      }
      iters.push(nearest);
    }
    return iters;
  }
  protected genArrow(pt: Vector, iters: Vector[]): Arrow[] {
    const l = this.arrowLength;
    const w = this.arrowWidth;
    const dir = pt.sub(iters[0]).unit().mul(l);
    return iters.map((p) => new Arrow(p, p.add(dir), w));
  }
  protected genDirectArrow(pt: Vector, iters: Vector[]): Arrow[] {
    const l = this.arrowLength;
    const w = this.arrowWidth;
    return iters.map((p) => {
      const dir = pt.sub(p).unit().mul(l);
      return new Arrow(p, p.add(dir), w);
    });
  }
  protected genArrowOnCross(pl: Polyline, intersection?: Vector): Arrow[] {
    const l = this.arrowLength;
    const w = this.arrowWidth;
    const res: Arrow[] = [];
    let isReverse = false;

    for (const seg of pl.segments) {
      const isTransSeg =
        intersection !== undefined ? seg.includeTest(intersection) : false;
      for (const rebar of this._rebarDraw) {
        const start = seg.intersect(rebar)[0];
        if (start) {
          let factor: number;
          if (!intersection) {
            factor = 1;
          } else if (isTransSeg) {
            factor = seg.checkAhead(start, intersection) ? 1 : -1;
          } else {
            factor = isReverse ? -1 : 1;
          }
          const end = start.add(seg.getPointTangent(start).mul(l * factor));
          res.push(new Arrow(start, end, w));
        }
      }
      if (isTransSeg) isReverse = true;
    }

    if (res.length === 0) {
      throw Error("cross error: no intersection");
    }
    pl.resetStart(res[0].start);
    if (intersection) pl.resetEnd(last(res).start);

    return res;
  }
}
