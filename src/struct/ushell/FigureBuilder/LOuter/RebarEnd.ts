import { Line, vec } from "@/draw";
import { UShellFigureContext } from "../../UShell";

export class RebarEnd extends UShellFigureContext {
  build(): void {
    this.drawCOuter();
  }
  protected drawCOuter(): void {
    const u = this.struct;
    const bar = this.rebars.end.cOuter;
    const fig = this.figures.lOuter;
    const as = this.rebars.as;
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
        .spec(bar, bar.singleCount)
        .leaderNote(vec(-u.len / 2 - 2 * fig.textHeight, y), vec(1, 0))
        .generate(),
      fig
        .planeRebar()
        .rebar(...rightXs.map((x) => new Line(vec(x, y0), vec(x, y1))))
        .spec(bar, bar.singleCount)
        .leaderNote(vec(u.len / 2 + 2 * fig.textHeight, y), vec(1, 0))
        .generate()
    );
  }
}
