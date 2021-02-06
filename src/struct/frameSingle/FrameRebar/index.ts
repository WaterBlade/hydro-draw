import { BeamRebar, ColumnRebar } from "@/struct/component";
import { RebarContainer } from "@/struct/utils";
import { FrameStruct } from "../FrameStruct";
import { FrameCorbel } from "./Corbel";

export class FrameRebar extends RebarContainer{
  col = new ColumnRebar(this, this.info);
  topBeam = new BeamRebar(this, this.info);
  beam = new BeamRebar(this, this.info);
  corbel = new FrameCorbel(this, this.info);

  build(t: FrameStruct): void{
    t.initComponent();
    this.col.build(t.col, '柱');
    this.topBeam.build(t.topBeam, '顶梁');
    this.beam.build(t.beam, '横梁');
    this.corbel.build(t, '牛腿');
  }

}