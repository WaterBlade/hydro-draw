import { CountRebarSpec, RebarSpec, SpaceRebarSpec } from "@/draw";
import { RebarContainer } from "@/struct/utils";

export class Beam{
  constructor(public struct: BeamStruct, public rebars: BeamRebar){}
}

export class BeamContext{
  protected struct;
  protected rebars;
  constructor(protected context: Beam){
    this.struct = context.struct;
    this.rebars = context.rebars;
  }
}

export class BeamStruct {
  h = 0;
  w = 0;
  ha = 0;
  topHa = false;
  botHa = false;

  l = 0;
  ln = 0;
  n = 0;
}

export class BeamRebar extends RebarContainer {
  top = new CountRebarSpec();
  bot = new CountRebarSpec();
  mid = new CountRebarSpec();
  stir = new SpaceRebarSpec();
  // not init
  tendon = new RebarSpec();
  as = 0;
}
