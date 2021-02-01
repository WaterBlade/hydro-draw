import { divideBySpace, RebarFormPreset } from "@/draw";
import { BeamContext } from "./Beam";

export class BeamRebarBuilder extends BeamContext{
  build(name: string): void{
    this.bot(name);
    this.top(name);
    this.mid(name);
    this.stir(name);
    this.tendon(name);
  }
  protected bot(name: string): void{
    const t = this.struct;
    const bar = this.rebars.bot;
    const as = this.rebars.as;
    const form = RebarFormPreset.UShape(bar.diameter, 500, t.l - 2 * as);
    bar.setCount(bar.singleCount * t.n).setForm(form).setId(this.rebars.id.gen()).setName(name);
    this.rebars.record(bar);
  }
  protected top(name: string): void{
    const t = this.struct;
    const bar = this.rebars.top;
    const as = this.rebars.as;
    const form = RebarFormPreset.UShape(bar.diameter, 500, t.l - 2 * as);
    bar.setCount(bar.singleCount * t.n).setForm(form).setId(this.rebars.id.gen()).setName(name);
    this.rebars.record(bar);
  }
  protected mid(name: string): void{
    const t = this.struct;
    const bar = this.rebars.mid;
    const as = this.rebars.as;
    const form = RebarFormPreset.Line(bar.diameter, t.l - 2 * as);
    bar.setCount(bar.singleCount * t.n * 2).setForm(form).setId(this.rebars.id.gen()).setName(name);
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
    const count = divideBySpace(-t.ln/2, t.ln/2, bar.space).slice(1, -1).length * t.n;
    bar
      .setCount(count)
      .setForm(form)
      .setId(this.rebars.id.gen())
      .setName(name);
    this.rebars.record(bar);
  }
  protected tendon(name: string): void{
    const t = this.struct;
    const bar = this.rebars.tendon;
    const preBar = this.rebars.stir;
    const as = this.rebars.as;
    bar.setGrade(preBar.grade).setDiameter(8)
    bar.setForm(RebarFormPreset.HookLine(bar.diameter, t.w - 2 * as, 4));
    bar
      .setCount(Math.floor(t.ln / 200) * t.n)
      .setId(this.rebars.id.gen())
      .setName(name);
    this.rebars.record(bar);
  }
  
}

export class TopBeamRebarBuilder extends BeamRebarBuilder{
  protected top(name: string): void{
    const t = this.struct;
    const bar = this.rebars.top;
    const as = this.rebars.as;
    const form = RebarFormPreset.UShape(bar.diameter, 1200, t.l - 2 * as);
    bar.setCount(bar.singleCount * t.n).setForm(form).setId(this.rebars.id.gen()).setName(name);
    this.rebars.record(bar);
  }
}