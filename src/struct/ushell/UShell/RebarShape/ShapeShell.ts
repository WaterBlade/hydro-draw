import { Polyline } from "@/draw";
import { UShellRebar } from "../UShellRebar";
import { UShellStruct } from "../UShellStruct";

export class ShapeShell {
  constructor(protected struct: UShellStruct, protected rebars: UShellRebar) {}
  cInner(): Polyline {
    const u = this.struct;
    const path = new Polyline(-u.shell.r - 1, u.shell.hd)
      .lineBy(1, 0)
      .lineBy(0, -u.shell.hd)
      .arcBy(2 * u.shell.r, 0, 180)
      .lineBy(0, u.shell.hd)
      .lineBy(1, 0);
    return path;
  }
  cOuter(): Polyline {
    const u = this.struct;
    const angle = u.transAngle;
    const [left, right] = u.transPt;
    const path = new Polyline(-u.shell.r - u.shell.t + 1, u.shell.hd)
      .lineBy(-1, 0)
      .lineBy(0, -u.shell.hd)
      .arcTo(left.x, left.y, angle)
      .lineTo(-u.shell.wb / 2, u.bottom)
      .lineBy(u.shell.wb, 0)
      .lineTo(right.x, right.y)
      .arcTo(u.shell.r + u.shell.t, 0, angle)
      .lineBy(0, u.shell.hd)
      .lineBy(-1, 0);
    return path;
  }
  topBeam(): Polyline {
    const path = new Polyline();
    const u = this.struct;
    const as = this.rebars.as;
    const bar = this.rebars.shell.topBeam;
    if (u.oBeam.w > 0) {
      path
        .moveTo(
          -u.shell.r,
          u.shell.hd -
            u.oBeam.hd -
            u.oBeam.hs -
            u.shell.t * (u.oBeam.hs / u.oBeam.w) +
            1
        )
        .lineBy(0, -1)
        .lineTo(-u.shell.r - u.shell.t - u.oBeam.w, u.shell.hd - u.oBeam.hd)
        .lineBy(0, u.oBeam.hd);
    } else {
      path
        .moveTo(-u.shell.r - u.shell.t, u.shell.hd - 40 * bar.diameter - as)
        .lineTo(-u.shell.r - u.shell.t, u.shell.hd);
    }
    path.lineBy(u.beamWidth, 0);
    if (u.iBeam.w > 0) {
      path
        .lineBy(0, -u.iBeam.hd)
        .lineTo(
          -u.shell.r - u.shell.t,
          u.shell.hd -
            u.iBeam.hd -
            u.iBeam.hs -
            u.shell.t * (u.iBeam.hs / u.iBeam.w)
        )
        .lineBy(0, 1);
    } else {
      path.lineBy(0, -40 * bar.diameter - as);
    }

    return path;
  }
}
