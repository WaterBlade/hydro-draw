import {
  Circle,
  CompositeItem,
  Content,
  DrawItem,
  Line,
  Text,
} from "@/draw/drawItem";
import { Side, TextAlign, Vector } from "@/draw/misc";
import { Builder } from "@/draw/builder/Builder.interface";
import { RebarSpec } from "../RebarSpec";

export abstract class RebarDrawBuilder implements Builder<CompositeItem> {
  constructor(public textHeight = 3.5) {}
  abstract generate(): CompositeItem;
  protected _content = new Content();
  protected _id = "";
  spec(s: RebarSpec, count = 0, space = 0, denSpace=0): this {
    this._content = new Content();
    this._id = s.id;
    if (count) this._content.text(`${count}`);
    this._content.special(s.grade).text(`${s.diameter}`);
    if (space) this._content.text(`@${space}`);
    if (denSpace) this._content.text(`(${denSpace})`);
    return this;
  }
  protected _mulIds: string[] = [];
  mulSpec(...specs: RebarSpec[]): this{
    this._mulIds.push(...specs.map(s=>s.id));
    return this;
  }
  protected genNoteLength(): number {
    return this._content.length * this.textHeight * 0.7;
  }
  protected genLeaderEnd(pt: Vector, dir: Vector): Vector {
    const l = this.genNoteLength();
    return pt.add(dir.unit().mul(l));
  }
  protected genLeaderText(pt: Vector, dir: Vector): (Circle | Text)[] {
    const insertPt = this.genLeaderEnd(pt, dir);
    const angle = dir.quadrantAngle();
    const align = TextAlign.BottomRight;
    const r = this.textHeight;
    const centerPt = insertPt.add(dir.unit().mul(r));

    const res = [
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
      )
    ];

    if(this._mulIds.length > 0){
      const v = dir.unit().mul(2 * r);
      let p = centerPt.add(v);
      for(const id of this._mulIds){
        res.push(
          new Circle(p, r),
          new Text(
            id,
            p,
            this.textHeight,
            TextAlign.MiddleCenter,
            Text.properAngle(angle)
          )
        )
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
  ): (Circle | Text)[] {
    const f = side === Side.Left ? 1 : -1;
    const v = dir.norm().unit().mul(f);
    const r = this.textHeight;
    const l = this.genNoteLength();
    const textDir = Text.properVector(dir);
    const insertPt = pt.add(v.mul(r + dist)).add(textDir.mul(r - l / 2));
    const centerPt = insertPt.add(dir.unit().mul(-r));
    const align = TextAlign.MiddleLeft;
    const angle = dir.quadrantAngle();
    const res = [
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

    if(this._mulIds.length > 0){
      const v = dir.unit().mul(-2 * r);
      let p = centerPt.add(v);
      for(const id of this._mulIds){
        res.push(
          new Circle(p, r),
          new Text(
            id,
            p,
            this.textHeight,
            TextAlign.MiddleCenter,
            Text.properAngle(angle)
          )
        )
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
