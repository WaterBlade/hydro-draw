import { RebarFormPreset, RebarSpec } from "@/draw";
import { UnitRebar } from "@/struct/utils";
import { UShellStruct } from "../../UShellStruct";
import { UShellRebarInfo } from "../Info";

export class BarMain extends UnitRebar<UShellRebarInfo> {
  spec = new RebarSpec();
  build(u: UShellStruct, name: string): void {
    this.spec = this.genSpec();
    const as = this.info.asBar;
    const pts = u.genBarCenters();
    this.spec
      .setCount(pts.length * 4)
      .setId(this.container.id)
      .setName(name)
      .setForm(
        RebarFormPreset.Line(
          this.diameter,
          2 * u.shell.r + 2 * u.shell.t + 2 * u.oBeam.w - 2 * as
        )
      );
    this.container.record(this.spec);
  }
}
