import { CompositeRebar } from "@/struct/utils";
import { UShellStruct } from "../../UShellStruct";
import { UShellRebarInfo } from "../Info";
import { EndBeamBot } from "./BeamBot";
import { EndBeamMid } from "./BeamMid";
import { EndBeamStir } from "./BeamStir";
import { EndBeamTop } from "./BeamTop";
import { EndCOuter } from "./COuter";
import { EndTopBeam } from "./TopBeam";
import { EndWallStir } from "./WallStir";

export class EndContainer extends CompositeRebar<UShellRebarInfo> {
  bBot = new EndBeamBot(this.container, this.info);
  bMid = new EndBeamMid(this.container, this.info);
  bStir = new EndBeamStir(this.container, this.info);
  bTop = new EndBeamTop(this.container, this.info);
  cOuter = new EndCOuter(this.container, this.info);
  topBeam = new EndTopBeam(this.container, this.info);
  wStir = new EndWallStir(this.container, this.info);

  build(u: UShellStruct, name: string): void {
    this.bBot.build(u, name);
    this.bTop.build(u, name);
    this.bMid.build(u, name);
    this.bStir.build(u, name);
    this.cOuter.build(u, name);
    this.topBeam.build(u, name, this.cOuter);
    this.wStir.build(u, name);
  }
}
