import { vec } from "@/draw";
import { UShellFigureContext } from "../../UShell";

export class RebarTrans extends UShellFigureContext {
  build(): void {
    this.drawArc();
  }
  protected drawArc(): void {
    const u = this.struct;
    const fig = this.figures.lInner;
    const bar = this.rebars.trans.arc;
    const left = this.shape.trans.arcEnd();
    const right = left.mirrorByVAxis();
    left.move(vec(-u.len / 2 + u.cantLeft, -u.shell.r));
    right.move(vec(u.len / 2 - u.cantRight, -u.shell.r));
    const leftRebar = fig
      .planeRebar()
      .spec(bar, 0, bar.space)
      .rebar(left)
      .leaderNote(
        vec(
          -u.len / 2 + u.cantLeft + u.endSect.b + u.lenTrans,
          -u.shell.r - u.shell.t - u.shell.hb - u.oBeam.w - 2 * fig.h
        ),
        vec(-1, 1),
        vec(1, 0)
      )
      .generate();
    const rightRebar = fig
      .planeRebar()
      .spec(bar, 0, bar.space)
      .rebar(right)
      .leaderNote(
        vec(
          u.len / 2 - u.cantRight - u.endSect.b - u.lenTrans,
          -u.shell.r - u.shell.t - u.shell.hb - u.oBeam.w - 2 * fig.h
        ),
        vec(1, 1),
        vec(-1, 0)
      )
      .generate();
    fig.push(leftRebar, rightRebar);
    if (u.cantLeft > 0) {
      fig.push(
        leftRebar.mirrorByVAxis(-u.len / 2 + u.cantLeft + u.endSect.b / 2)
      );
    }
    if (u.cantRight > 0) {
      fig.push(
        rightRebar.mirrorByVAxis(u.len / 2 - u.cantRight - u.endSect.b / 2)
      );
    }
  }
}
