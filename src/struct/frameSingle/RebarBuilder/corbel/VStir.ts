
import { Line, RebarFormPreset, vec } from "@/draw";
import { RebarBase } from "../../Base";

export class VStir extends RebarBase{
  buildSpec(): this{
    const t = this.struct;
    const bar = this.specs.corbel.vStir;
    const as = this.specs.as;
    const lines = this.genShape();
    const form = RebarFormPreset.RectStir(
      bar.diameter, t.col.w - 2* as, lines.map(l => l.calcLength())
    );
    bar.setCount(lines.length * 4).setForm(form).setId(this.specs.id.gen()).setStructure(this.name);
    this.specs.record(bar);
    return this;
  }
  protected genShape(): Line[]{
    const t = this.struct;
    const as = this.specs.as;
    const bar = this.specs.corbel.vStir;
    const pts = new Line(vec(-t.corbel.w-t.col.h/2, t.h-as), vec(-t.col.h/2, t.h-as))
      .divide(bar.space).removeBothPt().points;
    const line = new Line(vec(-t.corbel.w - t.col.h/2, t.h-t.corbel.hd), vec(-t.col.h/2, t.h-t.corbel.h)).offset(as);
    return pts.map(
      p => new Line(p, line.rayIntersect(p, vec(0, 1))[0]) 
    );
  }
  buildFigure(): this{
    this.drawAlong();
    return this;
  }
  protected drawAlong(): void{
    const t = this.struct;
    const bar = this.specs.corbel.vStir;
    const fig = this.figures.along;
    const as = this.specs.as;
    const left = this.genShape();
    const right = left.map(l => l.mirrorByVAxis());
    fig.push(
      fig.planeRebar()
        .rebar(...left, ...right)
        .spec(bar, left.length + right.length)
        .leaderNote(vec(-t.col.h/2-t.corbel.w-fig.h, t.h-as-this.specs.corbel.hStir.space/2), vec(1, 0))
        .generate()
        );
  }
}