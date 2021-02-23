import { divideBySpace, RebarFormPreset, RebarSpec } from "@/draw";
import { SpaceRebar } from "@/struct/utils";
import { PlatformStruct } from "../PlatformStruct";

export class PlatformWMain extends SpaceRebar{
  spec = new RebarSpec();
  build(t: PlatformStruct): void{
    const as = this.info.as;
    this.spec = this.genSpec();
    this.spec
      .setId(this.container.id)
      .setForm(RebarFormPreset.Line(this.diameter, t.w - 2*as))
      .setCount(this.pos(t).length * this.layerCount);
    this.container.record(this.spec);
  }
  pos(t: PlatformStruct): number[]{
    const as = this.info.as;
    return divideBySpace(-t.l/2+as, t.l/2-as, this.space);
  }
}