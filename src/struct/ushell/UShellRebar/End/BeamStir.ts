import { Arc, Line, RebarFormPreset, RebarSpec, vec } from "@/draw";
import { SpaceRebar } from "@/struct/utils";
import { UShellStruct } from "../../UShellStruct";
import { UShellRebarInfo } from "../Info";

export class EndBeamStir extends SpaceRebar<UShellRebarInfo> {
  spec = new RebarSpec();
  specCant = new RebarSpec();
  build(u: UShellStruct, name: string): void {
    if (u.cantCount < 2) {
      this.spec = this.genSpec();
      const as = this.info.as;
      const lens = this.shape(u).map((l) => l.calcLength());
      this.spec
        .setForm(
          RebarFormPreset.RectStir(this.diameter, u.endSect.b - 2 * as, lens)
        )
        .setCount((2 - u.cantCount) * lens.length)
        .setId(this.container.id)
        .setName(name);
      this.container.record(this.spec);
    }
    if (u.cantCount > 0) {
      this.specCant = this.genSpec();
      const as = this.info.as;
      const lens = this.shapeCant(u).map((l) => l.calcLength());
      this.specCant
        .setForm(
          RebarFormPreset.RectStir(this.diameter, u.endSect.b - 2 * as, lens)
        )
        .setCount(u.cantCount * lens.length)
        .setId(this.container.id)
        .setName(name);
      this.container.record(this.specCant);
    }
  }
  shape(u: UShellStruct): Line[] {
    return this.genBStirAndCant(u, u.waterStop.h);
  }
  shapeCant(u: UShellStruct): Line[] {
    return this.genBStirAndCant(u, 0);
  }
  protected genBStirAndCant(u: UShellStruct, gap: number): Line[] {
    const as = this.info.as;
    const l = Math.min(
      u.shell.r,
      u.shell.r + u.shell.t + u.oBeam.w - u.endSect.w
    );
    const y = u.shell.hd - u.endHeight + u.support.h + as;
    const pts = new Line(vec(-l, y), vec(l, y)).divide(this.space).points;
    const topEdge = new Arc(vec(0, 0), u.shell.r + gap + as, 180, 0);
    return pts.map((p) => new Line(p, topEdge.rayIntersect(p, vec(0, 1))[0]));
  }
}
