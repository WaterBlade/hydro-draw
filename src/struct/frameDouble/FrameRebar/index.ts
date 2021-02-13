import { BeamRebar, ColumnRebar } from "@/struct/component";
import { RebarContainer } from "@/struct/utils";
import { FrameDoubleStruct } from "../FrameStruct";

export class FrameDoubleRebar extends RebarContainer {
  col = new ColumnRebar(this, this.info);
  topCross = new BeamRebar(this, this.info);
  topAlong = new BeamRebar(this, this.info);
  beamCross = new BeamRebar(this, this.info);
  beamAlong = new BeamRebar(this, this.info);

  build(t: FrameDoubleStruct): void {
    t.initComponent();
    this.col.build(t.col, "柱");
    this.topCross.build(t.topCross, "顶梁1");
    this.topAlong.build(t.topAlong, "顶梁2");
    this.beamCross.build(t.beamCross, "横梁1");
    this.beamAlong.build(t.beamAlong, "横梁2");
  }
}
