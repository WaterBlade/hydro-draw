import { CompositeRebarBase } from "../../Base";
import { Bottom } from "./Bottom";
import { Mid } from "./Mid";
import { Stir } from "./Stir";
import { Top } from "./Top";

export class TopBeamRebar extends CompositeRebarBase{
  init(): void{
    this.push(
      new Bottom(this.struct, this.specs, this.figures),
      new Top(this.struct, this.specs, this.figures),
      new Mid(this.struct, this.specs, this.figures),
      new Stir(this.struct, this.specs, this.figures)
    );
    this.setName('顶梁');
  }
}