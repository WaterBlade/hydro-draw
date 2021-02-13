import { Line, RebarFormPreset, vec } from "@/draw";
import { SpaceRebar } from "@/struct/utils";
import { UShellStruct } from "../../UShellStruct";
import { UShellRebarInfo } from "../Info";

export class TransDirect extends SpaceRebar<UShellRebarInfo> {
  build(u: UShellStruct, name: string): void {
    if (u.oBeam.w > 0) {
      this.spec = this.genSpec();
      const as = this.info.as;
      const lines = this.shape(u);
      const count =
        (2 + (u.cantLeft > 0 ? 1 : 0) + (u.cantRight > 0 ? 1 : 0)) *
        lines.length *
        2;
      const factor = Math.sqrt(u.lenTrans ** 2 + u.oBeam.w ** 2) / u.oBeam.w;
      this.spec
        .setCount(count)
        .setForm(
          RebarFormPreset.Line(
            this.diameter,
            factor * (u.shell.t + u.oBeam.w - 2 * as)
          )
        )
        .setId(this.container.id)
        .setName(name);

      this.container.record(this.spec);
    }
  }
  shape(u: UShellStruct): Line[] {
    const as = this.info.as;
    const x = -u.shell.r - u.shell.t - u.oBeam.w + as;
    const top = u.shell.hd - u.oBeam.hd - u.oBeam.hs - as;
    const bottom = 0;
    const w = u.shell.t + u.oBeam.w - 2 * as;
    const pts = new Line(vec(x, top), vec(x, bottom)).divide(this.space).points;
    return pts.map((p) => new Line(p, vec(x + w, p.y)));
  }
}
