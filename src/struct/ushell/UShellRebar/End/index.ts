import { UShellCompositeRebar } from "../UShellRebar";
import { EndBeamBot } from "./BeamBot";
import { EndBeamMid } from "./BeamMid";
import { EndBeamStir, EndBeamStirCant } from "./BeamStir";
import { EndBeamTop } from "./BeamTop";
import { EndCOuter } from "./COuter";
import { EndTopBeam, EndTopBeamCant } from "./TopBeam";
import { EndWallStir, EndWallStirCant } from "./WallStir";

export class UShellEndRebar extends UShellCompositeRebar {
  bBot = this.add(new EndBeamBot(this.struct, this.rebars));
  bMid = this.add(new EndBeamMid(this.struct, this.rebars));
  bStir = this.add(new EndBeamStir(this.struct, this.rebars));
  bStirCant = this.add(new EndBeamStirCant(this.struct, this.rebars));
  bTop = this.add(new EndBeamTop(this.struct, this.rebars));
  cOuter = this.add(new EndCOuter(this.struct, this.rebars));
  topBeam = this.add(new EndTopBeam(this.struct, this.rebars));
  topBeamCant = this.add(new EndTopBeamCant(this.struct, this.rebars));
  wStir = this.add(new EndWallStir(this.struct, this.rebars));
  wStirCant = this.add(new EndWallStirCant(this.struct, this.rebars));
}
