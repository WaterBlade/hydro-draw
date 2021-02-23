import { Polyline, RebarFormPreset, RebarSpec, Side } from "@/draw";
import { SpaceRebar } from "@/struct/utils";
import { UShellStruct } from "../../UShellStruct";
import { UShellRebarInfo } from "../Info";

export class ShellLInner extends SpaceRebar<UShellRebarInfo> {
  spec = new RebarSpec();
  build(u: UShellStruct, name: string): void {
    this.spec = this.genSpec();
    const as = this.info.as;
    const path = this.pos(u, as + this.diameter/2);
    this.spec
      .setCount(path.points.length)
      .setForm(
        RebarFormPreset.Line(this.diameter, u.len - 2 * as - 2 * u.waterStop.w)
      )
      .setId(this.container.id)
      .setName(name);
    this.container.record(this.spec);
  }

  pos(u: UShellStruct, dist: number): Polyline {
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
    return path.offset(dist, Side.Right).removeStart().removeEnd().divide(this.space);
  }
}
