import { Polyline, RebarPathForm, Side, SparsePointRebar, vec } from "@/draw";
import { UShellRebarBuilder } from "../../../UShellRebar";

export class CInnerSubBar extends UShellRebarBuilder {
  build(): this {
    const u = this.struct;
    const bar = this.rebars.shell.cInnerSub;
    const parent = this.rebars.shell.cInner;
    const id = parent.id;
    const lens = this.genShape().lengths;

    bar
      .setGrade(parent.grade)
      .setDiameter(parent.diameter)
      .setForm(
        new RebarPathForm(bar.diameter)
          .lineBy(0, -1.6)
          .dimLength(lens[0])
          .arcBy(4, 0, 180)
          .dimArc(u.r + u.waterStop.h + u.as)
          .dimLength(lens[1])
          .lineBy(0, 1.6)
          .dimLength(lens[2])
      )
      .setCount(2)
      .setId(id + 'a')
      .setStructure(this.name);
    this.figures.rTable.push(bar);
    this.figures.mTable.push(bar);

    this.drawCEnd();
    this.drawLInner();
    this.drawSEndBeam();
    this.drawSEndWall();
    return this;
  }
  protected genShape(offsetDist?: number): Polyline {
    const u = this.struct;
    const dist = offsetDist ? offsetDist : u.as;
    return new Polyline(-u.r - u.waterStop.h - 1, u.hd)
      .lineBy(1, 0)
      .lineBy(0, -u.hd)
      .arcBy(2 * u.r + 2 * u.waterStop.h, 0, 180)
      .lineBy(0, u.hd)
      .lineBy(1, 0)
      .offset(dist, Side.Right)
      .removeStart()
      .removeEnd();
  }
  cEnd = this.figures.cEnd.planeRebar();
  protected drawCEnd(): void {
    const bar = this.rebars.shell.cInnerSub;
    this.cEnd
      .rebar(this.genShape())
      .spec(bar)
  }
  lInner: SparsePointRebar[] = [];
  protected drawLInner(): void{
    const u = this.struct;
    const bar = this.rebars.shell.cInnerSub;
    const fig = this.figures.lInner;
    const r = fig.drawRadius;
    const y = -u.r - u.waterStop.h -u.as + r;
    const x0 = -u.len/2 + u.as + r;
    const x1 = u.len/2 - u.as - r;
    this.lInner.push(
      fig.sparsePointRebar().points(vec(x0, y)).spec(bar),
      fig.sparsePointRebar().points(vec(x1, y)).spec(bar)
    )
    
  }
  sEndBeam = this.figures.sEndBeam.sparsePointRebar();
  protected drawSEndBeam(): void{
    const u = this.struct;
    const fig = this.figures.sEndBeam;
    const bar = this.rebars.shell.cInnerSub;
    const r = fig.drawRadius;
    const y = -u.waterStop.h - u.as + r ;
    this.sEndBeam
      .points(vec(u.waterStop.w/2, y))
      .spec(bar)
  }
  sEndWall = this.figures.sEndWall.sparsePointRebar();
  protected drawSEndWall(): void{
    const u = this.struct;
    const fig = this.figures.sEndWall;
    const bar = this.rebars.shell.cInnerSub;
    const r = fig.drawRadius;
    this.sEndWall
      .points(vec(u.waterStop.w/2, -u.waterStop.h - u.as - r))
      .spec(bar)
  }
}
