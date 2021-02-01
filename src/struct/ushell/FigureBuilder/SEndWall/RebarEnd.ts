import { Line, Polyline, vec } from "@/draw";
import { Figure } from "@/struct/utils";
import { UShellFigureContext } from "../../UShell";

export class ReBarEnd extends UShellFigureContext {
  build(fig: Figure, isCant = false): void {
    this.drawCOuter(fig);
    this.drawWStir(fig, isCant);
  }

  protected drawCOuter(fig: Figure): void {
    const u = this.struct;
    const bar = this.rebars.end.cOuter;
    const as = this.rebars.as;
    const r = fig.drawRadius;
    const y = -u.shell.t - u.oBeam.w + as + r;
    fig.push(
      fig
        .sparsePointRebar()
        .points(
          ...new Line(
            vec(as + r, y),
            vec(u.endSect.b - as - r, y)
          ).divideByCount(bar.singleCount - 1).points
        )
        .spec(bar, bar.singleCount)
        .parallelLeader(
          vec(-2 * fig.textHeight, y - 2 * fig.textHeight - u.support.h),
          vec(-1, 0)
        )
        .generate()
    );
  }
  protected drawWStir(fig: Figure, isCant: boolean): void {
    const u = this.struct;
    const bar = isCant ? this.rebars.end.wStirCant : this.rebars.end.wStir;
    const gap = isCant ? 0 : u.waterStop.h;
    const as = this.rebars.as;
    const w0 = u.endSect.b - 2 * as;
    const h0 = u.oBeam.w + u.shell.t - gap - 2 * as;
    let pos;
    if (isCant) {
      pos = vec(-u.lenTrans, -u.shell.t - u.oBeam.w + as + fig.h);
    } else {
      const y = -gap - as - h0 / 2;
      pos = vec(-2 * fig.h, y);
    }
    fig.push(
      fig
        .planeRebar()
        .rebar(
          new Polyline(as, -gap - as)
            .lineBy(w0, 0)
            .lineBy(0, -h0)
            .lineBy(-w0, 0)
            .lineBy(0, h0)
        )
        .spec(bar, 0, bar.space)
        .leaderNote(pos, vec(1, 0))
        .generate()
    );
  }
}
