import { vec } from "@/draw";
import { Figure } from "@/struct/utils";
import { UShellFigureContext } from "../../UShell";

export class RebarTrans extends UShellFigureContext {
  build(fig: Figure, isCant = false): void {
    this.drawArc(fig, isCant);
  }
  protected drawArc(fig: Figure, isCant = false): void {
    const u = this.struct;
    const bar = this.rebars.trans.arc;
    const y0 = u.shell.hd + u.shell.r - u.endHeight + u.support.h;
    const p = this.shape.trans.arcEnd();
    const rebar = fig.planeRebar().rebar(p);
    if (isCant) {
      const left = p.mirrorByVAxis();
      left.move(vec(u.endSect.b, 0));
      rebar.rebar(left);
    }
    fig.push(
      rebar
        .spec(bar)
        .leaderNote(
          vec(u.endSect.b + u.lenTrans, (-u.shell.t - u.shell.hb + y0) / 2),
          vec(1, 0)
        )
        .generate()
    );
  }
}
