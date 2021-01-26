import { Pile, PileFigure, PileRebar } from "../Basic";
import { Ele } from "./Ele";
import { Sect } from "./Sect";

export class PileFigureBuilder{
  ele = new Ele(this.struct, this.specs, this.figures);
  sect = new Sect(this.struct, this.specs, this.figures);
  constructor(
    protected struct: Pile,
    protected specs: PileRebar,
    protected figures: PileFigure
  ){}
  initFigure(): void{
    this.ele.initFigure();
    this.sect.initFigure();
  }
  build(): void{
    this.ele.build();
    this.sect.build();
  }
  
}