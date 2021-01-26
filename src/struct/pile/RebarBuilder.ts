import { RebarFormPreset, RebarPathForm, Side } from "@/draw";
import { Pile, PileRebar, PileRebarPos, PileRebarShape } from "./Basic";

export class PileRebarBuilder{
  constructor(protected struct: Pile, protected rebars: PileRebar){}
  build(): void{
    this.buildMain();
    this.buildStir();
    this.buildStirTop();
    this.buildRib();
    this.buildFix();
  }
  protected buildMain(): void{
    const bar = this.rebars.main;
    const as = this.rebars.as;
    const t = this.struct;
    bar
      .setId(this.rebars.id.gen())
      .setCount(bar.singleCount * t.count)
      .setForm(
        new RebarPathForm(bar.diameter)
          .lineBy(1.5, 0.8).dimLength(bar.diameter * this.rebars.anchorFactor, Side.Right)
          .guideLineBy(-1, 0).dimAngle(t.topAngle)
          .lineBy(4, 0).dimLength(t.h - as + t.hs-1000)
          .guideLineBy(1, 0)
          .lineBy(1.5, 0.8).dimLength(1000).dimAngle(t.botAngle)
          .text('桩顶', Side.Left, true)
          .text('桩底', Side.Right, true)
      )
    this.rebars.record(bar);
  }
  protected buildStir(): void{
    const bar = this.rebars.stir;
    const t = this.struct;
    const as = this.rebars.as;
    const peri = Math.PI * (t.d - 2*as);
    const n = PileRebarPos.stir(this.struct, this.rebars).length;
    const length =  Math.sqrt( (n*peri)**2 + (t.hs + t.h)**2);
    bar
      .setId(this.rebars.id.gen())
      .setCount(t.count)
      .setForm(
        new RebarPathForm(bar.diameter)
          .lineBy(0.25, 1.6).lineBy(0.25, -1.6)
          .lineBy(0.25, 1.6).lineBy(0.25, -1.6)
          .lineBy(0.25, 1.6).lineBy(0.25, -1.6)
          .lineBy(0.25, 1.6).lineBy(0.25, -1.6)
          .lineBy(0.25, 1.6).lineBy(0.25, -1.6)
          .text(`D=${t.d - 2*as}`, Side.Right).setLength(length)
      );
    this.rebars.record(bar);
  }
  protected buildStirTop(): void{
    const bar = this.rebars.topStir;
    const t = this.struct;
    const lines = PileRebarShape.stirTop(this.struct, this.rebars);
    bar
      .setId(this.rebars.id.gen())
      .setCount(lines.length * t.count)
      .setForm(
        RebarFormPreset.Circle(bar.diameter, lines.map(l=> l.calcLength()))
      );
    this.rebars.record(bar);
  }
  protected buildRib(): void{
    const bar = this.rebars.rib;
    const mainBar = this.rebars.main;
    const as = this.rebars.as;
    const t = this.struct;
    const ys = PileRebarPos.rib(this.struct, this.rebars);
    bar
      .setId(this.rebars.id.gen())
      .setCount(ys.length * t.count)
      .setForm(
        RebarFormPreset.Circle(bar.diameter, t.d-2*as-2*mainBar.diameter)
      )
    this.rebars.record(bar);
  }
  protected buildFix(): void{
    const bar = this.rebars.fix;
    const fixCount = this.rebars.fixCount;
    const as = this.rebars.as;
    const t = this.struct;
    const ys = PileRebarPos.fix(this.struct, this.rebars);
    const len = 1.414*as;
    bar
      .setId(this.rebars.id.gen())
      .setCount(ys.length * t.count * fixCount)
      .setForm(
        new RebarPathForm(bar.diameter)
          .lineBy(1, 0).dimLength(100)
          .lineBy(1, 1).dimLength(len).dimVector(as, as, Side.Right)
          .lineBy(1, 0).dimLength(150)
          .lineBy(1, -1).dimLength(len)
          .lineBy(1, 0).dimLength(100)
      );
    this.rebars.record(bar);
  }
}