import { Arc, Line, Polyline, RebarFormPreset, Side, vec } from "@/draw";
import { SpaceRebar } from "@/struct/utils";
import { UShellStruct } from "../../UShellStruct";
import { UShellRebarInfo } from "../Info";

export class TransArc extends SpaceRebar<UShellRebarInfo> {
  build(u: UShellStruct, name: string): void {
    if (u.oBeam.w > 0) {
      this.spec = this.genSpec();
      const lines = this.shape(u);
      const count =
        (2 + (u.cantLeft > 0 ? 1 : 0) + (u.cantRight > 0 ? 1 : 0)) *
        lines.length;
      const factor = Math.sqrt(u.lenTrans ** 2 + u.oBeam.w ** 2) / u.oBeam.w;
      this.spec
        .setCount(count)
        .setForm(
          RebarFormPreset.Line(
            this.diameter,
            lines.map((l) => factor * l.calcLength())
          )
        )
        .setId(this.container.id)
        .setName(name);

      this.container.record(this.spec);
    }
  }
  shape(u: UShellStruct): Line[] {
    const as = this.info.as;
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
  shapeEnd(u: UShellStruct): Polyline {
    const as = this.info.as;
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
