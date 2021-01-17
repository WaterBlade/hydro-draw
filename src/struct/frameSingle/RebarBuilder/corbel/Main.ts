import { Polyline, RebarFormPreset, Side } from "@/draw";
import { RebarBase } from "../../Base";

export class Main extends RebarBase{
  buildSpec(): this{
    const bar = this.specs.corbel.main;
    const lens = this.genShape().lengths;
    const form = RebarFormPreset
      .CorbelDouble(bar.diameter, lens[0]+150, lens[1], lens[2]);
    bar.setCount(bar.singleCount * 2).setForm(form).setId(this.specs.id.gen()).setStructure(this.name);
    this.specs.record(bar);
    return this;
  }
  protected genShape(): Polyline{
    const t = this.struct;
    const as = this.specs.as;
    return new Polyline(-t.col.h/2, t.h-t.corbel.h)
      .lineBy(-t.corbel.w, t.corbel.hs)
      .lineBy(0, t.corbel.hd)
      .lineBy(t.col.h + t.corbel.w*2, 0)
      .lineBy(0, -t.corbel.hd)
      .lineBy(-t.corbel.w, -t.corbel.hs)
      .offset(as, Side.Right)
  }
  buildFigure(): this{
    return this;
  }
}