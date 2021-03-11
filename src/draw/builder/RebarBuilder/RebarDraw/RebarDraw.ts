import {
  Circle,
  CompositeItem,
  Content,
  DrawItem,
  Line,
  TextDraw,
} from "@/draw/drawItem";
import { RebarDiameter, Side, TextAlign, Vector } from "@/draw/misc";
import { Builder } from "@/draw/builder/Builder.interface";
import { RebarGrade } from "../RebarSpec";

interface RebarInfo {
  id: string;
  grade: RebarGrade;
  diameter: RebarDiameter;
}

export abstract class RebarDraw implements Builder<CompositeItem> {
  constructor(public textHeight = 3.5) {}
  abstract generate(): CompositeItem;
  spec(s: RebarInfo, count = 0, space = 0, denSpace = 0): this {
    this._idList.push(s.id);
    this._grade = s.grade;
    this._diameter = s.diameter;
    this._count = count;
    this._space = space;
    this._denSpace = denSpace;
    return this;
  }
  protected _idList: string[] = [];
  protected _grade: RebarGrade = "HRB400";
  protected _diameter: RebarDiameter = 8;
  protected _count = 0;
  count(count: number): this {
    this._count = count;
    return this;
  }
  protected _space = 0;
  protected _denSpace = 0;
  space(space: number, denSpace?: number): this {
    this._space = space;
    if (denSpace) this._denSpace = denSpace;
    return this;
  }
  protected genNoteContent(): Content {
    const content = new Content();
    if (this._count) content.text(`${this._count}`);
    content.special(this._grade).text(`${this._diameter}`);
    if (this._space) content.text(`@${this._space}`);
    if (this._denSpace) content.text(`/${this._denSpace}`);
    return content;
  }
  mulSpec(...specs: RebarInfo[]): this {
    this._idList.push(...specs.map((s) => s.id));
    return this;
  }
  protected genNoteLength(): number {
    return this.genNoteContent().length * this.textHeight * 0.7;
  }
  protected genLeaderEnd(pt: Vector, dir: Vector): Vector {
    const l = this.genNoteLength();
    return pt.add(dir.unit().mul(l));
  }
  protected genLeaderText(pt: Vector, dir: Vector): (Circle | TextDraw)[] {
    const insertPt = this.genLeaderEnd(pt, dir);
    const angle = dir.quadrantAngle();
    const align = TextAlign.BottomRight;
    const r = this.textHeight;
    const centerPt = insertPt.add(dir.unit().mul(r));

    const res: (Circle | TextDraw)[] = [
      new TextDraw(
        this.genNoteContent(),
        insertPt,
        this.textHeight,
        TextDraw.properAlign(angle, align),
        TextDraw.properAngle(angle)
      ),
    ];

    if (this._idList.length > 0) {
      const v = dir.unit().mul(2 * r);
      let p = centerPt;
      for (const id of this._idList) {
        res.push(
          new Circle(p, r),
          new TextDraw(
            id,
            p,
            this.textHeight,
            TextAlign.MiddleCenter,
            TextDraw.properAngle(angle)
          )
        );
        p = p.add(v);
      }
    }

    return res;
  }
  protected genLeader(
    start: Vector,
    pt: Vector,
    noteVector?: Vector
  ): DrawItem[] {
    const dir = noteVector ? noteVector : pt.sub(start).unit();
    const end = this.genLeaderEnd(pt, dir);

    const res: DrawItem[] = [];

    if (noteVector) {
      res.push(new Line(start, pt), new Line(pt, end));
    } else {
      res.push(new Line(start, end));
    }
    res.push(...this.genLeaderText(pt, dir));
    return res;
  }
  protected genOnlineText(
    pt: Vector,
    dir: Vector,
    side: Side,
    dist = 0
  ): (Circle | TextDraw)[] {
    const f = side === Side.Left ? 1 : -1;
    const v = dir.norm().unit().mul(f);
    const r = this.textHeight;
    const l = this.genNoteLength();
    const textDir = TextDraw.properVector(dir);
    const insertPt = pt.add(v.mul(r + dist)).add(textDir.mul(r - l / 2));
    const centerPt = insertPt.add(textDir.unit().mul(-r));
    const angle = textDir.quadrantAngle();
    const align = TextDraw.properAlign(angle, TextAlign.MiddleLeft);
    const res: (Circle | TextDraw)[] = [
      new TextDraw(
        this.genNoteContent(),
        insertPt,
        this.textHeight,
        align,
        angle
      ),
    ];

    if (this._idList.length > 0) {
      const v = dir.unit().mul(-2 * r);
      let p = centerPt;
      for (const id of this._idList) {
        res.push(
          new Circle(p, r),
          new TextDraw(id, p, this.textHeight, TextAlign.MiddleCenter, angle)
        );
        p = p.add(v);
      }
    }

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
}
