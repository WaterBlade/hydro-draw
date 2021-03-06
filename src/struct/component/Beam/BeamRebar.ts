import { divideBySpace, Polyline, RebarFormPreset, RebarSpec, Side } from "@/draw";
import { CompositeRebar, CountRebar, SpaceRebar } from "@/struct/utils";
import { BeamStruct } from "./BeamStruct";

export class BeamRebar extends CompositeRebar {
  bot = new BeamBot(this.container, this.info);
  top = new BeamTop(this.container, this.info);
  mid = new BeamMid(this.container, this.info);
  stir = new Stir(this.container, this.info);
  tendon = new Tendon(this.container, this.info);
  haunch = new Haunch(this.container, this.info);

  build(t: BeamStruct, name: string): void {
    this.bot.build(t, name);
    this.top.build(t, name);
    this.mid.build(t, name);
    this.stir.build(t, name);
    this.tendon.build(t, this.mid, name);
    this.haunch.build(t, name);
  }
}

class BeamBot extends CountRebar {
  spec = new RebarSpec();
  build(t: BeamStruct, name: string): void {
    this.spec = this.genSpec();
    const as = this.info.as;
    const form = RebarFormPreset.UShape(this.diameter, 500, t.l - 2 * as);
    this.spec
      .setCount(this.singleCount * t.n)
      .setForm(form)
      .setId(this.container.id)
      .setName(name);
    this.container.record(this.spec);
  }
}

class BeamTop extends CountRebar {
  spec = new RebarSpec();
  build(t: BeamStruct, name: string): void {
    this.spec = this.genSpec();
    const as = this.info.as;
    const form = RebarFormPreset.UShape(this.diameter, 500, t.l - 2 * as);
    this.spec
      .setCount(this.singleCount * t.n)
      .setForm(form)
      .setId(this.container.id)
      .setName(name);
    this.container.record(this.spec);
  }
}

class BeamMid extends CountRebar {
  spec = new RebarSpec();
  build(t: BeamStruct, name: string): void {
    this.spec = this.genSpec();
    const as = this.info.as;
    const form = RebarFormPreset.Line(this.diameter, t.l - 2 * as);
    this.spec
      .setCount(this.singleCount * t.n * 2)
      .setForm(form)
      .setId(this.container.id)
      .setName(name);
    this.container.record(this.spec);
  }
}

class Stir extends SpaceRebar {
  spec = new RebarSpec();
  build(t: BeamStruct, name: string): void {
    this.spec = this.genSpec();
    const as = this.info.as;
    const form = RebarFormPreset.RectStir(
      this.diameter,
      t.w - 2 * as,
      t.h - 2 * as
    );
    const count =
      divideBySpace(-t.ln / 2, t.ln / 2, this.space).slice(1, -1).length * t.n;
    this.spec
      .setCount(count)
      .setForm(form)
      .setId(this.container.id)
      .setName(name);
    this.container.record(this.spec);
  }
}

class Tendon extends SpaceRebar {
  spec = new RebarSpec();
  build(t: BeamStruct, midBar: CountRebar, name: string): void {
    this.spec = this.genSpec();
    const as = this.info.as;
    this.spec
      .setGrade("HPB300")
      .setDiameter(8)
      .setForm(RebarFormPreset.HookLine(this.diameter, t.w - 2 * as, 4))
      .setCount(Math.floor(t.ln / this.space) * t.n * midBar.singleCount)
      .setId(this.container.id)
      .setName(name);
    this.container.record(this.spec);
  }
}

class Haunch extends CountRebar{
  spec = new RebarSpec();
  build(t: BeamStruct, name: string): void{
    this.spec = this.genSpec();
    const len = this.shape(t)[0].calcLength();
    this.spec
      .setForm(RebarFormPreset.Line(this.diameter, len))
      .setCount(this.singleCount*t.n)
      .setId(this.container.id)
      .setName(name);
    this.container.record(this.spec);
  }
  shape(t: BeamStruct): Polyline[]{
    const w = (t.l - t.ln)/2;
    const bot = new Polyline(-t.l/2, -t.h/2 - t.ha - w + 1)
      .lineBy(0, -1).lineBy(w+t.ha+t.h, w+t.ha+t.h).lineBy(-1, 0)
      .offset(this.info.as).removeStart().removeEnd();
    const top = new Polyline(-t.l/2, t.h/2 + t.ha + w - 1)
      .lineBy(0, 1).lineBy(w+t.ha+t.h, -w-t.ha-t.h).lineBy(-1, 0)
      .offset(this.info.as, Side.Right).removeStart().removeEnd();
    return [bot, top];
  }
}
