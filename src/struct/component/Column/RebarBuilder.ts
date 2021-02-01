import { RebarFormPreset, Side, UnitRebarSpec } from "@/draw";
import { ColumnContext } from "./Column";

export class ColumnRebarBuilder extends ColumnContext{
  build(name: string): void{
    this.corner(name);
    this.cross(name);
    this.along(name);
    this.stir(name);
    this.stirCross(name);
    this.stirAlong(name);
  }
  protected corner(name: string): void{
    const t = this.struct;
    const bar = this.rebars.corner;
    const form = RebarFormPreset.SShape(
      bar.diameter,
      500,
      t.l + t.ld - this.rebars.as * 2,
      300,
      7
    )
      .text("柱顶", Side.Left, true)
      .text("柱底", Side.Right, true);
    bar
      .setCount(4*t.n)
      .setForm(form)
      .setId(this.rebars.id.gen())
      .setName(name);
    this.rebars.record(bar);
  }
  protected cross(name: string): void{
    const t = this.struct;
    const bar = this.rebars.cross;
    const form = RebarFormPreset.SShape(
      bar.diameter,
      500,
      t.l + t.ld - this.rebars.as * 2,
      300,
      7
    )
      .text("柱顶", Side.Left, true)
      .text("柱底", Side.Right, true);
    bar
      .setCount(bar.singleCount * t.n)
      .setForm(form)
      .setId(this.rebars.id.gen())
      .setName(name);
    this.rebars.record(bar);
  }
  protected along(name: string): void{
    const t = this.struct;
    const bar = this.rebars.along;
    const form = RebarFormPreset.SShape(
      bar.diameter,
      500,
      t.l + t.ld - this.rebars.as * 2,
      300,
      7
    )
      .text("柱顶", Side.Left, true)
      .text("柱底", Side.Right, true);
    bar
      .setCount(bar.singleCount * t.n)
      .setForm(form)
      .setId(this.rebars.id.gen())
      .setName(name);
    this.rebars.record(bar);
  }
  protected stir(name: string): void{
    const t = this.struct;
    const bar = this.rebars.stir;
    const as = this.rebars.as;
    const form = RebarFormPreset.RectStir(
      bar.diameter,
      t.w - 2 * as,
      t.h - 2 * as
    );
    const aboveCount = this.pos.stir().length * t.n;
    bar
      .setCount(aboveCount)
      .setForm(form)
      .setId(this.rebars.id.gen())
      .setName(name);
    this.rebars.record(bar);

  }
  protected stirCross(name: string): void{
    const t = this.struct;
    const as = this.rebars.as;
    const colBar = this.rebars;
    const count = this.pos.stir().length * t.n;
    const countAlong = colBar.along.singleCount;
    const h =
      (t.h - 2 * as - colBar.corner.diameter) / (countAlong + 1) +
      colBar.along.diameter;
    const w = t.w - 2 * as;
    const preBar = colBar.stir;
    const bar = new UnitRebarSpec();
    bar
      .set(preBar.grade, preBar.diameter)
      .setCount(count * Math.floor(countAlong / 2))
      .setForm(RebarFormPreset.RectStir(preBar.diameter, h, w))
      .setId(this.rebars.id.gen())
      .setName(name);
    this.rebars.stirCross.push(bar);
    this.rebars.record(bar);
    if (countAlong % 2 === 1) {
      const bar = new UnitRebarSpec();
      bar
        .set(preBar.grade, preBar.diameter)
        .setCount(count)
        .setForm(RebarFormPreset.HookLine(preBar.diameter, w, 4))
        .setId(this.rebars.id.gen())
        .setName(name);
      this.rebars.stirCross.push(bar);
      this.rebars.record(bar);
    }
  }
  protected stirAlong(name: string): void{
    const t = this.struct;
    const as = this.rebars.as;
    const colBar = this.rebars;
    const countCross = colBar.cross.singleCount;
    const count = this.pos.stir().length * t.n;
    const h =
      (t.w - 2 * as - colBar.corner.diameter) / (countCross + 1) +
      colBar.cross.diameter;
    const w = t.h - 2 * as;
    const preBar = colBar.stir;
    const bar = new UnitRebarSpec();
    bar
      .set(preBar.grade, preBar.diameter)
      .setCount(count * Math.floor(countCross / 2))
      .setForm(RebarFormPreset.RectStir(preBar.diameter, h, w))
      .setId(this.rebars.id.gen())
      .setName(name);
    this.rebars.stirAlong.push(bar);
    this.rebars.record(bar);
    if (countCross % 2 === 1) {
      const bar = new UnitRebarSpec();
      bar
        .set(preBar.grade, preBar.diameter)
        .setCount(count)
        .setForm(RebarFormPreset.HookLine(preBar.diameter, w, 4))
        .setId(this.rebars.id.gen())
        .setName(name);
      this.rebars.stirAlong.push(bar);
      this.rebars.record(bar);
    }
  }
}