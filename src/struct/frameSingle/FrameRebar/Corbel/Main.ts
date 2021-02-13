import { Polyline, RebarFormPreset, Side } from "@/draw";
import { CountRebar } from "@/struct/utils";
import { FrameSingleStruct } from "../../FrameStruct";

export class CorbelMain extends CountRebar {
  build(t: FrameSingleStruct, name: string): this {
    this.spec = this.genSpec();
    const lens = this.shape(t).lengths;
    const form = RebarFormPreset.CorbelDouble(
      this.diameter,
      lens[0] + 150,
      lens[1],
      lens[2]
    );
    this.spec
      .setCount(this.singleCount * 2)
      .setForm(form)
      .setId(this.container.id)
      .setName(name);
    this.container.record(this.spec);
    return this;
  }
  shape(t: FrameSingleStruct): Polyline {
    const as = this.info.as;
    return new Polyline(-t.col.h / 2, t.h - t.corbel.h)
      .lineBy(-t.corbel.w, t.corbel.hs)
      .lineBy(0, t.corbel.hd)
      .lineBy(t.col.h + t.corbel.w * 2, 0)
      .lineBy(0, -t.corbel.hd)
      .lineBy(-t.corbel.w, -t.corbel.hs)
      .offset(as, Side.Right);
  }
}
