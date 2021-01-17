
import { RebarFormPreset } from "@/draw";
import { RebarBase } from "../../Base";

export class Stir extends RebarBase{
  buildSpec(): this{
    const t = this.struct;
    const bar = this.specs.column.stir;
    const as = this.specs.as;
    const form = RebarFormPreset.RectStir(
      bar.diameter, t.col.w - 2* as, t.col.h - 2*as 
    );
    bar.setCount(100).setForm(form).setId(this.specs.id.gen()).setStructure(this.name);
    this.specs.record(bar);
    return this;
  }
  buildFigure(): this{
    return this;
  }
}