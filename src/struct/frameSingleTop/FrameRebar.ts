import { BeamRebar, ColumnRebar, TopBeamRebar } from "@/struct/component";
import { RebarRoot } from "@/struct/utils";
import { FrameSingleStruct } from "./FrameStruct";

export class FrameSingleRebar extends RebarRoot {
  col = this.add(new ColumnRebar(this.struct.col, this, "柱"));
  topBeam = this.add(new TopBeamRebar(this.struct.topBeam, this, "盖梁"));
  beam = this.add(new BeamRebar(this.struct.beam, this, "横梁"));

  constructor(protected struct: FrameSingleStruct) {
    super();
  }
}
