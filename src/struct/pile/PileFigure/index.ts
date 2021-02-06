import { FigureContainer } from "../../utils/Figure";
import { PileRebar } from "../PileRebar";
import { PileStruct } from "../PileStruct";
import { Ele } from "./Ele";
import { Sect } from "./Sect";

export class PileFigure extends FigureContainer{
  ele = new Ele(this);
  sect = new Sect(this);

  build(t: PileStruct, rebars: PileRebar): void{
    this.ele.initFigure();
    this.sect.initFigure();

    this.ele.build(t, rebars);
    this.sect.build(t, rebars);
  }
}