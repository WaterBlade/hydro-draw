import { CompositeRebarBase } from "../Base";
import { MainBar } from "./MainBar";
import { StirBar } from "./StirBar";

export class BarRebarBuilder extends CompositeRebarBase {
  init(): void {
    this.push(
      new MainBar(this.struct, this.specs, this.figures),
      new StirBar(this.struct, this.specs, this.figures)
    );
    this.setName("拉杆");
  }
}
