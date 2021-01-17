
import { RebarFormPreset, Side } from "@/draw";
import { RebarBase } from "../../Base";

export class Corner extends RebarBase{
  buildSpec(): this{
    const t = this.struct;
    const bar = this.specs.column.corner;
    const form = RebarFormPreset
      .SShape(bar.diameter, 500, t.h + t.found.hn - this.specs.as * 2, 300)
      .text('柱顶', Side.Left, true)
      .text('柱底', Side.Right, true);
    bar.setCount(8).setForm(form).setId(this.specs.id.gen()).setStructure(this.name);
    this.specs.record(bar);
    return this;
  }
  buildFigure(): this{
    return this;
  }
}