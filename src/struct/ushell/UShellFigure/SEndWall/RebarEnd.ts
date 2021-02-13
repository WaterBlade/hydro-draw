import { Line, Polyline, vec } from "@/draw";
import { FigureContent } from "@/struct/utils";
import { UShellRebar } from "../../UShellRebar";
import { UShellStruct } from "../../UShellStruct";

export class ReBarEnd {
  build(
    u: UShellStruct,
    rebars: UShellRebar,
    fig: FigureContent,
    isCant = false
  ): void {
    this.drawCOuter(u, rebars, fig);
    this.drawWStir(u, rebars, fig, isCant);
  }

  protected drawCOuter(
    u: UShellStruct,
    rebars: UShellRebar,
    fig: FigureContent
  ): void {
    const bar = rebars.end.cOuter;
    const as = rebars.info.as;
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
        .spec(bar.spec, bar.singleCount)
        .parallelLeader(
          vec(-2 * fig.textHeight, y - 2 * fig.textHeight - u.support.h),
          vec(-1, 0)
        )
        .generate()
    );
  }
  protected drawWStir(
    u: UShellStruct,
    rebars: UShellRebar,
    fig: FigureContent,
    isCant: boolean
  ): void {
    const bar = rebars.end.wStir;
    const spec = isCant ? bar.specCant : bar.spec;
    const gap = isCant ? 0 : u.waterStop.h;
    const as = rebars.info.as;
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
        .spec(spec, 0, bar.space)
        .leaderNote(pos, vec(1, 0))
        .generate()
    );
  }
}
