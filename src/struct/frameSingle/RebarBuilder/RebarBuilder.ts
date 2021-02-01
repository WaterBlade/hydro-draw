import { CompositeRebarBase } from "../Base";
import { BeamRebar } from "./beam";
import { ColumnRebar } from "./column";
import { CorbelRebar } from "./corbel";
import { TopBeamRebar } from "./topBeam";

export class FrameSingleRebarBuilder extends CompositeRebarBase {
  init(): void {
    this.push(
      new ColumnRebar(this.struct, this.rebars, this.figures),
      new TopBeamRebar(this.struct, this.rebars, this.figures),
      new BeamRebar(this.struct, this.rebars, this.figures),
      new CorbelRebar(this.struct, this.rebars, this.figures)
    );
  }
}
