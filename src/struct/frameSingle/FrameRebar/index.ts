import { BeamRebar, ColumnRebar } from "@/struct/component";
import { RebarContainer } from "@/struct/utils";
import { FrameSingleStruct } from "../FrameStruct";
import { FrameCorbel } from "./Corbel";

export class FrameSingleRebar extends RebarContainer {
  col = new ColumnRebar(this, this.info);
  topBeam = new BeamRebar(this, this.info);
  beam = new BeamRebar(this, this.info);
  corbel = new FrameCorbel(this, this.info);

  build(t: FrameSingleStruct): void {
    t.initComponent();
    this.col.build(t.col, "柱");
    this.topBeam.build(t.topBeam, "顶梁");
    this.beam.build(t.beam, "横梁");
    this.corbel.build(t, "牛腿");
  }
}
