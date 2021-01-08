import { CompositeRebarBase } from "../Base";
import { ArcBar } from "./ArcBar";
import { DirectBar } from "./DirectBar";

export class TransBarBuilder extends CompositeRebarBase{
  init(): void{
    this.push(
      DirectBar,
      ArcBar
    );
    this.setName('渐变段');
  }
}