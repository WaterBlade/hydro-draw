import { Line, vec, Vector } from "@/draw";
import { UShellFigureContext } from "../../UShell";

export class RebarShell extends UShellFigureContext {
  build(): void {
    this.drawLOuter();
    this.drawCOuter();
    this.drawMain();
  }
  protected drawLOuter(): void {
    const u = this.struct;
    const bar = this.rebars.shell.lOuter;
    const fig = this.figures.lOuter;
    const as = this.rebars.as;
    const ys = this.pos.shell
      .lOuter()
      .removeStart()
      .points.map((p) => p.y);
    const start = -u.len / 2 + as;
    const end = u.len / 2 - as;

    const x = (-0.8 * u.len) / 2;

    fig.push(
      fig
        .planeRebar()
        .spec(bar, 0, bar.space)
        .rebar(...ys.map((y) => new Line(vec(start, y), vec(end, y))))
        .leaderNote(
          vec(x, u.shell.hd + 2 * fig.textHeight),
          vec(0, 1),
          vec(-1, 0)
        )
        .generate()
    );
  }
  protected drawCOuter(): void {
    const u = this.struct;
    const bar = this.rebars.shell.cOuter;
    const fig = this.figures.lOuter;
    const as = this.rebars.as;
    const paths = this.pos.shell.cOuter();
    const top = u.shell.hd - as;

    const pts = paths.reduce(
      (pre: Vector[], cur) => pre.concat(cur.points),
      []
    );
    const lines = pts.map((p) => new Line(vec(p.x, top), p));

    const y = u.shell.hd - 2 * fig.h;

    fig.push(
      fig
        .planeRebar()
        .rebar(...lines)
        .spec(bar, pts.length)
        .leaderNote(vec(-u.len / 2 - 2 * fig.textHeight, y), vec(1, 0))
        .generate()
    );
  }
  protected drawMain(): void {
    const u = this.struct;
    const bar = this.rebars.shell.main;
    const fig = this.figures.lOuter;
    const as = this.rebars.as;
    const y = -u.shell.r - u.shell.t - u.shell.hb + as;
    fig.push(
      fig
        .planeRebar()
        .rebar(new Line(vec(-u.len / 2 + as, y), vec(u.len / 2 - as, y)))
        .spec(bar)
        .leaderNote(
          vec(-u.len / 4, y - 4 * fig.textHeight),
          vec(0, 1),
          vec(1, 0)
        )
        .generate()
    );
  }
}
