import { CompositeRebarBase } from "../../Base";
import { Stir } from "./Stir";
import { Along } from "./Along";
import { Corner } from "./Corner";
import { Cross } from "./Cross";

export class ColumnRebar extends CompositeRebarBase {
  init(): void {
    this.push(
      new Corner(this.struct, this.rebars, this.figures),
      new Along(this.struct, this.rebars, this.figures),
      new Cross(this.struct, this.rebars, this.figures),
      new Stir(this.struct, this.rebars, this.figures)
    );
    this.setName("柱");
  }
}
