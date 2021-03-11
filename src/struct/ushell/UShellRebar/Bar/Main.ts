import { RebarForm, RebarFormPreset } from "@/draw";
import { UShellUnitRebar } from "../UShellRebar";

export class BarMain extends UShellUnitRebar {
  get count(): number {
    return this.struct.genBarCenters().length * 4;
  }
  get form(): RebarForm {
    const u = this.struct;
    const as = this.rebars.as;
    return RebarFormPreset.Line(
      this.diameter,
      2 * u.shell.r + 2 * u.shell.t + 2 * u.oBeam.w - 2 * as
    );
  }
}
