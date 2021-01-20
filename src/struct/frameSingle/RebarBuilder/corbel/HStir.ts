
import { Line, Polyline, RebarFormPreset, vec } from "@/draw";
import { RebarBase } from "../../Base";

export class HStir extends RebarBase{
  buildSpec(): this{
    const t = this.struct;
    const bar = this.specs.corbel.hStir;
    const as = this.specs.as;
    const lines = this.genShape();
    const form = RebarFormPreset.RectStir(
      bar.diameter, t.col.w - 2* as, lines.map(l => l.calcLength())
    );
    bar.setCount(lines.length * 2).setForm(form).setId(this.specs.id.gen()).setStructure(this.name);
    this.specs.record(bar);
    return this;
  }
  protected genShape(): Line[]{
    const t = this.struct;
    const as = this.specs.as;
    const bar = this.specs.corbel.hStir;
    const pts = new Line(vec(0, t.h-as), vec(0, t.h-t.corbel.h+as))
      .divide(bar.space).removeBothPt().points;
    const left = new Polyline(-t.corbel.w - t.col.h/2, t.h)
      .lineBy(0, -t.corbel.hd)
      .lineBy(t.corbel.w, -t.corbel.hs)
      .offset(as);
    const right = left.mirrorByVAxis();
    return pts.map(
      p => new Line(
        left.rayIntersect(p, vec(1, 0))[0],
        right.rayIntersect(p, vec(1, 0))[0]
      ) 
    );
  }
  buildFigure(): this{
    this.drawAlong();
    return this;
  }
  protected drawAlong(): void{
    const t = this.struct;
    const bar = this.specs.corbel.hStir;
    const fig = this.figures.along;
    const lens = this.genShape();
    fig.push(
      fig.planeRebar()
        .rebar(...lens)
        .spec(bar, lens.length, bar.space)
        .leaderNote(vec(t.col.h/2 + bar.space/2, t.h+2*fig.h), vec(0, 1), vec(1, 0))
        .generate()
    );
  }
}