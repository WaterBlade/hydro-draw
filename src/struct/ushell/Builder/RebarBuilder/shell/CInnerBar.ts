import {
  Line,
  LinePointRebar,
  Polyline,
  RebarPathForm,
  Side,
  StrecthSide,
  vec,
} from "@/draw";
import { UShellRebarBuilder } from "../../../UShellRebar";

export class CInnerBar extends UShellRebarBuilder {
  build(): this {
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
    this.figures.rTable.push(bar);
    this.figures.mTable.push(bar);

    this.drawCMid();
    this.drawLInner();
    this.drawSEndBeam();
    this.drawSEndWall();
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

    const left = -u.len / 2 + u.waterStop.w + u.as;
    const right = u.len / 2 - u.waterStop.w - u.as;

    const dist = offsetDist ? offsetDist : u.as;

    res.push(
      new Line(vec(left, y), vec(midLeft, y))
        .offset(dist, Side.Right)
        .divide(bar.denseSpace),
      new Line(vec(midLeft, y), vec(midRight, y))
        .offset(dist, Side.Right)
        .divide(bar.space)
        .removeStartPt()
        .removeEndPt(),
      new Line(vec(midRight, y), vec(right, y))
        .offset(dist, Side.Right)
        .divide(bar.denseSpace)
    );
    return res;
  }
  cMid = this.figures.cMid.planeRebar();
  protected drawCMid(): void {
    const u = this.struct;
    const bar = this.rebars.shell.cInner;
    const path = this.genShape()
      .offset(u.as, Side.Right)
      .removeStart()
      .removeEnd();
    this.cMid
        .spec(bar, 0, bar.space)
        .rebar(path)
  }
  lInner: LinePointRebar[] = [];
  protected drawLInner(): void {
    const bar = this.rebars.shell.cInner;
    const fig = this.figures.lInner;
    const paths = this.genMulPos();
    this.lInner.push(
      fig.linePointRebar()
        .line(paths[0])
        .spec(bar, paths[0].points.length, bar.denseSpace),
      fig.linePointRebar()
        .line(paths[1])
        .spec(bar, paths[1].points.length, bar.space),
      fig.linePointRebar()
        .line(paths[2])
        .spec(bar, paths[2].points.length, bar.denseSpace),
    );
  }
  sEndBeam = this.figures.sEndBeam.sparsePointRebar();
  protected drawSEndBeam(): void{
    const u = this.struct;
    const fig = this.figures.sEndBeam;
    const bar = this.rebars.shell.cInner;
    const r = fig.drawRadius;
    const right = fig.getBoundingBox().right;
    this.sEndBeam
      .points(...new Line(vec(u.waterStop.w + u.as+r, -u.as + r), vec(right, -u.as + r)).divide(bar.denseSpace, StrecthSide.tail).removeEndPt().points)
      .spec(bar, 0, bar.denseSpace)
  }
  sEndWall = this.figures.sEndWall.sparsePointRebar();
  protected drawSEndWall(): void{
    const u = this.struct;
    const fig = this.figures.sEndWall;
    const bar = this.rebars.shell.cInner;
    const r = fig.drawRadius;
    const right = fig.getBoundingBox().right;
    this.sEndWall
      .points(...new Line(vec(u.waterStop.w + u.as+r, -u.as + r), vec(right, -u.as + r)).divide(bar.denseSpace, StrecthSide.tail).removeEndPt().points)
      .spec(bar, 0, bar.denseSpace)
  }
}
