import {
  ArrowNote,
  Line,
  LinePointNote,
  Polyline,
  RebarPathForm,
  Side,
  SparsePointNote,
  StrecthSide,
  vec,
} from "@/draw";
import { UShellRebarBuilder } from "../../UShellRebar";

export class CInnerBar extends UShellRebarBuilder {
  buildRebar(): this {
    const u = this.struct;
    const bar = this.rebars.shell.cInner;
    const path = this.genShape()
      .offset(u.as, Side.Right)
      .removeStart()
      .removeEnd();
    const lens = path.segments.map((s) => s.calcLength());
    const form = new RebarPathForm(bar.diameter)
      .lineBy(0, -1.6)
      .dimLength(lens[0])
      .arcBy(4, 0, 180)
      .dimArc(u.r + u.as)
      .dimLength(lens[1])
      .lineBy(0, 1.6)
      .dimLength(lens[2]);

    bar.setForm(form);
    bar.setCount(
      this.genMulPos().reduce((pre: number, cur) => pre + cur.points.length, 0)
    );
    bar.setId(this.id()).setStructure(this.name);
    return this;
  }
  buildFigure(): this {
    const bar = this.rebars.shell.cInner;
    this.drawCMid();
    this.drawLInner();
    this.drawSEndBeam();
    this.drawSEndWall();
    this.figures.rTable.push(bar);
    this.figures.mTable.push(bar);
    return this;
  }
  protected genShape(): Polyline {
    const u = this.struct;
    const path = new Polyline(-u.r - 1, u.hd)
      .lineBy(1, 0)
      .lineBy(0, -u.hd)
      .arcBy(2 * u.r, 0, 180)
      .lineBy(0, u.hd)
      .lineBy(1, 0);
    return path;
  }
  protected genMulPos(offsetDist?: number): Line[] {
    const u = this.struct;
    const bar = this.rebars.shell.cInner;
    const res: Line[] = [];
    const y = -u.r;
    const midLeft = -u.len / 2 + u.cantLeft + u.denseL;
    const midRight = u.len / 2 - u.cantRight - u.denseL;

    let left: number;
    if (u.cantLeft > 0) {
      left = -u.len / 2 + u.waterStop.w + u.as;
    } else {
      left = -u.len / 2 + u.endSect.b;
    }
    let right: number;
    if (u.cantRight > 0) {
      right = u.len / 2 - u.waterStop.w - u.as;
    } else {
      right = u.len / 2 - u.endSect.b;
    }

    const dist = offsetDist ? offsetDist : u.as;

    res.push(
      new Line(vec(left, y), vec(midLeft, y))
        .offset(dist, Side.Right)
        .divide(bar.denseSpace)
        .removeStartPt(),
      new Line(vec(midLeft, y), vec(midRight, y))
        .offset(dist, Side.Right)
        .divide(bar.space)
        .removeStartPt()
        .removeEndPt(),
      new Line(vec(midRight, y), vec(right, y))
        .offset(dist, Side.Right)
        .divide(bar.denseSpace)
        .removeEndPt()
    );
    return res;
  }
  protected drawCMid(): void {
    const u = this.struct;
    const bar = this.rebars.shell.cInner;
    const fig = this.figures.cMid;
    const path = this.genShape()
      .offset(u.as, Side.Right)
      .removeStart()
      .removeEnd();
    const pt = vec(-u.r + 3 * fig.textHeight, u.hd / 5);
    fig.push(
      new ArrowNote(fig.textHeight)
        .spec(bar, 0, bar.space)
        .rebar(path)
        .leaderNote(pt, vec(1, 0))
        .generate()
    );
  }
  protected drawLInner(): void {
    const bar = this.rebars.shell.cInner;
    const fig = this.figures.lInner;
    const paths = this.genMulPos();
    fig.push(
      new LinePointNote(fig.textHeight, fig.drawRadius)
        .line(paths[0])
        .offset(2 * fig.textHeight)
        .spec(bar, paths[0].points.length, bar.denseSpace)
        .onlineNote()
        .generate(),
      new LinePointNote(fig.textHeight, fig.drawRadius)
        .line(paths[1])
        .offset(2 * fig.textHeight)
        .spec(bar, paths[1].points.length, bar.space)
        .onlineNote()
        .generate(),
      new LinePointNote(fig.textHeight, fig.drawRadius)
        .line(paths[2])
        .offset(2 * fig.textHeight)
        .spec(bar, paths[2].points.length, bar.denseSpace)
        .onlineNote()
        .generate()
    );
  }
  protected drawSEndBeam(): void{
    const u = this.struct;
    const fig = this.figures.sEndBeam;
    const bar = this.rebars.shell.cInner;
    const r = fig.drawRadius;
    const right = u.endSect.b + u.trans + 1.25*(u.t + u.butt.h);
    fig.push(
      new SparsePointNote(fig.textHeight, r, 30)
        .points(...new Line(vec(u.endSect.b, -u.as+r), vec(right, -u.as + r)).divide(bar.denseSpace, StrecthSide.tail).removeStartPt().removeEndPt().points)
        .spec(bar, 0, bar.denseSpace)
        .parallelLeader(vec(right + fig.textHeight, 2*fig.textHeight), vec(1, 0))
        .generate()
    )
  }
  protected drawSEndWall(): void{
    const u = this.struct;
    const fig = this.figures.sEndWall;
    const bar = this.rebars.shell.cInner;
    const r = fig.drawRadius;
    const right = u.endSect.b + u.trans + 1.25*u.t ;
    fig.push(
      new SparsePointNote(fig.textHeight, r, 30)
        .points(...new Line(vec(u.endSect.b, -u.as+r), vec(right, -u.as + r)).divide(bar.denseSpace, StrecthSide.tail).removeStartPt().removeEndPt().points)
        .spec(bar, 0, bar.denseSpace)
        .parallelLeader(vec(right + fig.textHeight, 2*fig.textHeight), vec(1, 0))
        .generate()
    )
  }
}
