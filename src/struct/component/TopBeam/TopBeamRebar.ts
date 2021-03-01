import { divideByCount, divideBySpace, Polyline, RebarFormPreset, RebarPathForm, RebarSpec, Side, vec, Vector } from "@/draw";
import { getSafe } from "@/misc";
import { CompositeRebar, CountRebar, SpaceRebar } from "@/struct/utils";
import { TopBeamStruct } from "./TopBeamStruct";

export class TopBeamRebar extends CompositeRebar {
  bot = new BeamBot(this.container, this.info);
  top = new BeamTop(this.container, this.info);
  mid = new BeamMid(this.container, this.info);
  stir = new Stir(this.container, this.info);

  tendon = new Tendon(this.container, this.info);

  build(t: TopBeamStruct, name: string): void {
    this.bot.build(t, name);
    this.top.build(t, name);
    this.mid.build(t, name);
    this.stir.build(t, name);
    this.tendon.build(t, this.mid, name);
  }
}

class BeamBot extends CountRebar {
  spec = new RebarSpec();
  build(t: TopBeamStruct, name: string): void {
    this.spec = this.genSpec();
    const as = this.info.as;
    const form = RebarFormPreset.Line(this.diameter, t.l - 2 * as);
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
  build(t: TopBeamStruct, name: string): void {
    this.spec = this.genSpec();
    const as = this.info.as;
    const form = RebarFormPreset.Line(this.diameter, t.l - 2 * as);
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
  build(t: TopBeamStruct, name: string): void {
    this.spec = this.genSpec();
    const as = this.info.as;
    const form = RebarFormPreset.Line(this.diameter, t.l - 2 * as);
    const count = this.singleCount * t.n * 2;
    this.spec
      .setCount(count)
      .setForm(form)
      .setId(this.container.id)
      .setName(name);
    this.container.record(this.spec);
  }
  pos(t: TopBeamStruct, r = 0): Vector[]{
    const pl = new Polyline(-t.w/2, t.h/2).lineBy(0, -t.hd).lineBy(t.ws, -t.hs).offset(this.info.as + r);
    const ys = divideByCount(-t.h/2, t.h/2, this.singleCount + 1).slice(1, -1);
    return ys.map( y => getSafe(0, pl.rayIntersect(vec(0, y), vec(1,0))));
  }
}

class Stir extends SpaceRebar {
  spec = new RebarSpec();
  build(t: TopBeamStruct, name: string): void {
    this.spec = this.genSpec();
    const lens = this.shape(t).segments.map(s => s.calcLength());
    let i = 0;
    const form = new RebarPathForm(this.diameter)
      .lineBy(5, 0).dimLength(lens[i++])
      .lineBy(0, -1.5).dimLength(lens[i++])
      .lineBy(-1.5, -1.5).dimLength(lens[i++])
      .lineBy(-2, 0).dimLength(lens[i++])
      .lineBy(-1.5, 1.5).dimLength(lens[i++])
      .lineBy(0, 1.5).dimLength(lens[i++]);
    const count = this.pos(t).length * t.n;
    this.spec
      .setCount(count)
      .setForm(form)
      .setId(this.container.id)
      .setName(name);
    this.container.record(this.spec);
  }
  pos(t: TopBeamStruct): number[]{
    return divideBySpace(-t.l / 2 + this.info.as, t.l / 2 - this.info.as, this.space);
  }
  shape(t: TopBeamStruct): Polyline{
    return new Polyline(-t.w / 2, t.h / 2)
      .lineBy(t.w, 0)
      .lineBy(0, -t.hd)
      .lineBy(-t.ws, -t.hs)
      .lineBy(-t.wb, 0)
      .lineBy(-t.ws, t.hs)
      .close()
      .offset(this.info.as, Side.Right)
  }
}

export class Tendon extends SpaceRebar {
  spec = new RebarSpec();
  build(t: TopBeamStruct, midBar: BeamMid, name: string): void {
    this.spec = this.genSpec();

    const pts = midBar.pos(t);
    const lens = pts.map(p => Math.abs(p.x)*2);
    const count = pts.length
    this.spec
      .setGrade("HPB300")
      .setDiameter(8)
      .setForm(RebarFormPreset.HookLine(this.diameter, lens, 4))
      .setCount(Math.floor(t.l / this.space) * t.n * count)
      .setId(this.container.id)
      .setName(name);
    this.container.record(this.spec);
  }
}
