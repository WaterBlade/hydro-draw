import { Polyline, RebarForm, RebarPathForm, Side, toDegree } from "@/draw";
import { UShellCountRebar } from "../UShellRebar";

export class EndCOuter extends UShellCountRebar {
  shape(): Polyline {
    const u = this.struct;
    const dist = this.rebars.as;
    const path = new Polyline(
      -u.shell.r - u.shell.t - u.oBeam.w + 1,
      u.shell.hd
    )
      .lineBy(-1, 0)
      .lineBy(0, -u.endSect.hd)
      .lineBy(u.endSect.w, -u.endSect.hs)
      .lineBy(u.support.w > 0 ? u.support.w : 500, 0)
      .lineBy(500, 500)
      .offset(dist)
      .removeStart();
    return path;
  }
  get form(): RebarForm {
    const u = this.struct;
    const lens = this.shape().segments.map((s) => s.calcLength());
    const angle = 180 - toDegree(Math.atan(u.endSect.w / u.endSect.hs));
    let i = 0;
    return new RebarPathForm(this.diameter)
      .lineBy(0, -1.5)
      .dimLength(lens[i++], Side.Right)
      .lineBy(0.75, -1.5)
      .dimLength(lens[i++], Side.Right)
      .dimAngle(angle)
      .lineBy(1, 0)
      .dimLength(lens[i++])
      .lineBy(0.5, 0.5)
      .dimLength(500, Side.Right);
  }
  get count(): number {
    return this.singleCount * 4;
  }
}
