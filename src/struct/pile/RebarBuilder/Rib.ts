import { Line, RebarFormPreset, vec } from "@/draw";
import { RebarBase } from "../Base";

export class Rib extends RebarBase{
  buildSpec(): this{
    const bar = this.specs.rib;
    const mainBar = this.specs.main;
    const as = this.specs.as;
    const t = this.struct;
    bar
      .setId(this.specs.id.gen())
      .setCount(this.genMulShape().length * t.count)
      .setForm(
        RebarFormPreset.Circle(bar.diameter, t.d-2*as-2*mainBar.diameter)
      )
    this.specs.record(bar);
    return this;
  }
  protected genMulShape(): Line[]{
    const t = this.struct;
    const as = this.specs.as;
    const bar = this.specs.fix;
    return new Line(vec(-t.d/2+as, 0), vec(t.d/2-as, -t.h+as)).divide(bar.space).removeBothPt().points.map(p => new Line(p, p.add(vec(t.d-2*as, 0))));
  }
  buildFigure(): this{
    return this;
  }
}
