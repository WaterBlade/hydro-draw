import {
  Arrow,
  Circle,
  CompositeItem,
  DrawItem,
  Line,
  Text,
  Content,
  Geometry,
  Polyline,
} from "@/draw/drawItem";
import { last, Side, TextAlign, Vector } from "@/draw/misc";
import { Builder } from "../Builder.interface";
import { RebarSpec } from "./RebarSpec";

export class ArrowNote implements Builder<CompositeItem> {
  protected arrowLength: number;
  protected arrowWidth: number;
  constructor(public textHeight = 3.5) {
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
    const dir = noteVector ? noteVector : pt.sub(start).unit();
    const end = this.genLeaderEnd(pt, dir);

    if (noteVector) {
      this.notes.push(new Line(start, pt), new Line(pt, end));
    } else {
      this.notes.push(new Line(start, end));
    }
    this.notes.push(...this.genLeaderText(pt, dir));
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
  protected findFarest(pt: Vector, iters: Vector[]): Vector {
    let far = iters[0];
    let maxDist = pt.sub(far).length();
    for (let i = 1; i < iters.length; i++) {
      const p = iters[i];
      const d = p.sub(pt).length();
      if (d > maxDist) {
        far = p;
        maxDist = d;
      }
    }
    return far;
  }
  protected findNearest(pt: Vector, iters: Vector[]): Vector {
    let near = iters[0];
    let minDist = pt.sub(near).length();
    for (let i = 1; i < iters.length; i++) {
      const p = iters[i];
      const d = p.sub(pt).length();
      if (d < minDist) {
        near = p;
        minDist = d;
      }
    }
    return near;
  }
  protected findTwoEnds(
    pt: Vector,
    dir: Vector,
    iters: Vector[]
  ): [Vector, Vector] {
    const v = dir.unit();
    let leftMost = iters[0];
    let leftDist = leftMost.sub(pt).dot(v);
    let rightMost = iters[0];
    let rightDist = rightMost.sub(pt).dot(v);
    for (let i = 1; i < iters.length; i++) {
      const p = iters[i];
      const dist = p.sub(pt).dot(v);
      if (leftDist > dist) {
        leftMost = p;
        leftDist = dist;
      }
      if (rightDist < dist) {
        rightMost = p;
        rightDist = dist;
      }
    }
    return [leftMost, rightMost];
  }

  protected genLeaderEnd(pt: Vector, dir: Vector): Vector {
    const l = this._content.length * this.textHeight * 0.7;
    return pt.add(dir.unit().mul(l));
  }

  protected genLeaderText(pt: Vector, dir: Vector): (Circle | Text)[] {
    const insertPt = this.genLeaderEnd(pt, dir);
    const angle = dir.quadrantAngle();
    const align = TextAlign.BottomRight;
    const r = this.textHeight;
    const centerPt = insertPt.add(dir.unit().mul(r));

    return [
      new Circle(centerPt, r),
      new Text(
        this._id,
        centerPt,
        this.textHeight,
        TextAlign.MiddleCenter,
        Text.properAngle(angle)
      ),
      new Text(
        this._content,
        insertPt,
        this.textHeight,
        Text.properAlign(angle, align),
        Text.properAngle(angle)
      ),
    ];
  }

  protected genOnlineText(
    pt: Vector,
    dir: Vector,
    side: Side
  ): (Circle | Text)[] {
    const f = side === Side.Left ? 1 : -1;
    const v = dir.norm().unit().mul(f);
    const r = this.textHeight;
    const insertPt = pt.add(v.mul(r));
    const centerPt = insertPt.add(dir.unit().mul(-r));
    const align = TextAlign.MiddleLeft;
    const angle = dir.quadrantAngle();
    return [
      new Circle(centerPt, r),
      new Text(
        this._id,
        centerPt,
        this.textHeight,
        TextAlign.MiddleCenter,
        Text.properAngle(angle)
      ),
      new Text(
        this._content,
        insertPt,
        this.textHeight,
        Text.properAlign(angle, align),
        Text.properAngle(angle)
      ),
    ];
  }
}
