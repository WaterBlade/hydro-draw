import { Line, polar, RebarFormPreset, vec } from "@/draw";
import { RebarBase } from "../Base";

export class StirTop extends RebarBase{
  buildSpec(): this{
    const bar = this.specs.topStir;
    const t = this.struct;
    const lines = this.genMulShape();
    bar
      .setId(this.specs.id.gen())
      .setCount(lines.length * t.count)
      .setForm(
        RebarFormPreset.Circle(bar.diameter, lines.map(l=> l.calcLength()))
      );
    this.specs.record(bar);
    return this;
  }
  protected genMulShape(): Line[]{
    const t = this.struct;
    const as = this.specs.as;
    const bar = this.specs.topStir;
    const mainBar = this.specs.main;
    const left = new Line(vec(-t.d/2+as, t.hs), polar(mainBar.diameter * this.specs.anchorFactor, t.topAngle + 90).add(vec(-t.d/2+as, t.hs)));
    const right = left.mirrorByVAxis();
    const y = left.end.y;
    return new Line(vec(0, t.hs), vec(0, y)).divide(bar.space).removeBothPt().points.map(
      p => new Line(left.rayIntersect(p, vec(1, 0))[0], right.rayIntersect(p, vec(1, 0))[0])
    );
  }
  buildFigure(): this{
    this.drawEle();
    return this;
  }
  protected drawEle(): void{
    const t = this.struct;
    const bar = this.specs.topStir;
    const fig = this.figures.ele;
    const lines = this.genMulShape()
    fig.push(
      fig.planeRebar()
        .rebar(...lines)
        .spec(bar, lines.length, bar.space)
        .leaderNote(vec(this.specs.main.pos.ele.find(0), t.hp + 6*fig.h), vec(0, 1), vec(-1, 0))
        .generate()
    );
  }
}
