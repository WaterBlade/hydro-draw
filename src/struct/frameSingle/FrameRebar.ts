import { BeamRebar, ColumnRebar } from "@/struct/component";
import {
  CompositeRebar,
  CountRebar,
  RebarRoot,
  SpaceRebar,
} from "@/struct/utils";
import { FrameSingleStruct } from "./FrameStruct";
import { Line, Polyline, RebarForm, RebarFormPreset, Side, vec } from "@/draw";

export class FrameSingleRebar extends RebarRoot {
  col = this.add(new ColumnRebar(this.struct.col, this, "柱"));
  topBeam = this.add(new BeamRebar(this.struct.topBeam, this, "顶梁"));
  beam = this.add(new BeamRebar(this.struct.beam, this, "横梁"));
  corbel = this.add(new FrameCorbel(this.struct, this, "牛腿"));

  constructor(protected struct: FrameSingleStruct) {
    super();
  }
}

class FrameCorbel extends CompositeRebar {
  main = this.add(new CorbelMain(this.struct, this.rebars));
  hStir = this.add(new CorbelHStir(this.struct, this.rebars));
  vStir = this.add(new CorbelVStir(this.struct, this.rebars));
  constructor(
    protected struct: FrameSingleStruct,
    protected rebars: FrameSingleRebar,
    protected name = ""
  ) {
    super();
  }
}

class CorbelHStir extends SpaceRebar {
  constructor(
    protected struct: FrameSingleStruct,
    protected rebars: FrameSingleRebar
  ) {
    super();
  }
  get count(): number {
    return this.shape().length * 2;
  }
  get form(): RebarForm {
    const t = this.struct;
    const as = this.rebars.as;
    return RebarFormPreset.RectStir(
      this.diameter,
      t.col.w - 2 * as,
      this.shape().map((l) => l.calcLength())
    );
  }
  shape(): Line[] {
    const t = this.struct;
    const as = this.rebars.as;
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

class CorbelMain extends CountRebar {
  constructor(
    protected struct: FrameSingleStruct,
    protected rebars: FrameSingleRebar
  ) {
    super();
  }
  get count(): number {
    return this.singleCount * 2;
  }
  get form(): RebarForm {
    const lens = this.shape().lengths;
    return RebarFormPreset.CorbelDouble(
      this.diameter,
      lens[0] + 150,
      lens[1],
      lens[2]
    );
  }
  shape(): Polyline {
    const t = this.struct;
    const as = this.rebars.as;
    return new Polyline(-t.col.h / 2, t.h - t.corbel.h)
      .lineBy(-t.corbel.w, t.corbel.hs)
      .lineBy(0, t.corbel.hd)
      .lineBy(t.col.h + t.corbel.w * 2, 0)
      .lineBy(0, -t.corbel.hd)
      .lineBy(-t.corbel.w, -t.corbel.hs)
      .offset(as, Side.Right);
  }
}

class CorbelVStir extends SpaceRebar {
  constructor(
    protected struct: FrameSingleStruct,
    protected rebars: FrameSingleRebar
  ) {
    super();
  }
  get count(): number {
    return this.shape().length * 4;
  }
  get form(): RebarForm {
    const t = this.struct;
    const as = this.rebars.as;
    return RebarFormPreset.RectStir(
      this.diameter,
      t.col.w - 2 * as,
      this.shape().map((l) => l.calcLength())
    );
  }
  shape(): Line[] {
    const t = this.struct;
    const as = this.rebars.as;
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
