import { CompositeRebarBase } from "../../Base";
import { HStir } from "./HStir";
import { Main } from "./Main";
import { VStir } from "./VStir";

export class CorbelRebar extends CompositeRebarBase {
  init(): void {
    this.push(
      new Main(this.struct, this.rebars, this.figures),
      new HStir(this.struct, this.rebars, this.figures),
      new VStir(this.struct, this.rebars, this.figures)
    );
    this.setName("牛腿");
  }
}
