import { CountRebarSpec, SpaceRebarSpec } from "@/draw";
import { BeamRebar, ColumnRebar } from "@/struct/component";
import { RebarContainer } from "@/struct/utils";

export class FrameSingleRebar extends RebarContainer {
  column = new ColumnRebar();
  beam = new BeamRebar();
  topBeam = new BeamRebar();
  corbel = new Corbel();
  as = 0;
}


class Corbel {
  main = new CountRebarSpec();
  vStir = new SpaceRebarSpec();
  hStir = new SpaceRebarSpec();
}
