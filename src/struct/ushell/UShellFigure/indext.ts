import { FigureContainer } from "@/struct/utils";
import { UShellRebar } from "../UShellRebar";
import { UShellStruct } from "../UShellStruct";
import { CEnd } from "./CEnd";
import { CMid } from "./CMid";
import { CTrans } from "./CTrans";
import { LInner } from "./LInner";
import { LOuter } from "./LOuter";
import { SBar } from "./SBar";
import { SEndBeam } from "./SEndBeam";
import { SEndWall } from "./SEndWall";

export class UShellFigure extends FigureContainer{
  lInner = new LInner(this);
  lOuter = new LOuter(this);
  cEnd = new CEnd(this);
  cMid = new CMid(this);
  cTrans = new CTrans(this);
  sBeam = new SEndBeam(this);
  sWall = new SEndWall(this);
  sBar = new SBar(this);

  build(u: UShellStruct, rebars: UShellRebar): void{
    this.lOuter.initFigure();
    this.lInner.initFigure();
    this.cMid.initFigure();
    this.cEnd.initFigure(u);
    this.cTrans.initFigure();
    this.sBeam.initFigure(u);
    this.sWall.initFigure(u);
    this.sBar.initFigure();

    this.lOuter.build(u, rebars);
    this.lInner.build(u, rebars, this.sBeam, this.sBar);
    this.cMid.build(u, rebars);
    this.cEnd.build(u, rebars, this.sWall);
    this.cTrans.build(u, rebars);
    this.sBeam.build(u, rebars);
    this.sWall.build(u, rebars);
    this.sBar.build(u, rebars);
  }

}