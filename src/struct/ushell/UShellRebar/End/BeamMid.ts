import { Line, RebarFormPreset, vec } from "@/draw";
import { CountRebar} from "@/struct/utils";
import { UShellStruct } from "../../UShellStruct";
import { UShellRebarInfo } from "../Info";

export class EndBeamMid extends CountRebar<UShellRebarInfo>{
  build(u: UShellStruct, name: string): void{
    this.spec = this.genSpec();
    this.spec
      .setForm(
        RebarFormPreset.Line(
          this.diameter,
          this.shape(u).map((p) => p.calcLength())
        )
      )
      .setCount(this.singleCount * 4)
      .setId(this.container.id)
      .setName(name);
    this.container.record(this.spec);
  }
  shape(u: UShellStruct): Line[] {
    const as = this.info.as;
    const y0 = -u.shell.r - u.waterStop.h - as;
    const y1 = u.shell.hd - u.endHeight + u.support.h + as;
    const pts = new Line(vec(0, y0), vec(0, y1))
      .divideByCount(this.singleCount + 1)
      .removeStartPt()
      .removeEndPt().points;
    const leftEdge = u.genEndCOuterLeft().offset(as);
    const rightEdge = leftEdge.mirrorByVAxis();
    return pts.map(
      (p) =>
        new Line(
          leftEdge.rayIntersect(p, vec(1, 0))[0],
          rightEdge.rayIntersect(p, vec(1, 0))[0]
        )
    );
  }

}