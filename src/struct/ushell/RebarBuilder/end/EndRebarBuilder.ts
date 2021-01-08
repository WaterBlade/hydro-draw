import { CompositeRebarBase } from "../Base";
import { BeamBotBar } from "./BeamBotBar";
import { BeamMidBar } from "./BeamMidBar";
import { BeamStirBar } from "./BeamStirBar";
import { BeamTopBar } from "./BeamTopBar";
import { COuterBar } from "./COuterBar";
import { TopBeamBar } from "./TopBeamBar";
import { WallStirBar } from "./WallStirBar";

export class EndRebarBuilder extends CompositeRebarBase {
  init(): void{
    this.push(
      COuterBar,
      BeamBotBar,
      BeamTopBar,
      BeamMidBar,
      BeamStirBar,
      WallStirBar,
      TopBeamBar,
    )
    this.setName('端肋');
  }
}
