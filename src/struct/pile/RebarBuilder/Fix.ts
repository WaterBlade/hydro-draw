import { Line, Polyline, RebarPathForm, Side, vec } from "@/draw";
import { RebarBase } from "../Base";

export class Fix extends RebarBase{
  protected countInCircle = 4;
  buildSpec(): this{
    const bar = this.specs.fix;
    const as = this.specs.as;
    const t = this.struct;
    const lines = this.genMulPos();
    const len = 1.414*as;
    bar
      .setId(this.specs.id.gen())
      .setCount(lines.length * t.count * this.countInCircle)
      .setForm(
        new RebarPathForm(bar.diameter)
          .lineBy(1, 0).dimLength(100)
          .lineBy(1, 1).dimLength(len).dimVector(as, as, Side.Right)
          .lineBy(1, 0).dimLength(150)
          .lineBy(1, -1).dimLength(len)
          .lineBy(1, 0).dimLength(100)
      );
    this.specs.record(bar);
    return this;
  }
  protected genMulPos(): number[]{
    const t = this.struct;
    const as = this.specs.as;
    const bar = this.specs.fix;
    return new Line(vec(-t.d/2+as, 0), vec(-t.d/2+as, -t.h+as)).divide(bar.space).removeBothPt().points.map(p => p.y);
  }
  buildFigure(): this{
    this.drawEle();
    return this;
  }
  protected drawEle(): void{
    const t = this.struct;
    const fig = this.figures.ele;
    const as = this.specs.as;
    const bar = this.specs.fix;
    const ys = this.genMulPos();
    for(const y of ys){
      const left = new Polyline(-t.d/2 + as, y+50+as).lineBy(-as, -as).lineBy(0, -100).lineBy(as, -as);
      const right = left.mirrorByVAxis();
      fig.push(
        fig.planeRebar()
          .rebar(left, right)
          .spec(bar, this.countInCircle, bar.space)
          .leaderNote(vec(-t.d / 2 - fig.h, y), vec(1, 0)).generate()
      );
    }
  }
}