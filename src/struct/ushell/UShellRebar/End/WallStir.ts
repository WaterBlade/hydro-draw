import { Line, RebarForm, RebarFormPreset, Side, vec } from "@/draw";
import { UShellSpaceRebar } from "../UShellRebar";

export class EndWallStir extends UShellSpaceRebar {
  isExist(): boolean {
    return this.struct.cantCount < 2;
  }
  get gap(): number {
    return this.struct.waterStop.h;
  }
  shape(): Line[] {
    const u = this.struct;
    const as = this.rebars.as;
    const y0 = u.shell.hd - as;
    const y1 = -u.shell.r - this.gap - as;
    const leftEdge = u.genEndCOuterLeft().offset(as);
    const rightEdge = u.genEndCInnerLeft().offset(this.gap + as, Side.Right);

    const pts = new Line(vec(0, y0), vec(0, y1))
      .divide(this.space)
      .removeEndPt().points;
    return pts.map(
      (p) =>
        new Line(
          leftEdge.rayIntersect(p, vec(1, 0))[0],
          rightEdge.rayIntersect(p, vec(1, 0))[0]
        )
    );
  }
  get count(): number {
    return this.shape().length * (2 - this.struct.cantCount) * 2;
  }
  get form(): RebarForm {
    const lens = this.shape().map((l) => l.calcLength());
    return RebarFormPreset.RectStir(
      this.diameter,
      this.struct.endSect.b - 2 * this.rebars.as,
      lens
    );
  }
}

export class EndWallStirCant extends EndWallStir {
  isExist(): boolean {
    return this.struct.cantCount > 0;
  }
  get gap(): number {
    return 0;
  }
  get count(): number {
    return this.shape().length * this.struct.cantCount * 2;
  }
}
