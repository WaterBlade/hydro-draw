import { Arc, Line, RebarPathForm, vec } from "@/draw";
import { RebarBase } from "../Base";

export class ArcBar extends RebarBase{
  buildSpec(): this{
    const u = this.struct;
    if (u.oBeam.w > 0) {
      const bar = this.specs.trans.arc;
      const lines = this.genShape();
      const count = (2 + (u.cantLeft > 0 ? 1 : 0) + (u.cantRight > 0 ? 1 : 0)) * lines.length;
      const factor = Math.sqrt(u.trans ** 2 + u.oBeam.w ** 2) / u.oBeam.w;
      bar
        .setCount(count)
        .setForm(
          RebarPathForm.Line(bar.diameter, factor * (u.t + u.oBeam.w - 2*u.as))
        ).setId(this.id()).setStructure(this.name);
      
      this.specs.record(bar);
    }
    return this;
  }
  buildFigure(): this{
    return this;
  }
  protected genShape(): Line[]{
    const u = this.struct;
    const bar = this.specs.trans.direct;
    const x = -u.r - u.t - u.oBeam.w + u.as;
    const w = u.t + u.oBeam.w - 2*u.as;
    const pts = new Arc(vec(0, 0), u.r + u.as, 0, 180).divide(bar.space).removeStartPt().removeEndPt().points;
    return pts.map(p => new Line(p, vec(x+w, p.y)));
  }
}