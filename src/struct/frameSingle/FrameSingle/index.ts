import { BeamBuilder, ColumnBuilder, TopBeamBuilder } from "@/struct/component";
import { FrameSingleRebar } from "./FrameRebar";
import { FrameSingleStruct } from "./FrameStruct";

export class FrameSingle{
  beam;
  topBeam;
  column;
  constructor(public struct: FrameSingleStruct, public rebars: FrameSingleRebar){
    this.beam = new BeamBuilder(struct.beam, rebars.beam);
    this.topBeam = new TopBeamBuilder(struct.topBeam, rebars.topBeam);
    this.column = new ColumnBuilder(struct.col, rebars.column);
  }
  init(): void{
    const t = this.struct;
    const rebar = this.rebars;
    // beam init
    this.beam.init(t.w, t.hs-t.col.w, t.n-1, rebar.as);
    // topbeam init
    this.topBeam.init(t.w, t.hs-t.col.w, 1, rebar.as);
    // col init
    this.column.init(t.h, t.found.hn, 2, t.vs, t.topBeam.h, t.beam.h, rebar.as);
  }
}

export class FrameSingleContext{
  struct;
  rebars;
  beam;
  topBeam;
  column;
  constructor(protected context: FrameSingle){
    this.struct = context.struct;
    this.rebars = context.rebars;
    this.beam = context.beam;
    this.topBeam = context.topBeam;
    this.column = context.column;
  }
}