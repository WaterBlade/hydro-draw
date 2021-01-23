import { Circle, Line, RebarFormPreset, vec } from "@/draw";
import { RebarBase } from "../Base";

export class Rib extends RebarBase{
  buildSpec(): this{
    const bar = this.specs.rib;
    const mainBar = this.specs.main;
    const as = this.specs.as;
    const t = this.struct;
    bar
      .setId(this.specs.id.gen())
      .setCount(this.genMulShape().length * t.count)
      .setForm(
        RebarFormPreset.Circle(bar.diameter, t.d-2*as-2*mainBar.diameter)
      )
    this.specs.record(bar);
    return this;
  }
  protected genMulShape(): Line[]{
    const t = this.struct;
    const as = this.specs.as;
    const bar = this.specs.fix;
    return new Line(vec(-t.d / 2 + as, 0), vec(-t.d / 2 + as, -t.h + as))
      .divide(bar.space).removeBothPt()
      .points.map(p => new Line(p.add(vec(0, as)), p.add(vec(t.d - 2 * as, as))));
  }
  buildFigure(): this{
    this.drawEle();
    this.drawSect();
    return this;
  }
  protected drawEle(): void{
    const bar = this.specs.rib;
    const t = this.struct;
    const fig = this.figures.ele;
    const lines = this.genMulShape();
    fig.push(
      fig.planeRebar()
        .rebar(...lines)
        .spec(bar, lines.length, bar.space)
        .leaderNote(vec(this.specs.main.pos.ele.find(t.d/3), t.hp + 2*fig.h), vec(0, 1), vec(1, 0))
        .generate()
    );
  }
  protected drawSect(): void{
    const bar = this.specs.rib;
    const as = this.specs.as;
    const t = this.struct;
    const fig = this.figures.sect;
    fig.push(
      fig.planeRebar()
        .rebar(new Circle(vec(0, 0), t.d/2 - as-2*fig.r))
        .spec(bar, 0, bar.space)
        .leaderNote(vec(-t.d/2+as+2*fig.r+fig.h, 0), vec(1, 0))
        .generate()
    );
  }
}
