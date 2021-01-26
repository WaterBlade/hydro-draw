import { CountRebarSpec } from "@/draw";
import { CountRebar, PosGen, RebarContainer, SpaceRebar } from "@/struct/utils";

export class Beam{
  h = 0;
  w = 0;
  ha = 0;
  topHa = false;
  botHa = false;
  // not input parameter
  l = 0;
  ln = 0;
  setInfo(l: number, ln: number): this{
    this.l = l;
    this.ln = ln;
    return this;
  }
}

export class BeamRebar extends RebarContainer{
  top = new CountRebarSpec();
  bot = new CountRebarSpec();
  mid = new CountRebar({
    view: new PosGen(),
    sect: new PosGen()
  });
  stir = new SpaceRebar(new PosGen());

  // not input parameter
  as = 0;
  setInfo(as: number): this{
    this.as = as;
    return this;
  }
}