import { Polyline, RebarForm, RebarFormPreset } from "@/draw";
import { PierHollowSpaceRebar } from "./PierHollowRebar";

export class HHuanch extends PierHollowSpaceRebar{
  get count(): number{
    const t = this.struct;
    return Math.floor((t.h - t.hTopSolid - t.hBotSolid) / this.space)*4;
  }
  get form(): RebarForm{
    const l = this.shape().lengths[0];
    return RebarFormPreset.Line(this.diameter, l);
  }
  shape(d = 0): Polyline{
    const t = this.struct;
    return new Polyline(-t.l/2, t.w/2)
      .lineBy(0, -2*t.t-t.ha)
      .lineBy(2*t.t+t.ha, 2*t.t+t.ha)
      .lineBy(-2*t.t-t.ha, 0)
      .offset(this.rebars.as + d)
      .removeStart()
      .removeEnd();
  }
}