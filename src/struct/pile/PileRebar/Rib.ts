import { divideBySpace, RebarFormPreset } from "@/draw";
import { PileStruct } from "../PileStruct";
import { Rebar, SpaceRebar } from "../../utils";
import { PileRebarInfo } from "./Info";

export class Rib extends SpaceRebar<PileRebarInfo>{
  build(t: PileStruct, mainBar: Rebar): void{
    this.spec = this.genSpec();
    const as = this.info.as;
    const ys = this.pos(t);
    this.spec
      .setId(this.container.id)
      .setCount(ys.length * t.count)
      .setForm(
        RebarFormPreset.Circle(
          this.diameter,
          t.d - 2 * as - 2 * mainBar.diameter
        )
      );
    this.container.record(this.spec);
  }
  pos(t: PileStruct): number[] {
    const as = this.info.as;
    return divideBySpace(0, -t.h + as, this.space).slice(1, -1);
  }
}