import { divideBySpace, RebarFormPreset, RebarSpec } from "@/draw";
import { SpaceRebar } from "@/struct/utils";
import { PierSolidStruct } from "../PierSolidStruct";

export class WMain extends SpaceRebar{
  spec = new RebarSpec();
  build(t: PierSolidStruct): void{
    this.spec = this.genSpec();
    this.spec
      .setId(this.container.id)
      .setForm(RebarFormPreset.LShape(this.diameter, 500, t.h.val+t.topBeam.h.val + t.found.h.val - 2*this.info.as))
      .setCount(this.pos(t).length*2)
    this.container.record(this.spec);
  }
  pos(t: PierSolidStruct): number[]{
    return divideBySpace(-t.w.val/2+t.fr.val, t.w.val/2-t.fr.val, this.space);
  }
}