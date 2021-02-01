import { UShellFigureContext } from "../UShell";
import { CEnd } from "./CEnd";
import { CMid } from "./CMid";
import { CTrans } from "./CTrans";
import { LInner } from "./LInner";
import { LOuter } from "./LOuter";
import { SBar } from "./SBar";
import { SEndBeam } from "./SEndBeam";
import { SEndWall } from "./SEndWall";

export class UShellFigureBuilder extends UShellFigureContext {
  lInner = new LInner(this.context, this.figures);
  lOuter = new LOuter(this.context, this.figures);
  sEndBeam = new SEndBeam(this.context, this.figures);
  sEndWall = new SEndWall(this.context, this.figures);
  cEnd = new CEnd(this.context, this.figures);
  cMid = new CMid(this.context, this.figures);
  cTrans = new CTrans(this.context, this.figures);
  SBar = new SBar(this.context, this.figures);

  build(): void {
    this.lOuter.initFigure();
    this.lInner.initFigure();
    this.cMid.initFigure();
    this.cEnd.initFigure();
    this.cTrans.initFigure();
    this.sEndBeam.initFigure();
    this.sEndWall.initFigure();
    this.SBar.initFigure();

    this.lOuter.build();
    this.lInner.build();
    this.cMid.build();
    this.cEnd.build();
    this.cTrans.build();
    this.sEndBeam.build();
    this.sEndWall.build();
    this.SBar.build();
  }
}
