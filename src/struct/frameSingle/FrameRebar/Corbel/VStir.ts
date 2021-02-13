import { Line, RebarFormPreset, vec } from "@/draw";
import { SpaceRebar } from "@/struct/utils";
import { FrameSingleStruct } from "../../FrameStruct";

export class CorbelVStir extends SpaceRebar {
  build(t: FrameSingleStruct, name: string): this {
    this.spec = this.genSpec();
    const as = this.info.as;
    const lines = this.shape(t);
    const form = RebarFormPreset.RectStir(
      this.diameter,
      t.col.w - 2 * as,
      lines.map((l) => l.calcLength())
    );
    this.spec
      .setCount(lines.length * 4)
      .setForm(form)
      .setId(this.container.id)
      .setName(name);
    this.container.record(this.spec);
    return this;
  }
  shape(t: FrameSingleStruct): Line[] {
    const as = this.info.as;
    const pts = new Line(
      vec(-t.corbel.w - t.col.h / 2, t.h - as),
      vec(-t.col.h / 2, t.h - as)
    )
      .divide(this.space)
      .removeBothPt().points;
    const line = new Line(
      vec(-t.corbel.w - t.col.h / 2, t.h - t.corbel.hd),
      vec(-t.col.h / 2, t.h - t.corbel.h)
    ).offset(as);
    return pts.map((p) => new Line(p, line.rayIntersect(p, vec(0, 1))[0]));
  }
}
