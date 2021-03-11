import {
  Arc,
  Line,
  Polyline,
  RebarForm,
  RebarFormPreset,
  Side,
  vec,
} from "@/draw";
import { UShellSpaceRebar } from "../UShellRebar";

export class TransArc extends UShellSpaceRebar {
  get count(): number {
    const u = this.struct;
    return (
      (2 + (u.cantLeft > 0 ? 1 : 0) + (u.cantRight > 0 ? 1 : 0)) *
      this.shape().length
    );
  }
  get form(): RebarForm {
    const u = this.struct;
    const factor = Math.sqrt(u.lenTrans ** 2 + u.oBeam.w ** 2) / u.oBeam.w;

    return RebarFormPreset.Line(
      this.diameter,
      this.shape().map((l) => factor * l.calcLength())
    );
  }
  shape(): Line[] {
    const u = this.struct;
    const as = this.rebars.as;
    const pts = new Arc(vec(0, 0), u.shell.r + as, 180, 0)
      .divide(this.space)
      .removeStartPt()
      .removeEndPt().points;
    const x = u.shell.r + u.shell.t + u.oBeam.w;
    const first = u
      .genEndCOuter()
      .resetStart(vec(-x, 0))
      .resetEnd(vec(x, 0))
      .offset(as);
    const second = u
      .genTransCOuter()
      .offset((u.endSect.b * u.oBeam.w) / u.lenTrans - as, Side.Right);
    return pts.map((p) => {
      const p1 = first.rayIntersect(p, p)[0];
      const p2 = second.rayIntersect(p, p)[0];
      const end = p1.sub(p).length() > p2.sub(p).length() ? p2 : p1;
      return new Line(p, end);
    });
  }
  shapeEnd(): Polyline {
    const u = this.struct;
    const as = this.rebars.as;
    const d =
      u.endHeight -
      u.shell.hd -
      u.shell.r -
      u.shell.t -
      u.shell.hb -
      u.oBeam.w -
      u.support.h;
    const x0 = u.endSect.b - (d * u.lenTrans) / u.oBeam.w;
    const y0 = u.shell.hd + u.shell.r - u.endHeight + u.support.h;
    const x1 =
      u.endSect.b +
      u.lenTrans +
      ((u.shell.t + u.shell.hb) * u.lenTrans) / u.oBeam.w;
    const p = new Polyline(x0 - 1, y0)
      .lineBy(1, 0)
      .lineTo(x1, 0)
      .lineBy(-1, 0)
      .offset(as)
      .removeStart()
      .removeEnd();
    return p;
  }
}
