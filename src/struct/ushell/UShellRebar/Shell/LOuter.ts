import { Polyline, RebarForm, RebarFormPreset } from "@/draw";
import { UShellSpaceRebar } from "../UShellRebar";

export class ShellLOuter extends UShellSpaceRebar {
  get count(): number {
    return this.pos().points.length;
  }
  get form(): RebarForm {
    const u = this.struct;
    const as = this.rebars.as;
    return RebarFormPreset.Line(this.diameter, u.len - 2 * as);
  }
  pos(r = 0): Polyline {
    const u = this.struct;
    const dist = this.rebars.as + r;
    const path = new Polyline(-u.shell.r + u.iBeam.w, u.shell.hd - 1)
      .lineBy(0, 1)
      .lineBy(-u.beamWidth, 0);
    if (u.oBeam.w > 0) {
      path
        .lineBy(0, -u.oBeam.hd)
        .lineBy(u.oBeam.w, -u.oBeam.hs)
        .lineBy(0, -u.shell.hd + u.oBeam.hd + u.oBeam.hs);
    } else {
      path.lineBy(0, -u.shell.hd);
    }
    const leftPt = u.transPt[0];
    const angle = u.transAngle;
    return path
      .arcTo(leftPt.x, leftPt.y, angle)
      .lineTo(-u.shell.wb / 2, u.bottom)
      .lineTo(1, 0)
      .offset(dist)
      .removeStart()
      .removeEnd()
      .divide(this.space)
      .removeBothPt();
  }
}
