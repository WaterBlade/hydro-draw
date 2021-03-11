import { Polyline, RebarForm, RebarFormPreset, Side } from "@/draw";
import { UShellSpaceRebar } from "../UShellRebar";

export class ShellLInner extends UShellSpaceRebar {
  get count(): number {
    return this.pos().points.length;
  }
  get form(): RebarForm {
    const u = this.struct;
    const as = this.rebars.as;
    return RebarFormPreset.Line(
      this.diameter,
      u.len - 2 * as - 2 * u.waterStop.w
    );
  }
  pos(r = 0): Polyline {
    const u = this.struct;
    const dist = this.rebars.as + r;
    const path = new Polyline(-u.shell.r - u.shell.t, u.shell.hd).lineBy(
      u.shell.t + u.iBeam.w,
      0
    );
    if (u.iBeam.w !== 0) {
      path
        .lineBy(0, -u.iBeam.hd)
        .lineBy(-u.iBeam.w, -u.iBeam.hs)
        .lineBy(0, -u.shell.hd + u.iBeam.hd + u.iBeam.hs);
    } else {
      path.lineBy(0, -u.shell.hd);
    }
    path.arcBy(2 * u.shell.r, 0, 180);
    if (u.iBeam.w !== 0) {
      path
        .lineBy(0, u.shell.hd - u.iBeam.hd - u.iBeam.hs)
        .lineBy(-u.iBeam.w, u.iBeam.hs)
        .lineBy(0, u.iBeam.hd);
    } else {
      path.lineBy(0, u.shell.hd);
    }
    path.lineBy(u.iBeam.w + u.shell.t, 0);
    return path
      .offset(dist, Side.Right)
      .removeStart()
      .removeEnd()
      .divide(this.space);
  }
}
