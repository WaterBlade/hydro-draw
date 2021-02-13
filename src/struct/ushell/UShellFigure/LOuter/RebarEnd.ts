import { Line, vec } from "@/draw";
import { FigureContent } from "@/struct/utils";
import { UShellRebar } from "../../UShellRebar";
import { UShellStruct } from "../../UShellStruct";

export class RebarEnd {
  build(u: UShellStruct, rebars: UShellRebar, fig: FigureContent): void {
    this.drawCOuter(u, rebars, fig);
  }
  protected drawCOuter(
    u: UShellStruct,
    rebars: UShellRebar,
    fig: FigureContent
  ): void {
    const bar = rebars.end.cOuter;
    const as = rebars.info.as;
    const y0 = u.shell.hd - as;
    const y1 = u.shell.hd - u.endHeight + as;
    const y = u.shell.hd - 6 * fig.h;
    const leftXs = new Line(
      vec(-u.len / 2 + u.cantLeft + as, 0),
      vec(-u.len / 2 + u.cantLeft + u.endSect.b - as, 0)
    )
      .divideByCount(bar.singleCount)
      .points.map((p) => p.x);
    const rightXs = new Line(
      vec(u.len / 2 - u.cantRight - as, 0),
      vec(u.len / 2 - u.cantRight - u.endSect.b + as, 0)
    )
      .divideByCount(bar.singleCount)
      .points.map((p) => p.x);
    fig.push(
      fig
        .planeRebar()
        .rebar(...leftXs.map((x) => new Line(vec(x, y0), vec(x, y1))))
        .spec(bar.spec, bar.singleCount)
        .leaderNote(vec(-u.len / 2 - 2 * fig.textHeight, y), vec(1, 0))
        .generate(),
      fig
        .planeRebar()
        .rebar(...rightXs.map((x) => new Line(vec(x, y0), vec(x, y1))))
        .spec(bar.spec, bar.singleCount)
        .leaderNote(vec(u.len / 2 + 2 * fig.textHeight, y), vec(1, 0))
        .generate()
    );
  }
}
