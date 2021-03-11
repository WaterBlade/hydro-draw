import { BeamRebar, ColumnRebar } from "@/struct/component";
import { RebarRoot } from "@/struct/utils";
import { FrameDoubleStruct } from "./FrameStruct";

export class FrameDoubleRebar extends RebarRoot {
  col = this.add(new ColumnRebar(this.struct.col, this, "柱"));
  topCross = this.add(new BeamRebar(this.struct.topCross, this, "顶梁1"));
  topAlong = this.add(new BeamRebar(this.struct.topAlong, this, "顶梁2"));
  beamCross = this.add(new BeamRebar(this.struct.beamCross, this, "横梁1"));
  beamAlong = this.add(new BeamRebar(this.struct.beamAlong, this, "横梁2"));

  constructor(protected struct: FrameDoubleStruct) {
    super();
  }
}
