import { CompositeRebarBase } from "../Base";
import { Fix } from "./Fix";
import { Main } from "./Main";
import { Rib } from "./Rib";
import { Stir } from "./Stir";
import { StirTop } from "./StirTop";

export class PileRebarBuilder extends CompositeRebarBase{
  init(): void{
    this.push(
      new Main(this.struct, this.specs, this.figures),
      new Stir(this.struct, this.specs, this.figures),
      new StirTop(this.struct, this.specs, this.figures),
      new Rib(this.struct, this.specs, this.figures),
      new Fix(this.struct, this.specs, this.figures)
    )
  }
}