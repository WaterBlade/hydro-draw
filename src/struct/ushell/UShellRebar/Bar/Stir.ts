import { divideBySpace, RebarForm, RebarFormPreset } from "@/draw";
import { UShellSpaceRebar } from "../UShellRebar";

export class BarStir extends UShellSpaceRebar {
  pos(): number[] {
    const u = this.struct;
    const x0 = -u.shell.r + u.iBeam.w;
    const x1 = -x0;
    return divideBySpace(x0, x1, this.space).slice(1, -1);
  }
  get count(): number {
    return this.pos().length * this.struct.genBarCenters().length;
  }
  get form(): RebarForm {
    const u = this.struct;
    const as = this.rebars.as;
    return RebarFormPreset.RectStir(
      this.diameter,
      u.bar.h - 2 * as,
      u.bar.w - 2 * as
    );
  }
}
