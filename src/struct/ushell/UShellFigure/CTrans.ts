import { Line, Polyline, vec } from "@/draw";
import { Figure, FigureContent } from "@/struct/utils";
import { UShellRebar } from "../UShellRebar";
import { UShellStruct } from "../UShellStruct";

export class CTrans extends Figure {
  initFigure(): void {
    this.fig = new FigureContent();
    this.fig
      .resetScale(1, 50)
      .setTitle("槽身渐变段钢筋图")
      .displayScale()
      .keepTitlePos()
      .centerAligned();
    this.container.record(this.fig);
  }
  build(u: UShellStruct, rebars: UShellRebar): void {
    this.buildOutline(u);
    this.buildRebar(u, rebars);
  }
  protected buildOutline(u: UShellStruct): void {
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
  protected buildRebar(u: UShellStruct, rebars: UShellRebar): void {
    this.drawArc(u, rebars);
    this.drawDirect(u, rebars);
  }
  protected drawArc(u: UShellStruct, rebars: UShellRebar): void {
    const fig = this.fig;
    const bar = rebars.trans.arc;
    const x = 0;
    const lines = bar.shape(u);
    fig.push(
      fig
        .planeRebar()
        .spec(bar.spec, lines.length, bar.space)
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
  protected drawDirect(u: UShellStruct, rebars: UShellRebar): void {
    const fig = this.fig;
    const bar = rebars.trans.direct;
    const left = bar.shape(u);
    const right = left.map((l) => l.mirrorByVAxis());
    fig.push(
      fig
        .planeRebar()
        .spec(bar.spec, left.length, bar.space)
        .rebar(...left)
        .leaderNote(
          vec(-u.shell.r - (u.shell.t + u.oBeam.w) / 2, u.shell.hd + 2 * fig.h),
          vec(0, 1),
          vec(1, 0)
        )
        .generate(),
      fig
        .planeRebar()
        .spec(bar.spec, left.length, bar.space)
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
