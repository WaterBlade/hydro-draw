import { divideByCount, RebarPathForm, RebarSpec, Side } from "@/draw";
import { PileStruct } from "../PileStruct";
import { CountRebar } from "../../utils";
import { PileRebarInfo } from "./Info";

export class Main extends CountRebar<PileRebarInfo> {
  spec = new RebarSpec();
  build(t: PileStruct): void {
    const as = this.info.as;
    this.spec = this.genSpec();

    this.spec
      .setId(this.container.id)
      .setCount(this.singleCount * t.count)
      .setForm(
        new RebarPathForm(this.diameter)
          .lineBy(1.5, 0.8)
          .dimLength(this.diameter * this.info.anchorFactor, Side.Right)
          .guideLineBy(-1, 0)
          .dimAngle(t.topAngle)
          .lineBy(4, 0)
          .dimLength(t.h - as + t.hs - 1000)
          .guideLineBy(1, 0)
          .lineBy(1.5, 0.8)
          .dimLength(1000)
          .dimAngle(t.botAngle)
          .text("桩顶", Side.Left, true)
          .text("桩底", Side.Right, true)
      );
    this.container.record(this.spec);
  }
  pos(t: PileStruct): number[] {
    const as = this.info.as;
    const n = Math.ceil(this.singleCount / 2) - 1;
    return divideByCount(-t.d / 2 + as, t.d / 2 - as, n);
  }
}
