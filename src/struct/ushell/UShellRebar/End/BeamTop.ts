import { Line, RebarForm, RebarFormPreset, vec } from "@/draw";
import { UShellCountRebar } from "../UShellRebar";

export class EndBeamTop extends UShellCountRebar {
  shape(): Line {
    const u = this.struct;
    const as = this.rebars.as;
    const leftEdge = u.genEndCOuterLeft().offset(as);
    const rightEdge = leftEdge.mirrorByVAxis();

    const y = -u.shell.r - u.waterStop.h - as;
    const left = leftEdge.rayIntersect(vec(0, y), vec(1, 0))[0];
    const right = rightEdge.rayIntersect(vec(0, y), vec(1, 0))[0];
    return new Line(left, right);
  }
  get count(): number {
    return this.singleCount * 2;
  }
  get form(): RebarForm {
    return RebarFormPreset.Line(this.diameter, this.shape().calcLength());
  }
}
