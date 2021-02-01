import { Line, Side, vec } from "@/draw";
import { UShellFigureContext } from "../../UShell";

export class RebarShell extends UShellFigureContext {
  build(): void {
    this.drawCInner();
    this.drawCInnerSub();
    this.drawCOuter();
    this.drawLInner();
    this.drawMain();
  }
  protected drawCInner(): void {
    const bar = this.rebars.shell.cInner;
    const fig = this.figures.lInner;
    const paths = this.pos.shell.cInner();
    fig.push(
      fig
        .linePointRebar()
        .line(paths[0])
        .offset(2 * fig.textHeight)
        .spec(bar, paths[0].points.length, bar.denseSpace)
        .onlineNote()
        .generate(),
      fig
        .linePointRebar()
        .line(paths[1])
        .offset(2 * fig.textHeight)
        .spec(bar, paths[1].points.length, bar.space)
        .onlineNote()
        .generate(),
      fig
        .linePointRebar()
        .line(paths[2])
        .offset(2 * fig.textHeight)
        .spec(bar, paths[2].points.length, bar.denseSpace)
        .onlineNote()
        .generate()
    );
  }
  protected drawCInnerSub(): void {
    const u = this.struct;
    const bar = this.rebars.shell.cInnerSub;
    const fig = this.figures.lInner;
    const as = this.rebars.as;
    const r = fig.drawRadius;
    const count = this.rebars.end.cOuter.singleCount;
    const y = -u.shell.r - u.waterStop.h - as;
    const x0 = -u.len / 2 + as + r;
    if (u.cantLeft > 0) {
      fig.push(
        fig
          .sparsePointRebar(30)
          .points(vec(x0, y))
          .spec(bar)
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
          .spec(bar, count)
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
          .spec(bar)
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
          .spec(bar, count)
          .onlineNote()
          .generate()
      );
    }
  }
  protected drawCOuter(): void {
    const u = this.struct;
    const bar = this.rebars.shell.cOuter;
    const fig = this.figures.lInner;
    const paths = this.pos.shell.cOuter();
    let i = 0;
    const y = -u.shell.r - u.shell.tb - 1.5 * fig.h;
    if (u.cantLeft > 0) {
      const path = paths[i++];
      fig.push(
        fig
          .sparsePointRebar()
          .points(...path.points)
          .spec(bar, path.points.length, bar.denseSpace)
          .parallelLeader(vec(-u.len / 2 - fig.h, y), vec(1, 0))
          .generate()
      );
    }
    fig.push(
      fig
        .linePointRebar()
        .line(paths[i])
        .offset(2 * fig.textHeight, Side.Right)
        .spec(bar, paths[i++].points.length, bar.denseSpace)
        .onlineNote()
        .generate(),
      fig
        .linePointRebar()
        .line(paths[i])
        .offset(2 * fig.textHeight, Side.Right)
        .spec(bar, paths[i++].points.length, bar.denseSpace)
        .onlineNote()
        .generate(),
      fig
        .linePointRebar()
        .line(paths[i])
        .offset(2 * fig.textHeight, Side.Right)
        .spec(bar, paths[i++].points.length, bar.denseSpace)
        .onlineNote()
        .generate()
    );
    if (u.cantRight > 0) {
      const path = paths[i++];
      fig.push(
        fig
          .sparsePointRebar()
          .points(...path.points)
          .spec(bar, path.points.length, bar.denseSpace)
          .parallelLeader(vec(u.len / 2 + fig.h, y), vec(1, 0))
          .generate()
      );
    }
  }
  protected drawLInner(): void {
    const u = this.struct;
    const bar = this.rebars.shell.lInner;
    const fig = this.figures.lInner;
    const as = this.rebars.as;
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
        .spec(bar)
        .leaderNote(
          vec(
            -u.len / 2 + u.cantLeft + this.rebars.denseL + 75,
            y + 4 * fig.textHeight
          ),
          vec(0, -1),
          vec(1, 0)
        )
        .generate()
    );
  }
  protected drawMain(): void {
    const u = this.struct;
    const bar = this.rebars.shell.main;
    const as = this.rebars.as;
    const fig = this.figures.lInner;
    const y = -u.shell.r - u.shell.t - u.shell.hb + as + fig.drawRadius;
    fig.push(
      fig
        .planeRebar()
        .rebar(new Line(vec(-u.len / 2 + as, y), vec(u.len / 2 - as, y)))
        .spec(bar)
        .leaderNote(
          vec(
            u.len / 2 - u.cantRight - this.rebars.denseL - 75,
            y - 4 * fig.textHeight
          ),
          vec(0, 1),
          vec(-1, 0)
        )
        .generate()
    );
  }
}
