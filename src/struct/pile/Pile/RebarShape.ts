import { Line, polar, vec } from "@/draw";
import { PileStruct } from "./PileStruct";
import { PileRebar } from "./PileRebar";

export class PileRebarShape{
  constructor(protected struct: PileStruct, protected rebars: PileRebar){}
  stirTop(): Line[] {
    const t = this.struct;
    const as = this.rebars.as;
    const bar = this.rebars.topStir;
    const mainBar = this.rebars.main;
    const left = new Line(
      vec(-t.d / 2 + as, t.hs),
      polar(mainBar.diameter * this.rebars.anchorFactor, t.topAngle + 90).add(
        vec(-t.d / 2 + as, t.hs)
      )
    );
    const right = left.mirrorByVAxis();
    const y = left.end.y;
    return new Line(vec(0, t.hs), vec(0, y))
      .divide(bar.space)
      .removeBothPt()
      .points.map(
        (p) =>
          new Line(
            left.rayIntersect(p, vec(1, 0))[0],
            right.rayIntersect(p, vec(1, 0))[0]
          )
      );
  }
}
