import { Beam, BeamRebar, BeamStruct } from "./Beam";
import { BeamRebarBuilder, TopBeamRebarBuilder } from "./RebarBuilder";
import { BeamSectBuilder } from "./SectBuilder";
import { BeamViewBuilder } from "./ViewBuilder";

export { BeamStruct, BeamRebar}

export class BeamBuilder{
  protected context;
  rebarBuilder;
  sectBuilder;
  viewBuilder;
  constructor(public struct: BeamStruct, public rebars: BeamRebar){
    const context = new Beam(struct, rebars);
    this.rebarBuilder = new BeamRebarBuilder(context);
    this.sectBuilder = new BeamSectBuilder(context);
    this.viewBuilder = new BeamViewBuilder(context);
    this.context = context;
  }
  init(l: number, ln: number, n: number, as: number): void{
    this.struct.l = l;
    this.struct.ln = ln;
    this.struct.n = n;
    this.rebars.as = as;
  }
}

export class TopBeamBuilder{
  protected context;
  rebarBuilder;
  sectBuilder;
  viewBuilder;
  constructor(public struct: BeamStruct, public rebars: BeamRebar){
    const context = new Beam(struct, rebars);
    this.rebarBuilder = new TopBeamRebarBuilder(context);
    this.sectBuilder = new BeamSectBuilder(context);
    this.viewBuilder = new BeamViewBuilder(context);
    this.context = context;
  }
  init(l: number, ln: number, n: number, as: number): void{
    this.struct.l = l;
    this.struct.ln = ln;
    this.struct.n = n;
    this.rebars.as = as;
  }

}