import { RebarPathForm, Side } from "@/draw";
import { RebarBase } from "../Base";

export class Stir extends RebarBase{
  buildSpec(): this{
    const bar = this.specs.stir;
    const t = this.struct;
    const as = this.specs.as;
    bar
      .setId(this.specs.id.gen())
      .setCount(t.count)
      .setForm(
        new RebarPathForm(bar.diameter)
          .lineBy(0.25, 1.6).lineBy(0.25, -1.6)
          .lineBy(0.25, 1.6).lineBy(0.25, -1.6)
          .lineBy(0.25, 1.6).lineBy(0.25, -1.6)
          .lineBy(0.25, 1.6).lineBy(0.25, -1.6)
          .lineBy(0.25, 1.6).lineBy(0.25, -1.6)
          .text(`D=${t.d - 2*as}`, Side.Right).setLength(this.calcLength())
      );
    this.specs.record(bar);
    return this;
  }
  protected calcLength(): number{
    const t = this.struct;
    const bar = this.specs.stir;
    const as = this.specs.as;
    const peri = Math.PI * (t.d - 2*as);
    if(t.h < t.d * 5){
      const n = Math.floor((t.h+t.hs-as) / bar.denseSpace)
      return n * Math.sqrt(peri**2 + bar.denseSpace**2);
    }else{
      const n0 = Math.floor((t.d*5+t.hs) / bar.denseSpace);
      const l0 = n0 * Math.sqrt(peri**2 + bar.denseSpace**2);
      const n1 = Math.floor((t.h - 5*t.d - as) / bar.space);
      const l1 = n1 * Math.sqrt(peri**2 + bar.space**2);
      return l0 + l1;
    }
  }
  buildFigure(): this{
    return this;
  }
}
