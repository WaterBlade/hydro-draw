import { RebarFormPreset, RebarSpec } from "@/draw";
import { CountRebar } from "@/struct/utils";
import { UShellStruct } from "../../UShellStruct";
import { UShellRebarInfo } from "../Info";

export class ShellMain extends CountRebar<UShellRebarInfo> {
  spec = new RebarSpec();
  build(u: UShellStruct, name: string): void {
    this.spec = this.genSpec();
    const as = this.info.as;
    this.spec
      .setForm(RebarFormPreset.Line(this.diameter, u.len - 2 * as))
      .setCount(this.singleCount * this.layerCount)
      .setId(this.container.id)
      .setName(name);
    this.container.record(this.spec);
  }
}
