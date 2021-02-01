import { CompositeFigureBase } from "../Base";
import { AlongFigure } from "./Along";
import { CrossFigure } from "./Cross";
import { SBeamFigure } from "./SBeam";
import { SColFigure } from "./SCol";
import { STopFigure } from "./STop";

export class FrameSingleFigureBuilder extends CompositeFigureBase {
  init(): void {
    this.push(
      new CrossFigure(this.struct, this.rebars, this.figures),
      new AlongFigure(this.struct, this.rebars, this.figures),
      new STopFigure(this.struct, this.rebars, this.figures),
      new SColFigure(this.struct, this.rebars, this.figures),
      new SBeamFigure(this.struct, this.rebars, this.figures)
    );
  }
}
