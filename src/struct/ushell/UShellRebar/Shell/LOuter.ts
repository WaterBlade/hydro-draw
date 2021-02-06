import { Polyline, RebarFormPreset } from "@/draw";
import { SpaceRebar } from "@/struct/utils";
import { UShellStruct } from "../../UShellStruct";
import { UShellRebarInfo } from "../Info";

export class ShellLOuter extends SpaceRebar<UShellRebarInfo>{
  build(u: UShellStruct, name: string): void{
    this.spec = this.genSpec();
    const as = this.info.as;
    const path = this.pos(u, as + this.diameter / 2)
    this.spec
      .setCount(2 * path.points.length)
      .setForm(RebarFormPreset.Line(this.diameter, u.len - 2 * as))
    .setId(this.container.id).setName(name);
    this.container.record(this.spec);
  }
  pos(u: UShellStruct, offsetDist?: number): Polyline {
    const as = this.info.as;
    const dist = offsetDist ? offsetDist : as;
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
