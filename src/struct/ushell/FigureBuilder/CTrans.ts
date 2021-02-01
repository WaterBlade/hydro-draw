import { Line, Polyline, vec } from "@/draw";
import { UShellFigureContext } from "../UShell";

export class CTrans extends UShellFigureContext {
  initFigure(): this {
    this.figures.cTrans
      .resetScale(1, 50)
      .setTitle("槽身渐变段钢筋图")
      .displayScale()
      .keepTitlePos()
      .centerAligned();
    this.figures.record(this.figures.cTrans);
    return this;
  }
  build(): void {
    this.buildOutline();
    this.buildRebar();
  }
  protected buildOutline(): this {
    const u = this.struct;
    this.figures.cTrans.addOutline(
      u.genCInner().greyLine(),
      u.genTransCOuter().greyLine(),
      u.genEndCOuter().greyLine(),
      new Line(
        vec(-u.shell.r + u.iBeam.w, u.shell.hd),
        vec(-u.shell.r - u.shell.t - u.oBeam.w, u.shell.hd)
      ).greyLine(),
      new Line(
        vec(u.shell.r - u.iBeam.w, u.shell.hd),
        vec(u.shell.r + u.shell.t + u.oBeam.w, u.shell.hd)
      ).greyLine()
    );
    return this;
  }
  protected buildRebar(): void {
    this.drawArc();
    this.drawDirect();
  }
  protected drawArc(): void {
    const u = this.struct;
    const fig = this.figures.cTrans;
    const bar = this.rebars.trans.arc;
    const x = 0;
    const lines = this.shape.trans.arc();
    fig.push(
      fig
        .planeRebar()
        .spec(bar, lines.length, bar.space)
        .rebar(...lines)
        .cross(
          new Polyline(-u.shell.r - u.shell.t / 2 - u.oBeam.w / 2, 0).arcTo(
            u.shell.r + u.shell.t / 2 + u.oBeam.w / 2,
            0,
            180
          )
        )
        .leaderNote(vec(x, -u.shell.r / 2), vec(0, 1), vec(-1, 0))
        .generate()
    );
  }
  protected drawDirect(): void {
    const u = this.struct;
    const fig = this.figures.cTrans;
    const bar = this.rebars.trans.direct;
    const left = this.shape.trans.direct();
    const right = left.map((l) => l.mirrorByVAxis());
    fig.push(
      fig
        .planeRebar()
        .spec(bar, left.length, bar.space)
        .rebar(...left)
        .leaderNote(
          vec(-u.shell.r - (u.shell.t + u.oBeam.w) / 2, u.shell.hd + 2 * fig.h),
          vec(0, 1),
          vec(1, 0)
        )
        .generate(),
      fig
        .planeRebar()
        .spec(bar, left.length, bar.space)
        .rebar(...right)
        .leaderNote(
          vec(u.shell.r + (u.shell.t + u.oBeam.w) / 2, u.shell.hd + 2 * fig.h),
          vec(0, 1),
          vec(-1, 0)
        )
        .generate()
    );
  }
}
