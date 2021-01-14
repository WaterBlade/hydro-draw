import { CompositeRebarBase } from "../Base";
import { BeamBotBar } from "./BeamBotBar";
import { BeamMidBar } from "./BeamMidBar";
import { BeamStirBar } from "./BeamStirBar";
import { BeamStirCantBar } from "./BeamStirCantBar";
import { BeamTopBar } from "./BeamTopBar";
import { COuterBar } from "./COuterBar";
import { TopBeamBar } from "./TopBeamBar";
import { TopBeamCantBar } from "./TopBeamCantBar";
import { WallStirBar } from "./WallStirBar";
import { WallStirCantBar } from "./WallStirCantBar";

export class EndRebarBuilder extends CompositeRebarBase {
  init(): void {
    this.push(
      new COuterBar(this.struct, this.specs, this.figures),
      new BeamBotBar(this.struct, this.specs, this.figures),
      new BeamTopBar(this.struct, this.specs, this.figures),
      new BeamMidBar(this.struct, this.specs, this.figures),
      new BeamStirBar(this.struct, this.specs, this.figures),
      new BeamStirCantBar(this.struct, this.specs, this.figures),
      new WallStirBar(this.struct, this.specs, this.figures),
      new WallStirCantBar(this.struct, this.specs, this.figures),
      new TopBeamBar(this.struct, this.specs, this.figures),
      new TopBeamCantBar(this.struct, this.specs, this.figures)
    );
    this.setName("端肋");
  }
}
