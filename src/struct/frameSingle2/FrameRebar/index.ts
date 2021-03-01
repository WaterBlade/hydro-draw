import { BeamRebar, ColumnRebar } from "@/struct/component";
import { TopBeamRebar } from "@/struct/component/TopBeam";
import { RebarContainer } from "@/struct/utils";
import { FrameSingleStruct } from "../FrameStruct";

export class FrameSingleRebar extends RebarContainer {
  col = new ColumnRebar(this, this.info);
  topBeam = new TopBeamRebar(this, this.info);
  beam = new BeamRebar(this, this.info);

  build(t: FrameSingleStruct): void {
    t.initComponent();
    this.col.build(t.col, "柱");
    this.topBeam.build(t.topBeam, "盖梁");
    if(t.n > 0){
      this.beam.build(t.beam, "横梁");
    }
  }
}
