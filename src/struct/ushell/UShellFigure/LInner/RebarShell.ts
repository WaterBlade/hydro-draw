import { Line, Side, vec } from "@/draw";
import { FigureContent } from "@/struct/utils";
import { UShellRebar } from "../../UShellRebar";
import { UShellStruct } from "../../UShellStruct";

export class RebarShell{
  build(u: UShellStruct, rebars: UShellRebar, fig: FigureContent): void {
    this.drawCInner(u, rebars, fig);
    this.drawCInnerSub(u, rebars, fig);
    this.drawCOuter(u, rebars, fig);
    this.drawLInner(u, rebars, fig);
    this.drawMain(u, rebars, fig);
  }
  protected drawCInner(u: UShellStruct, rebars: UShellRebar, fig: FigureContent): void {
    const bar = rebars.shell.cInner;
    const paths = bar.pos(u);
    fig.push(
      fig
        .linePointRebar()
        .line(paths[0])
        .offset(2 * fig.textHeight)
        .spec(bar.spec, paths[0].points.length, bar.denseSpace)
        .onlineNote()
        .generate(),
      fig
        .linePointRebar()
        .line(paths[1])
        .offset(2 * fig.textHeight)
        .spec(bar.spec, paths[1].points.length, bar.space)
        .onlineNote()
        .generate(),
      fig
        .linePointRebar()
        .line(paths[2])
        .offset(2 * fig.textHeight)
        .spec(bar.spec, paths[2].points.length, bar.denseSpace)
        .onlineNote()
        .generate()
    );
  }
  protected drawCInnerSub(u: UShellStruct, rebars: UShellRebar, fig: FigureContent): void {
    const bar = rebars.shell.cInner;
    const as = rebars.info.as;
    const r = fig.drawRadius;
    const count = rebars.end.cOuter.singleCount;
    const y = -u.shell.r - u.waterStop.h - as;
    const x0 = -u.len / 2 + as + r;
    if (u.cantLeft > 0) {
      fig.push(
        fig
          .sparsePointRebar(30)
          .points(vec(x0, y))
          .spec(bar.specSub)
          .parallelLeader(vec(-u.len / 2 - fig.h, y + 2 * fig.h), vec(1, 0))
          .generate()
      );
    } else {
      fig.push(
        fig
          .linePointRebar()
          .line(
            new Line(
              vec(x0, y),
              vec(x0 + u.endSect.b - 2 * as - 2 * r, y)
            ).divideByCount(count - 1)
          )
          .offset(2 * fig.textHeight)
          .spec(bar.specSub, count)
          .onlineNote()
          .generate()
      );
    }
    const x1 = u.len / 2 - as - r;
    if (u.cantRight > 0) {
      fig.push(
        fig
          .sparsePointRebar(30)
          .points(vec(x1, y))
          .spec(bar.specSub)
          .parallelLeader(vec(u.len / 2 + fig.h, y + 2 * fig.h), vec(1, 0))
          .generate()
      );
    } else {
      fig.push(
        fig
          .linePointRebar()
          .line(
            new Line(
              vec(x1 - u.endSect.b + 2 * as + 2 * r, y),
              vec(x1, y)
            ).divideByCount(count - 1)
          )
          .offset(2 * fig.textHeight)
          .spec(bar.specSub, count)
          .onlineNote()
          .generate()
      );
    }
  }
  protected drawCOuter(u: UShellStruct, rebars: UShellRebar, fig: FigureContent): void {
    const bar = rebars.shell.cOuter;
    const paths = bar.pos(u);
    let i = 0;
    const y = -u.shell.r - u.shell.tb - 1.5 * fig.h;
    if (u.cantLeft > 0) {
      const path = paths[i++];
      fig.push(
        fig
          .sparsePointRebar()
          .points(...path.points)
          .spec(bar.spec, path.points.length, bar.denseSpace)
          .parallelLeader(vec(-u.len / 2 - fig.h, y), vec(1, 0))
          .generate()
      );
    }
    fig.push(
      fig
        .linePointRebar()
        .line(paths[i])
        .offset(2 * fig.textHeight, Side.Right)
        .spec(bar.spec, paths[i++].points.length, bar.denseSpace)
        .onlineNote()
        .generate(),
      fig
        .linePointRebar()
        .line(paths[i])
        .offset(2 * fig.textHeight, Side.Right)
        .spec(bar.spec, paths[i++].points.length, bar.denseSpace)
        .onlineNote()
        .generate(),
      fig
        .linePointRebar()
        .line(paths[i])
        .offset(2 * fig.textHeight, Side.Right)
        .spec(bar.spec, paths[i++].points.length, bar.denseSpace)
        .onlineNote()
        .generate()
    );
    if (u.cantRight > 0) {
      const path = paths[i++];
      fig.push(
        fig
          .sparsePointRebar()
          .points(...path.points)
          .spec(bar.spec, path.points.length, bar.denseSpace)
          .parallelLeader(vec(u.len / 2 + fig.h, y), vec(1, 0))
          .generate()
      );
    }
  }
  protected drawLInner(u: UShellStruct, rebars: UShellRebar, fig: FigureContent): void {
    const bar = rebars.shell.lInner;
    const as = rebars.info.as;
    const y = -u.shell.r - as - fig.drawRadius;
    fig.push(
      fig
        .planeRebar()
        .rebar(
          new Line(
            vec(-u.len / 2 + u.waterStop.w + as, y),
            vec(u.len / 2 - u.waterStop.w - as, y)
          )
        )
        .spec(bar.spec)
        .leaderNote(
          vec(
            -u.len / 2 + u.cantLeft + rebars.info.denseL + 75,
            y + 4 * fig.textHeight
          ),
          vec(0, -1),
          vec(1, 0)
        )
        .generate()
    );
  }
  protected drawMain(u: UShellStruct, rebars: UShellRebar, fig: FigureContent): void {
    const bar = rebars.shell.main;
    const as = rebars.info.as;
    const y = -u.shell.r - u.shell.t - u.shell.hb + as + fig.drawRadius;
    fig.push(
      fig
        .planeRebar()
        .rebar(new Line(vec(-u.len / 2 + as, y), vec(u.len / 2 - as, y)))
        .spec(bar.spec)
        .leaderNote(
          vec(
            u.len / 2 - u.cantRight - rebars.info.denseL - 75,
            y - 4 * fig.textHeight
          ),
          vec(0, 1),
          vec(-1, 0)
        )
        .generate()
    );
  }
}
