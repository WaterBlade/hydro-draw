import { divideBySpace, RebarFormPreset, RebarSpec } from "@/draw";
import { SpaceRebar } from "@/struct/utils";
import { PlatformStruct } from "../PlatformStruct";

export class PlatformDistribute extends SpaceRebar{
  lTop = new RebarSpec();
  lBot = new RebarSpec();
  wTop = new RebarSpec();
  wBot = new RebarSpec();
  round = new RebarSpec();

  build(t: PlatformStruct): void{
    this.buildLTop(t);
    this.buildLBot(t);
    this.buildWTop(t);
    this.buildWBot(t);
  }
  protected buildLTop(t: PlatformStruct): void{
    const as = this.info.as;

    this.lTop = this.genSpec();
    this.lTop
      .setForm(RebarFormPreset.UShape(this.diameter, t.h-t.hs-2*as, t.l-2*as))
      .setId(this.container.id)
      .setCount(this.lPos(t).length)
    this.container.record(this.lTop);
  }
  protected buildLBot(t: PlatformStruct): void{
    const as = this.info.as;

    this.lBot = this.genSpec();
    this.lBot
      .setForm(RebarFormPreset.UShape(this.diameter, 10*this.diameter, t.l-2*as))
      .setId(this.container.id)
      .setCount(this.lPos(t).length)
    this.container.record(this.lBot);
  }
  protected buildWTop(t: PlatformStruct): void{
    const as = this.info.as;

    this.wTop = this.genSpec();
    this.wTop
      .setForm(RebarFormPreset.UShape(this.diameter, t.h-t.hs-2*as, t.w-2*as))
      .setId(this.container.id)
      .setCount(this.wPos(t).length)
    this.container.record(this.wTop);
  }
  protected buildWBot(t: PlatformStruct): void{
    const as = this.info.as;

    this.wBot = this.genSpec();
    this.wBot
      .setForm(RebarFormPreset.UShape(this.diameter, 10*this.diameter, t.w-2*as))
      .setId(this.container.id)
      .setCount(this.wPos(t).length)
    this.container.record(this.wBot);
  }
  protected buildRound(t: PlatformStruct): void{
    const as = this.info.as;

    this.round = this.genSpec();
    this.round
      .setForm(RebarFormPreset.Rect(this.diameter, t.w-2*as, t.l - 2*as))
      .setId(this.container.id)
      .setCount(this.hPos(t).length)
    this.container.record(this.round);
  }
  hPos(t: PlatformStruct): number[]{
    const as = this.info.as;
    return divideBySpace(-t.h/2+t.hs+as, t.h/2-as, this.space).slice(1, -1);
  }
  lPos(t: PlatformStruct): number[]{
    const as = this.info.as;
    return divideBySpace(-t.l/2+as, t.l/2-as, this.space);
  }
  wPos(t: PlatformStruct): number[]{
    const as = this.info.as;
    return divideBySpace(-t.w/2+as, t.w/2-as, this.space);
  }

}