import { Line, RebarForm, RebarFormPreset, vec } from "@/draw";
import { UShellCountRebar } from "../UShellRebar";

export class EndBeamBot extends UShellCountRebar {
  shape(): Line {
    const u = this.struct;
    const as = this.rebars.as;
    const y = u.shell.hd - u.endHeight + u.support.h + as;
    const leftEdge = u.genEndCOuterLeft().offset(as);
    const rightEdge = leftEdge.mirrorByVAxis();
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
