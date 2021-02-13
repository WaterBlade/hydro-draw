import { divideBySpace, RebarPathForm, Side } from "@/draw";
import { PileStruct } from "../PileStruct";
import { SpaceRebar } from "../../utils";
import { PileRebarInfo } from "./Info";

export class Fix extends SpaceRebar<PileRebarInfo> {
  build(t: PileStruct): void {
    this.spec = this.genSpec();

    const fixCount = this.info.fixCount;
    const as = this.info.as;
    const ys = this.pos(t);
    const len = 1.414 * as;
    this.spec
      .setId(this.container.id)
      .setCount(ys.length * t.count * fixCount)
      .setForm(
        new RebarPathForm(this.diameter)
          .lineBy(1, 0)
          .dimLength(100)
          .lineBy(1, 1)
          .dimLength(len)
          .dimVector(as, as, Side.Right)
          .lineBy(1, 0)
          .dimLength(150)
          .lineBy(1, -1)
          .dimLength(len)
          .lineBy(1, 0)
          .dimLength(100)
      );
    this.container.record(this.spec);
  }
  pos(t: PileStruct): number[] {
    const as = this.info.as;
    return divideBySpace(0, -t.h + as, this.space).slice(1, -1);
  }
}
