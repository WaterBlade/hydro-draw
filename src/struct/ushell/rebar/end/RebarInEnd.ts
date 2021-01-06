import { UShellCompositeRebarBuilder } from "../../UShellRebar";
import { BeamBotBar } from "./BeamBotBar";
import { BeamMidBar } from "./BeamMidBar";
import { BeamStirBar } from "./BeamStirBar";
import { BeamTopBar } from "./BeamTopBar";
import { COuterBar } from "./COuterBar";
import { TopBeamBar } from "./TopBeamBar";
import { WallStirBar } from "./WallStirBar";

export class RebarInEnd extends UShellCompositeRebarBuilder {
  init(): void{
    this.push(
      new COuterBar(this.struct, this.rebars, this.figures),
      new BeamBotBar(this.struct, this.rebars, this.figures),
      new BeamTopBar(this.struct, this.rebars, this.figures),
      new BeamMidBar(this.struct, this.rebars, this.figures),
      new BeamStirBar(this.struct, this.rebars, this.figures),
      new WallStirBar(this.struct, this.rebars, this.figures),
      new TopBeamBar(this.struct, this.rebars, this.figures),
    )
    this.setName('端肋');
  }
}
