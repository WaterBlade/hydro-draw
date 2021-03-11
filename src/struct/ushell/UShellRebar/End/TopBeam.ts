import {
  Polyline,
  RebarForm,
  RebarPathForm,
  Side,
  toDegree,
  vec,
} from "@/draw";
import { UShellUnitRebar } from "../UShellRebar";

export class EndTopBeam extends UShellUnitRebar {
  isExist(): boolean {
    return this.struct.iBeam.w > 0 && this.struct.cantCount < 2;
  }
  get gap(): number {
    return this.struct.waterStop.h;
  }
  shape(): Polyline {
    const u = this.struct;
    const as = this.rebars.as;
    const d = vec(-u.iBeam.w, -u.iBeam.hs).unit().mul(150);
    const path = new Polyline(
      -u.shell.r - u.shell.t - u.oBeam.w + as,
      u.shell.hd + this.gap
    )
      .lineBy(u.oBeam.w + u.shell.t + u.iBeam.w - as, 0)
      .lineTo(-u.shell.r + u.iBeam.w, u.shell.hd - u.iBeam.hd)
      .lineBy(-u.iBeam.w, -u.iBeam.hs)
      .lineBy(0, -1)
      .offset(as + this.gap, Side.Right)
      .removeEnd();
    path.resetEnd(path.end.add(d));
    return path;
  }
  get count(): number {
    return (2 - this.struct.cantCount) * this.rebars.end.cOuter.singleCount;
  }
  get form(): RebarForm {
    const u = this.struct;
    const segs = this.shape().segments;
    const angle = 90 + toDegree(Math.asin(u.iBeam.hs / u.iBeam.w));
    let i = 0;
    return new RebarPathForm(this.diameter)
      .lineBy(0, 1.6)
      .dimLength(40 * this.diameter)
      .lineBy(2.5, 0)
      .dimLength(segs[i++].calcLength())
      .lineBy(0, -1.2)
      .dimLength(segs[i++].calcLength())
      .lineBy(-1.2, -0.8)
      .dimLength(segs[i++].calcLength())
      .dimAngle(angle);
  }
}

export class EndTopBeamCant extends EndTopBeam {
  isExist(): boolean {
    return this.struct.iBeam.w > 0 && this.struct.cantCount > 0;
  }
  get gap(): number {
    return 0;
  }
  get count(): number {
    return this.struct.cantCount * this.rebars.end.cOuter.singleCount;
  }
}
