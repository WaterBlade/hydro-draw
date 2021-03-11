import { divideBySpace, Polyline, RebarPathForm, RebarSpec } from "@/draw";
import { SpaceRebarOld } from "@/struct/utils";
import { PierSolidStruct } from "../PierSolidStruct";

export class Stir extends SpaceRebarOld {
  spec = new RebarSpec();
  build(t: PierSolidStruct): void {
    this.spec = this.genSpec();
    const lens = this.shape(t).segments.map((s) => s.calcLength());
    const r = t.fr.val - this.info.as;
    let i = 0;
    this.spec
      .setId(this.container.id)
      .setForm(
        new RebarPathForm(this.diameter)
          .arcBy(0.8, -0.8, 90)
          .dimArc(r)
          .dimLength(lens[i++])
          .lineBy(4, 0)
          .dimLength(lens[i++])
          .arcBy(0.8, 0.8, 90)
          .dimLength(lens[i++])
          .lineBy(0, 1.6)
          .dimLength(lens[i++])
          .arcBy(-0.8, 0.8, 90)
          .dimLength(lens[i++])
          .lineBy(-4, 0)
          .dimLength(lens[i++])
          .arcBy(-0.8, -0.8, 90)
          .dimLength(lens[i++])
          .lineBy(0, -1.6)
          .dimLength(lens[i++])
      )
      .setCount(this.pos(t).length);
    this.container.record(this.spec);
  }
  pos(t: PierSolidStruct): number[] {
    return divideBySpace(50, t.h.val - 50, this.space);
  }
  shape(t: PierSolidStruct): Polyline {
    const r = t.fr.val;
    const l = t.l.val - 2 * r;
    const w = t.w.val - 2 * r;
    return new Polyline(-l / 2, -w / 2)
      .arcBy(r, -r, 90)
      .lineBy(l, 0)
      .arcBy(r, r, 90)
      .lineBy(0, w)
      .arcBy(-r, r, 90)
      .lineBy(-l, 0)
      .arcBy(-r, -r, 90)
      .close();
  }
}
