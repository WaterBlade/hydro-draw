import { Line, RebarFormPreset, vec } from "@/draw";
import { CountRebar } from "@/struct/utils";
import { UShellStruct } from "../../UShellStruct";
import { UShellRebarInfo } from "../Info";

export class EndBeamTop extends CountRebar<UShellRebarInfo> {
  build(u: UShellStruct, name: string): void {
    this.spec = this.genSpec();
    this.spec
      .setForm(RebarFormPreset.Line(this.diameter, this.shape(u).calcLength()))
      .setCount(this.singleCount * 2)
      .setId(this.container.id)
      .setName(name);
    this.container.record(this.spec);
  }
  shape(u: UShellStruct): Line {
    const as = this.info.as;
    const leftEdge = u.genEndCOuterLeft().offset(as);
    const rightEdge = leftEdge.mirrorByVAxis();

    const y = -u.shell.r - u.waterStop.h - as;
    const left = leftEdge.rayIntersect(vec(0, y), vec(1, 0))[0];
    const right = rightEdge.rayIntersect(vec(0, y), vec(1, 0))[0];
    return new Line(left, right);
  }
}
