import { item } from "@/struct/RebarBuilder";
import { UShellCompositeRebarBuilder } from "../../../UShellRebar";
import { BeamBotBar } from "./BeamBotBar";
import { BeamMidBar } from "./BeamMidBar";
import { BeamStirBar } from "./BeamStirBar";
import { BeamTopBar } from "./BeamTopBar";
import { COuterBar } from "./COuterBar";
import { TopBeamBar } from "./TopBeamBar";
import { WallStirBar } from "./WallStirBar";

export class RebarInEnd extends UShellCompositeRebarBuilder {
  name = '端肋';
  cOuter = item(COuterBar, this);
  bBot = item(BeamBotBar, this);
  bTop = item(BeamTopBar, this);
  bMid = item(BeamMidBar, this);
  bStir = item(BeamStirBar, this);
  wStir = item(WallStirBar, this);
  topBeam = item(TopBeamBar, this);
}
