import { CompositeRebarBase } from "../../Base";
import { HStir } from "./HStir";
import { Main } from "./Main";
import { VStir } from "./VStir";

export class CorbelRebar extends CompositeRebarBase{
  init(): void{
    this.push(
      new Main(this.struct, this.specs, this.figures),
      new HStir(this.struct, this.specs, this.figures),
      new VStir(this.struct, this.specs, this.figures)
    );
    this.setName('牛腿');
  }
}