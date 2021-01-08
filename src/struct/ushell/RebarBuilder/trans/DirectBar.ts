import { Line, RebarPathForm, vec } from "@/draw";
import { RebarBase } from "../Base";

export class DirectBar extends RebarBase{
  buildSpec(): this{
    const u = this.struct;
    if (u.oBeam.w > 0) {
      const bar = this.specs.trans.direct;
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
    const top =u.hd -u.oBeam.hd -u.oBeam.hs - u.as;
    const bottom = 0
    const w = u.t + u.oBeam.w - 2*u.as;
    const pts = new Line(vec(x, top), vec(x, bottom)).divide(bar.space).points;
    return pts.map(p => new Line(p, vec(x+w, p.y)));
  }
}