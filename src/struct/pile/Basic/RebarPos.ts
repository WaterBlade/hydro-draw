import { divideByCount, divideBySpace, StrecthSide } from "@/draw";
import { Pile } from "./PileStruct";
import { PileRebar } from "./PileRebar";

export const PileRebarPos = {
  fix(struct: Pile, rebars: PileRebar): number[]{
    const t = struct;
    const as = rebars.as;
    const bar = rebars.fix;
    return divideBySpace(0, -t.h+as, bar.space).slice(1, -1);
  },
  main(struct: Pile, rebars: PileRebar): number[]{
    const t = struct;
    const bar = rebars.main;
    const as = rebars.as;
    const n = Math.ceil(bar.singleCount / 2)-1;
    return divideByCount(-t.d/2+as, t.d/2-as, n);
  },
  rib(struct: Pile, rebars: PileRebar): number[]{
    const t = struct;
    const as = rebars.as;
    const bar = rebars.fix;
    return divideBySpace(0, -t.h+as, bar.space).slice(1, -1);
  },
  stir(struct: Pile, rebars: PileRebar): number[]{
    const t = struct;
    const bar = rebars.stir;
    const ln = t.d * rebars.denseFactor;
    if(t.h < ln){
      return divideBySpace(t.hs, -t.h, bar.denseSpace, StrecthSide.head)
    }else{
      return divideBySpace(t.hs, -ln, bar.denseSpace, StrecthSide.head).slice(0, -1).concat(
        divideBySpace(-ln, -t.h, bar.space, StrecthSide.tail)
      )
    }
  },
}