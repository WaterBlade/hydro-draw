import { SpaceRebarSpec } from "@/draw";
import { CountRebar, PosGen, RebarContainer } from "../utils";

export class PileRebar extends RebarContainer{
  main = new CountRebar({
    ele: new PosGen(),
    sect: new PosGen()
  });
  stir = new SpaceRebarSpec();
  topStir = new SpaceRebarSpec();
  fix = new SpaceRebarSpec();
  rib = new SpaceRebarSpec();
  as = 60;
  anchorFactor = 40;
  denseFactor = 5;
}