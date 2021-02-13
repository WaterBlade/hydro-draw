import { vec } from "@/draw";
import { FigureContent } from "@/struct/utils";
import { UShellRebar } from "../../UShellRebar";
import { UShellStruct } from "../../UShellStruct";

export class RebarTrans {
  build(
    u: UShellStruct,
    rebars: UShellRebar,
    fig: FigureContent,
    isCant = false
  ): void {
    this.drawArc(u, rebars, fig, isCant);
  }
  protected drawArc(
    u: UShellStruct,
    rebars: UShellRebar,
    fig: FigureContent,
    isCant = false
  ): void {
    const bar = rebars.trans.arc;
    const y0 = u.shell.hd + u.shell.r - u.endHeight + u.support.h;
    const p = bar.shapeEnd(u);
    const rebar = fig.planeRebar().rebar(p);
    if (isCant) {
      const left = p.mirrorByVAxis();
      left.move(vec(u.endSect.b, 0));
      rebar.rebar(left);
    }
    fig.push(
      rebar
        .spec(bar.spec)
        .leaderNote(
          vec(u.endSect.b + u.lenTrans, (-u.shell.t - u.shell.hb + y0) / 2),
          vec(1, 0)
        )
        .generate()
    );
  }
}
