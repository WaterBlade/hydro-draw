import { Arc, Line, Polyline, Side, vec } from "@/draw";
import { UShellRebar } from "../UShellRebar";
import { UShellStruct } from "../UShellStruct";

export class ShapeTrans {
  constructor(protected struct: UShellStruct, protected rebars: UShellRebar) {}
  arc(): Line[] {
    const u = this.struct;
    const as = this.rebars.as;
    const bar = this.rebars.trans.direct;
    const pts = new Arc(vec(0, 0), u.shell.r + as, 180, 0)
      .divide(bar.space)
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
  arcEnd(): Polyline {
    const as = this.rebars.as;
    const u = this.struct;
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
  direct(): Line[] {
    const u = this.struct;
    const as = this.rebars.as;
    const bar = this.rebars.trans.direct;
    const x = -u.shell.r - u.shell.t - u.oBeam.w + as;
    const top = u.shell.hd - u.oBeam.hd - u.oBeam.hs - as;
    const bottom = 0;
    const w = u.shell.t + u.oBeam.w - 2 * as;
    const pts = new Line(vec(x, top), vec(x, bottom)).divide(bar.space).points;
    return pts.map((p) => new Line(p, vec(x + w, p.y)));
  }
}
