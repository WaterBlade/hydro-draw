import { CountRebarSpec, SpaceRebarSpec } from "@/draw";
import { RebarContainer } from "../../utils";

export class PileRebar extends RebarContainer {
  main = new CountRebarSpec();
  stir = new SpaceRebarSpec();
  topStir = new SpaceRebarSpec();
  fix = new SpaceRebarSpec();
  rib = new SpaceRebarSpec();
  as = 60;
  anchorFactor = 40;
  denseFactor = 5;
  fixCount = 4;
}
