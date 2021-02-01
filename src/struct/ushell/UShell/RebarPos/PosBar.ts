import { divideBySpace } from "@/draw";
import { UShellRebar } from "../UShellRebar";
import { UShellStruct } from "../UShellStruct";

export class PosBar {
  constructor(protected struct: UShellStruct, protected rebars: UShellRebar) {}
  stir(): number[] {
    const u = this.struct;
    const bar = this.rebars.bar.stir;
    const x0 = -u.shell.r + u.iBeam.w;
    const x1 = -x0;
    return divideBySpace(x0, x1, bar.space).slice(1, -1);
  }
}
