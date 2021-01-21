import { Line, RebarPathForm, Side, vec } from "@/draw";
import { RebarBase } from "../Base";

export class Fix extends RebarBase{
  buildSpec(): this{
    const bar = this.specs.fix;
    const as = this.specs.as;
    const t = this.struct;
    const lines = this.genMulPos();
    const len = 1.414*as;
    bar
      .setId(this.specs.id.gen())
      .setCount(lines.length * t.count * 4)
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
    return new Line(vec(-t.d/2+as, 0), vec(t.d/2-as, -t.h+as)).divide(bar.space).removeBothPt().points.map(p => p.y);
  }
  buildFigure(): this{
    return this;
  }
}