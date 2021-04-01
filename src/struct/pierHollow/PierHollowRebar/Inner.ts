import { Polyline, RebarForm, RebarFormPreset, Side} from "@/draw";
import { PierHollowSpaceRebar } from "./PierHollowRebar";

export class Inner extends PierHollowSpaceRebar{
  pos(d=0): Polyline{
    const t = this.struct;
    const as = this.rebars.as;
    return t.inner().offset(as+d, Side.Right).divide(this.space);
  }
  get count(): number{
    return this.pos().points.length;
  }
  get form(): RebarForm{
    const t =this.struct;
    return RebarFormPreset.LShape(this.diameter, 500, t.h + t.topBeam.h + t.found.h-2*this.rebars.as);
  }
}