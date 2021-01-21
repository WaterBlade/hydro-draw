import { RebarPathForm, Side } from "@/draw";
import { RebarBase } from "../Base";

export class Main extends RebarBase{
  buildSpec(): this{
    const bar = this.specs.main;
    const as = this.specs.as;
    const t = this.struct;
    bar
      .setId(this.specs.id.gen())
      .setCount(bar.singleCount * t.count)
      .setForm(
        new RebarPathForm(bar.diameter)
          .lineBy(1.5, 0.8).dimLength(bar.diameter * this.specs.anchorFactor, Side.Right)
          .guideLineBy(-1, 0).dimAngle(t.topAngle)
          .lineBy(4, 0).dimLength(t.h - as + t.hs-1000)
          .guideLineBy(1, 0)
          .lineBy(1.5, 0.8).dimLength(1000).dimAngle(t.botAngle)
          .text('桩顶', Side.Left, true)
          .text('桩底', Side.Right, true)
      )
    this.specs.record(bar);
    return this;
  }
  buildFigure(): this{
    return this;
  }
}