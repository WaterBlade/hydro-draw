import { divideBySpace, last, RebarFormPreset, RebarSpec, Side } from "@/draw";
import {
  CompositeRebar,
  CountRebar,
  Rebar,
  SpaceRebar,
  UnitRebar,
} from "@/struct/utils";
import { ColumnStruct } from "./ColumnStruct";

export class ColumnRebar extends CompositeRebar {
  corner = new Corner(this.container, this.info);
  cross = new Cross(this.container, this.info);
  along = new Along(this.container, this.info);
  stir = new Stir(this.container, this.info);

  build(t: ColumnStruct, name: string): void {
    this.corner.build(t, name);
    this.cross.build(t, name);
    this.along.build(t, name);
    this.stir.build(t, this.cross, this.along, this.corner, name);
  }
}

class Corner extends UnitRebar {
  spec = new RebarSpec();
  build(t: ColumnStruct, name: string): void {
    this.spec = this.genSpec();
    const form = RebarFormPreset.SShape(
      this.diameter,
      500,
      t.l + t.ld - this.info.as * 2,
      300,
      7
    )
      .text("柱顶", Side.Left, true)
      .text("柱底", Side.Right, true);
    this.spec
      .setCount(4 * t.n)
      .setForm(form)
      .setId(this.container.id)
      .setName(name);
    this.container.record(this.spec);
  }
}

class Cross extends CountRebar {
  spec = new RebarSpec();
  build(t: ColumnStruct, name: string): void {
    this.spec = this.genSpec();
    const form = RebarFormPreset.SShape(
      this.diameter,
      500,
      t.l + t.ld - this.info.as * 2,
      300,
      7
    )
      .text("柱顶", Side.Left, true)
      .text("柱底", Side.Right, true);
    this.spec
      .setCount(this.singleCount * t.n * 2)
      .setForm(form)
      .setId(this.container.id)
      .setName(name);
    this.container.record(this.spec);
  }
}

class Along extends CountRebar {
  spec = new RebarSpec();
  build(t: ColumnStruct, name: string): void {
    this.spec = this.genSpec();
    const form = RebarFormPreset.SShape(
      this.diameter,
      500,
      t.l + t.ld - this.info.as * 2,
      300,
      7
    )
      .text("柱顶", Side.Left, true)
      .text("柱底", Side.Right, true);
    this.spec
      .setCount(this.singleCount * t.n * 2)
      .setForm(form)
      .setId(this.container.id)
      .setName(name);
    this.container.record(this.spec);
  }
}

class Stir extends SpaceRebar {
  specCross: RebarSpec[] = [];
  specAlong: RebarSpec[] = [];
  spec = new RebarSpec();
  build(
    t: ColumnStruct,
    crossBar: CountRebar,
    alongBar: CountRebar,
    cornerBar: Rebar,
    name: string
  ): void {
    this.spec = this.genSpec();
    const as = this.info.as;
    const form = RebarFormPreset.RectStir(
      this.diameter,
      t.w - 2 * as,
      t.h - 2 * as
    );
    const aboveCount = this.pos(t).length * t.n;
    this.spec
      .setCount(aboveCount)
      .setForm(form)
      .setId(this.container.id)
      .setName(name);
    this.container.record(this.spec);
    this.stirCross(t, alongBar, cornerBar, name);
    this.stirAlong(t, crossBar, cornerBar, name);
  }
  pos(t: ColumnStruct): number[] {
    const partition = t.partition();
    const res: number[] = [];
    const as = this.info.as;
    const count = partition.length;
    let h = t.l - as - (t.toTop ? 0 : t.hTopBeam);
    for (let i = 0; i < count; i++) {
      let l;
      if (i === 0) {
        l = partition[0] - as - (t.toTop ? 0 : t.hTopBeam);
      } else if (i < count - 1) {
        l = partition[i];
      } else {
        l = last(partition) - 50;
      }
      const space = i % 2 === 0 ? this.denseSpace : this.space;
      const ys = divideBySpace(h, h - l, space);
      if (i % 2 === 1) {
        res.push(...ys.slice(1, -1));
      } else {
        res.push(...ys);
      }
      h -= l;
    }
    return res;
  }
  protected stirCross(
    t: ColumnStruct,
    alongBar: CountRebar,
    cornerBar: Rebar,
    name: string
  ): void {
    this.specCross = [];
    const as = this.info.as;
    const count = this.pos(t).length * t.n;
    const countAlong = alongBar.singleCount;
    const h =
      (t.h - 2 * as - cornerBar.diameter) / (countAlong + 1) +
      alongBar.diameter;
    const w = t.w - 2 * as;
    const spec = this.genSpec();
    spec
      .setCount(count * Math.floor(countAlong / 2))
      .setForm(RebarFormPreset.RectStir(this.diameter, h, w))
      .setId(this.container.id)
      .setName(name);
    this.specCross.push(spec);
    this.container.record(spec);
    if (countAlong % 2 === 1) {
      const spec = this.genSpec();
      spec
        .setCount(count)
        .setForm(RebarFormPreset.HookLine(this.diameter, w, 4))
        .setId(this.container.id)
        .setName(name);
      this.specCross.push(spec);
      this.container.record(spec);
    }
  }
  protected stirAlong(
    t: ColumnStruct,
    crossBar: CountRebar,
    cornerBar: Rebar,
    name: string
  ): void {
    this.specAlong = [];
    const as = this.info.as;
    const countCross = crossBar.singleCount;
    const count = this.pos(t).length * t.n;
    const h =
      (t.w - 2 * as - cornerBar.diameter) / (countCross + 1) +
      crossBar.diameter;
    const w = t.h - 2 * as;
    const spec = this.genSpec();
    spec
      .setCount(count * Math.floor(countCross / 2))
      .setForm(RebarFormPreset.RectStir(this.diameter, h, w))
      .setId(this.container.id)
      .setName(name);
    this.specAlong.push(spec);
    this.container.record(spec);
    if (countCross % 2 === 1) {
      const spec = this.genSpec();
      spec
        .setCount(count)
        .setForm(RebarFormPreset.HookLine(this.diameter, w, 4))
        .setId(this.container.id)
        .setName(name);
      this.specAlong.push(spec);
      this.container.record(spec);
    }
  }
}
