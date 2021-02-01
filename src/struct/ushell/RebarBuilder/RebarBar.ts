import { RebarFormPreset } from "@/draw";
import { UShellContext } from "../UShell";

export class RebarBar extends UShellContext {
  protected name = "拉杆";
  build(): void {
    this.main();
    this.stir();
  }
  protected main(): void {
    const u = this.struct;
    const bar = this.rebars.bar.main;
    const as = this.rebars.asBar;
    const pts = u.genBarCenters();
    bar
      .setCount(pts.length * 4)
      .setId(this.rebars.id.gen())
      .setName(this.name)
      .setForm(
        RebarFormPreset.Line(
          bar.diameter,
          2 * u.shell.r + 2 * u.shell.t + 2 * u.oBeam.w - 2 * as
        )
      );
    this.rebars.record(bar);
  }
  protected stir(): void {
    const u = this.struct;
    const bar = this.rebars.bar.stir;
    const as = this.rebars.asBar;
    const pts = u.genBarCenters();
    const xs = this.pos.bar.stir();
    bar
      .setId(this.rebars.id.gen())
      .setName(this.name)
      .setCount(pts.length * xs.length)
      .setForm(
        RebarFormPreset.RectStir(
          bar.diameter,
          u.bar.h - 2 * as,
          u.bar.w - 2 * as
        )
      );
    this.rebars.record(bar);
  }
}
