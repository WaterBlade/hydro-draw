import { Line, Polyline, vec } from "@/draw";
import { FigureConfig } from "@/struct/utils";
import { UShellBasicFigure } from "./UShellFigure";

export class CTrans extends UShellBasicFigure {
  protected unitScale = 1;
  protected drawScale = 50;
  protected title = "槽身渐变段钢筋图";
  protected config = new FigureConfig(true, true);
  draw(): void {
    this.drawOutline();
    this.drawArc();
    this.drawDirect();
  }
  protected drawOutline(): void {
    const u = this.struct;
    this.fig.addOutline(
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
  }
  protected drawArc(): void {
    const u = this.struct;
    const rebars = this.rebars;
    const fig = this.fig;
    const bar = rebars.trans.arc;
    const x = 0;
    const lines = bar.shape();
    fig.push(
      fig
        .planeRebar()
        .spec(bar)
        .count(lines.length)
        .space(bar.space)
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
    const fig = this.fig;
    const bar = this.rebars.trans.direct;
    const left = bar.shape();
    const right = left.map((l) => l.mirrorByVAxis());
    fig.push(
      fig
        .planeRebar()
        .spec(bar)
        .count(left.length)
        .space(bar.space)
        .rebar(...left)
        .leaderNote(
          vec(-u.shell.r - (u.shell.t + u.oBeam.w) / 2, u.shell.hd + 2 * fig.h),
          vec(0, 1),
          vec(1, 0)
        )
        .generate(),
      fig
        .planeRebar()
        .spec(bar)
        .count(left.length)
        .space(bar.space)
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
