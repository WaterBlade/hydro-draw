import { PileFigureContext } from "../Pile";
import { Ele } from "./Ele";
import { Sect } from "./Sect";

export class PileFigureBuilder extends PileFigureContext{
  ele = new Ele(this.context, this.figures);
  sect = new Sect(this.context, this.figures);
  build(): void {
    this.ele.initFigure();
    this.sect.initFigure();

    this.ele.build();
    this.sect.build();
  }
}
