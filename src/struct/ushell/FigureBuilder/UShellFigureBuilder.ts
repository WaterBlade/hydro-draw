import { CompositeFigureBase } from "./Base";
import { CEnd } from "./CEnd";
import { CMid } from "./CMid";
import { CTrans } from "./CTrans";
import { LInner } from "./LInner";
import { LOuter } from "./LOuter";
import { SBar } from "./SBar";
import { SEndBeam } from "./SEndBeam";
import { SEndWall } from "./SEndWall";

export class UShellFigureBuilder extends CompositeFigureBase{
  init(): void{
    this.push(
      LOuter,
      LInner,
      CMid,
      CEnd,
      CTrans,
      SEndBeam,
      SEndWall,
      SBar
    );
  }
}