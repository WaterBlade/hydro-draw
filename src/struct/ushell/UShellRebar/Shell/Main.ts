import { RebarForm, RebarFormPreset } from "@/draw";
import { UShellCountRebar } from "../UShellRebar";

export class ShellMain extends UShellCountRebar {
  get count(): number {
    return this.singleCount;
  }
  get form(): RebarForm {
    return RebarFormPreset.Line(
      this.diameter,
      this.struct.len - 2 * this.rebars.as
    );
  }
}
