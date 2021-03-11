import { Line, RebarForm, RebarFormPreset, vec } from "@/draw";
import { UShellSpaceRebar } from "../UShellRebar";

export class TransDirect extends UShellSpaceRebar {
  get count(): number {
    const u = this.struct;
    return (
      (2 + (u.cantLeft > 0 ? 1 : 0) + (u.cantRight > 0 ? 1 : 0)) *
      this.shape().length *
      2
    );
  }
  get form(): RebarForm {
    const u = this.struct;
    const factor = Math.sqrt(u.lenTrans ** 2 + u.oBeam.w ** 2) / u.oBeam.w;

    return RebarFormPreset.Line(
      this.diameter,
      factor * (u.shell.t + u.oBeam.w - 2 * this.rebars.as)
    );
  }
  shape(): Line[] {
    const u = this.struct;
    const as = this.rebars.as;
    const x = -u.shell.r - u.shell.t - u.oBeam.w + as;
    const top = u.shell.hd - u.oBeam.hd - u.oBeam.hs - as;
    const bottom = 0;
    const w = u.shell.t + u.oBeam.w - 2 * as;
    const pts = new Line(vec(x, top), vec(x, bottom)).divide(this.space).points;
    return pts.map((p) => new Line(p, vec(x + w, p.y)));
  }
}
