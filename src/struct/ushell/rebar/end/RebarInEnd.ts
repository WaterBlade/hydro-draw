import { UShellCompositeRebarBuilder } from "../../UShellRebar";
import { BeamBotBar } from "./BeamBotBar";
import { BeamMidBar } from "./BeamMidBar";
import { BeamStirBar } from "./BeamStirBar";
import { BeamTopBar } from "./BeamTopBar";
import { CInnerBar } from "./CInnerBar";
import { COuterBar } from "./COuterBar";
import { WallStirBar } from "./WallStirBar";

export class RebarInEnd extends UShellCompositeRebarBuilder {
  protected name = "端肋";
  cOuter = new COuterBar(this.struct, this.rebars, this.figures, this);
  cInner = new CInnerBar(this.struct, this.rebars, this.figures, this);
  bBot = new BeamBotBar(this.struct, this.rebars, this.figures, this);
  bTop = new BeamTopBar(this.struct, this.rebars, this.figures, this);
  bMid = new BeamMidBar(this.struct, this.rebars, this.figures, this);
  bStir = new BeamStirBar(this.struct, this.rebars, this.figures, this);
  wStir = new WallStirBar(this.struct, this.rebars, this.figures, this);
}
