import { RebarFormPreset } from "@/draw";
import { UShellContext } from "../UShell";

export class RebarTrans extends UShellContext {
  protected name = "渐变段";
  build(): void {
    this.arc();
    this.direct();
  }
  protected arc(): void {
    const u = this.struct;
    if (u.oBeam.w > 0) {
      const bar = this.rebars.trans.arc;
      const lines = this.shape.trans.arc();
      const count =
        (2 + (u.cantLeft > 0 ? 1 : 0) + (u.cantRight > 0 ? 1 : 0)) *
        lines.length;
      const factor = Math.sqrt(u.lenTrans ** 2 + u.oBeam.w ** 2) / u.oBeam.w;
      bar
        .setCount(count)
        .setForm(
          RebarFormPreset.Line(
            bar.diameter,
            lines.map((l) => factor * l.calcLength())
          )
        )
        .setId(this.rebars.id.gen())
        .setName(this.name);

      this.rebars.record(bar);
    }
  }
  protected direct(): void {
    const u = this.struct;
    const as = this.rebars.as;
    if (u.oBeam.w > 0) {
      const bar = this.rebars.trans.direct;
      const lines = this.shape.trans.direct();
      const count =
        (2 + (u.cantLeft > 0 ? 1 : 0) + (u.cantRight > 0 ? 1 : 0)) *
        lines.length *
        2;
      const factor = Math.sqrt(u.lenTrans ** 2 + u.oBeam.w ** 2) / u.oBeam.w;
      bar
        .setCount(count)
        .setForm(
          RebarFormPreset.Line(
            bar.diameter,
            factor * (u.shell.t + u.oBeam.w - 2 * as)
          )
        )
        .setId(this.rebars.id.gen())
        .setName(this.name);

      this.rebars.record(bar);
    }
  }
}
