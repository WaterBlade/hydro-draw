import { Polyline, vec } from "@/draw";
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
    this.drawDirect(u, rebars, fig, isCant);
  }
  protected drawDirect(
    u: UShellStruct,
    rebars: UShellRebar,
    fig: FigureContent,
    isCant = false
  ): void {
    const as = rebars.info.as;
    const bar = rebars.trans.direct;
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
        .spec(bar.spec, 0, bar.space)
        .leaderNote(
          vec(u.endSect.b + u.lenTrans, -u.shell.t - u.oBeam.w / 2),
          vec(1, 0)
        )
        .generate()
    );
  }
}
