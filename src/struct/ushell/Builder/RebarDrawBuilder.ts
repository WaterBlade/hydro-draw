import { UShell } from "../UShell";
import { UShellFigure } from "../UShellFigure";
import { RebarInUShell } from "./RebarBuilder";

export class RebarDrawBuilder{
  constructor(public struct: UShell, public rebars: RebarInUShell, public figures: UShellFigure){}
  build(): void{
    this.drawLOuter();
    this.drawLInner();
    this.drawCMid();
    this.drawCEnd();
    this.drawSEndBeam();
    this.drawSEndWall();
    this.drawSBar();
  }
  protected drawLOuter(): void{
    this.figures.lOuter.drawRebar();
  }
  protected drawLInner(): void{
    this.figures.lInner.drawRebar();
  }
  protected drawCMid(): void{
    this.figures.cMid.drawRebar();
  }
  protected drawCEnd(): void{
    this.figures.cEnd.drawRebar();
  }
  protected drawSEndBeam(): void{
    this.figures.sEndBeam.drawRebar();
  }
  protected drawSEndWall(): void{
    this.figures.sEndWall.drawRebar();
  }
  protected drawSBar(): void{
    this.figures.sBar.drawRebar();
  }
}