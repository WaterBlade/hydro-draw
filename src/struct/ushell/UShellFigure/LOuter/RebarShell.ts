import { Line, vec, Vector } from "@/draw";
import { FigureContent } from "@/struct/utils";
import { UShellRebar } from "../../UShellRebar";
import { UShellStruct } from "../../UShellStruct";

export class RebarShell{
  build(u: UShellStruct, rebars: UShellRebar, fig: FigureContent): void {
    this.drawLOuter(u, rebars, fig);
    this.drawCOuter(u, rebars, fig);
    this.drawMain(u, rebars, fig);
  }
  protected drawLOuter(u: UShellStruct, rebars: UShellRebar, fig: FigureContent): void {
    const bar = rebars.shell.lOuter;
    const as = rebars.info.as;
    const ys = bar.pos(u)
      .removeStart()
      .points.map((p) => p.y);
    const start = -u.len / 2 + as;
    const end = u.len / 2 - as;

    const x = (-0.8 * u.len) / 2;

    fig.push(
      fig
        .planeRebar()
        .spec(bar.spec, 0, bar.space)
        .rebar(...ys.map((y) => new Line(vec(start, y), vec(end, y))))
        .leaderNote(
          vec(x, u.shell.hd + 2 * fig.textHeight),
          vec(0, 1),
          vec(-1, 0)
        )
        .generate()
    );
  }
  protected drawCOuter(u: UShellStruct, rebars: UShellRebar, fig: FigureContent): void {
    const bar = rebars.shell.cOuter;
    const as = rebars.info.as;
    const paths = bar.pos(u);
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
        .spec(bar.spec, pts.length)
        .leaderNote(vec(-u.len / 2 - 2 * fig.textHeight, y), vec(1, 0))
        .generate()
    );
  }
  protected drawMain(u: UShellStruct, rebars: UShellRebar, fig: FigureContent): void {
    const bar = rebars.shell.main;
    const as = rebars.info.as;
    const y = -u.shell.r - u.shell.t - u.shell.hb + as;
    fig.push(
      fig
        .planeRebar()
        .rebar(new Line(vec(-u.len / 2 + as, y), vec(u.len / 2 - as, y)))
        .spec(bar.spec)
        .leaderNote(
          vec(-u.len / 4, y - 4 * fig.textHeight),
          vec(0, 1),
          vec(1, 0)
        )
        .generate()
    );
  }
}
