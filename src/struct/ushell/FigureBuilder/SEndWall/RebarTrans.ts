import { Polyline, vec } from "@/draw";
import { Figure } from "@/struct/utils";
import { UShellFigureContext } from "../../UShell";

export class RebarTrans extends UShellFigureContext {
  build(fig: Figure, isCant = false): void {
    this.drawDirect(fig, isCant);
  }
  protected drawDirect(fig: Figure, isCant = false): void {
    const u = this.struct;
    const as = this.rebars.as;
    const bar = this.rebars.trans.direct;
    const path = new Polyline(u.endSect.b - 1, -u.shell.t - u.oBeam.w)
      .lineBy(1, 0)
      .lineBy(
        u.lenTrans + u.shell.t * (u.lenTrans / u.oBeam.w),
        u.oBeam.w + u.shell.t
      )
      .lineBy(-1, 0)
      .offset(as)
      .removeStart()
      .removeEnd();

    const rebar = fig.planeRebar().rebar(path);
    if (isCant) {
      const left = path.mirrorByVAxis();
      left.move(vec(u.endSect.b, 0));
      rebar.rebar(left);
    }

    fig.push(
      rebar
        .spec(bar, 0, bar.space)
        .leaderNote(
          vec(u.endSect.b + u.lenTrans, -u.shell.t - u.oBeam.w / 2),
          vec(1, 0)
        )
        .generate()
    );
  }
}
