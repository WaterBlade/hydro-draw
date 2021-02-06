import { Line, polar, RebarFormPreset, vec } from "@/draw";
import { PileStruct } from "../PileStruct";
import { Rebar, SpaceRebar } from "../../utils";
import { PileRebarInfo } from "./Info";

export class StirTop extends SpaceRebar<PileRebarInfo>{
  build(t: PileStruct, mainBar: Rebar): void{
    this.spec = this.genSpec();
    const lines = this.shape(t, mainBar);
    this.spec
      .setId(this.container.id)
      .setCount(lines.length * t.count)
      .setForm(
        RebarFormPreset.Circle(
          this.diameter,
          lines.map((l) => l.calcLength())
        )
      );
    this.container.record(this.spec);
  }
  shape(t: PileStruct, mainBar: Rebar): Line[] {
    const as = this.info.as;
    const left = new Line(
      vec(-t.d / 2 + as, t.hs),
      polar(mainBar.diameter * this.info.anchorFactor, t.topAngle + 90).add(
        vec(-t.d / 2 + as, t.hs)
      )
    );
    const right = left.mirrorByVAxis();
    const y = left.end.y;
    return new Line(vec(0, t.hs), vec(0, y))
      .divide(this.space)
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