
import { RebarFormPreset } from "@/draw";
import { RebarBase } from "../../Base";

export class Main extends RebarBase{
  buildSpec(): this{
    const t = this.struct;
    const bar = this.specs.corbel.main;
    const form = RebarFormPreset
      .SShape(bar.diameter, 500, t.h + t.found.hn - this.specs.as * 2, 300);
    bar.setCount(bar.singleCount * 2).setForm(form).setId(this.specs.id.gen()).setStructure(this.name);
    this.specs.record(bar);
    return this;
  }
  buildFigure(): this{
    return this;
  }
}