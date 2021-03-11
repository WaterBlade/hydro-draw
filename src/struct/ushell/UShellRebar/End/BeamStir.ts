import { Arc, Line, RebarForm, RebarFormPreset, vec } from "@/draw";
import { UShellSpaceRebar } from "../UShellRebar";

export class EndBeamStir extends UShellSpaceRebar {
  isExist(): boolean {
    return this.struct.cantCount < 2;
  }
  get gap(): number {
    return 0;
  }
  shape(): Line[] {
    const u = this.struct;
    const as = this.rebars.as;
    const l = Math.min(
      u.shell.r,
      u.shell.r + u.shell.t + u.oBeam.w - u.endSect.w
    );
    const y = u.shell.hd - u.endHeight + u.support.h + as;
    const pts = new Line(vec(-l, y), vec(l, y)).divide(this.space).points;
    const topEdge = new Arc(vec(0, 0), u.shell.r + this.gap + as, 180, 0);
    return pts.map((p) => new Line(p, topEdge.rayIntersect(p, vec(0, 1))[0]));
  }
  get count(): number {
    return (2 - this.struct.cantCount) * this.shape().length;
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

export class EndBeamStirCant extends EndBeamStir {
  isExist(): boolean {
    return this.struct.cantCount > 0;
  }
  get gap(): number {
    return this.struct.waterStop.h;
  }
  get count(): number {
    return this.struct.cantCount * this.shape().length;
  }
}
