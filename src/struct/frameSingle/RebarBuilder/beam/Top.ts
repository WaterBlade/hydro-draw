
import { RebarFormPreset } from "@/draw";
import { RebarBase } from "../../Base";

export class Top extends RebarBase{
  buildSpec(): this{
    const t = this.struct;
    const bar = this.specs.beam.top;
    const as = this.specs.as;
    const form = RebarFormPreset.UShape(bar.diameter, 500, t.w - 2*as);
    bar.setForm(form).setId(this.specs.id.gen()).setStructure(this.name);
    this.specs.record(bar);
    return this;
  }
  buildFigure(): this{
    return this;
  }
}