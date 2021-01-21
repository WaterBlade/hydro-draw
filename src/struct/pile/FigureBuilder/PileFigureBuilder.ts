import { CompositeFigureBase } from "../Base";
import { Ele } from "./Ele";
import { Sect } from "./Sect";

export class PileFigureBuilder extends CompositeFigureBase{
  init(): void{
    this.push(
      new Ele(this.struct, this.specs, this.figures),
      new Sect(this.struct, this.specs, this.figures),
    );
  }
}