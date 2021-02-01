import { divideByCount, divideBySpace, StrecthSide } from "@/draw";
import { PileStruct } from "./PileStruct";
import { PileRebar } from "./PileRebar";

export class PileRebarPos{
  constructor(protected struct: PileStruct, protected rebars: PileRebar){}
  fix(): number[] {
    const t = this.struct;
    const as = this.rebars.as;
    const bar = this.rebars.fix;
    return divideBySpace(0, -t.h + as, bar.space).slice(1, -1);
  }
  main(): number[] {
    const t = this.struct;
    const bar = this.rebars.main;
    const as = this.rebars.as;
    const n = Math.ceil(bar.singleCount / 2) - 1;
    return divideByCount(-t.d / 2 + as, t.d / 2 - as, n);
  }
  rib(): number[] {
    const t = this.struct;
    const as = this.rebars.as;
    const bar = this.rebars.fix;
    return divideBySpace(0, -t.h + as, bar.space).slice(1, -1);
  }
  stir(): number[] {
    const t = this.struct;
    const bar = this.rebars.stir;
    const ln = t.d * this.rebars.denseFactor;
    if (t.h < ln) {
      return divideBySpace(t.hs, -t.h, bar.denseSpace, StrecthSide.head);
    } else {
      return divideBySpace(t.hs, -ln, bar.denseSpace, StrecthSide.head)
        .slice(0, -1)
        .concat(divideBySpace(-ln, -t.h, bar.space, StrecthSide.tail));
    }
  }
}
