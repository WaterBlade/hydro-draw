import { divideBySpace, RebarPathForm, Side, StrecthSide } from "@/draw";
import { PileStruct } from "../PileStruct";
import { SpaceRebar } from "../../utils";
import { PileRebarInfo } from "./Info";

export class Stir extends SpaceRebar<PileRebarInfo>{
  build(t: PileStruct): void{
    this.spec = this.genSpec();
    const as = this.info.as;
    const peri = Math.PI * (t.d - 2 * as);
    const n = this.pos(t).length;
    const length = Math.sqrt((n * peri) ** 2 + (t.hs + t.h) ** 2);
    this.spec
      .setId(this.container.id)
      .setCount(t.count)
      .setForm(
        new RebarPathForm(this.diameter)
          .lineBy(0.25, 1.6)
          .lineBy(0.25, -1.6)
          .lineBy(0.25, 1.6)
          .lineBy(0.25, -1.6)
          .lineBy(0.25, 1.6)
          .lineBy(0.25, -1.6)
          .lineBy(0.25, 1.6)
          .lineBy(0.25, -1.6)
          .lineBy(0.25, 1.6)
          .lineBy(0.25, -1.6)
          .text(`D=${t.d - 2 * as}`, Side.Right)
          .setLength(length)
      );
    this.container.record(this.spec);
  }
  pos(t: PileStruct): number[]{
    const ln = t.d * this.info.denseFactor;
    if (t.h < ln) {
      return divideBySpace(t.hs, -t.h, this.denseSpace, StrecthSide.head);
    } else {
      return divideBySpace(t.hs, -ln, this.denseSpace, StrecthSide.head)
        .slice(0, -1)
        .concat(divideBySpace(-ln, -t.h, this.space, StrecthSide.tail));
    }
  }
}