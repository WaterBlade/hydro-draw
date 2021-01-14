import { CompositeRebarBase } from "../Base";
import { ArcBar } from "./ArcBar";
import { DirectBar } from "./DirectBar";

export class TransBarBuilder extends CompositeRebarBase {
  init(): void {
    this.push(
      new DirectBar(this.struct, this.specs, this.figures),
      new ArcBar(this.struct, this.specs, this.figures)
    );
    this.setName("渐变段");
  }
}
