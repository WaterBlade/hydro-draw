import { Line, RebarForm, RebarFormPreset, vec } from "@/draw";
import { UShellCountRebar } from "../UShellRebar";

export class EndBeamMid extends UShellCountRebar {
  shape(): Line[] {
    const u = this.struct;
    const as = this.rebars.as;
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
  get count(): number {
    return this.singleCount * 4;
  }
  get form(): RebarForm {
    return RebarFormPreset.Line(
      this.diameter,
      this.shape().map((p) => p.calcLength())
    );
  }
}
