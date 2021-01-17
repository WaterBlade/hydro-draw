
import { RebarFormPreset } from "@/draw";
import { RebarBase } from "../../Base";

export class Mid extends RebarBase{
  buildSpec(): this{
    const t = this.struct;
    const bar = this.specs.topBeam.mid;
    const as = this.specs.as;
    const form = RebarFormPreset.Line(bar.diameter, t.w - 2*as);
    bar.setForm(form).setId(this.specs.id.gen()).setStructure(this.name);
    this.specs.record(bar);
    return this;
  }
  buildFigure(): this{
    return this;
  }
}