import { Line, Polyline, RebarFormPreset, vec } from "@/draw";
import { SpaceRebar } from "@/struct/utils";
import { FrameStruct } from "../../FrameStruct";

export class CorbelHStir extends SpaceRebar{
  build(t: FrameStruct, name: string): this {
    this.spec = this.genSpec();
    const as = this.info.as;
    const lines = this.shape(t);
    const form = RebarFormPreset.RectStir(
      this.diameter,
      t.col.w - 2 * as,
      lines.map((l) => l.calcLength())
    );
    this.spec
      .setCount(lines.length * 2)
      .setForm(form)
      .setId(this.container.id)
      .setName(name);
    this.container.record(this.spec);
    return this;
  }
  shape(t: FrameStruct): Line[] {
    const as = this.info.as;
    const pts = new Line(vec(0, t.h - as), vec(0, t.h - t.corbel.h + as))
      .divide(this.space)
      .removeBothPt().points;
    const left = new Polyline(-t.corbel.w - t.col.h / 2, t.h)
      .lineBy(0, -t.corbel.hd)
      .lineBy(t.corbel.w, -t.corbel.hs)
      .offset(as);
    const right = left.mirrorByVAxis();
    return pts.map(
      (p) =>
        new Line(
          left.rayIntersect(p, vec(1, 0))[0],
          right.rayIntersect(p, vec(1, 0))[0]
        )
    );
  }
}
