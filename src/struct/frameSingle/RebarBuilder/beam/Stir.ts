
import { Line, RebarFormPreset, vec, Vector } from "@/draw";
import { RebarBase } from "../../Base";

export class Stir extends RebarBase{
  buildSpec(): this{
    const t = this.struct;
    const bar = this.specs.beam.stir;
    const as = this.specs.as;
    const form = RebarFormPreset.RectStir(
      bar.diameter, t.topBeam.w - 2* as, t.topBeam.h - 2*as 
    );
    bar.setCount(this.genMulPos().length).setForm(form).setId(this.specs.id.gen()).setStructure(this.name);
    this.specs.record(bar);
    return this;
  }
  protected genMulPos(): Vector[]{
    const t = this.struct;
    const as = this.specs.as;
    return new Line(vec(-t.hs/2, t.h-as), vec(t.hs/2, t.h-as)).divide(this.specs.topBeam.stir.space).removeStartPt().removeEndPt().points;
  }
  buildFigure(): this{
    return this;
  }
}