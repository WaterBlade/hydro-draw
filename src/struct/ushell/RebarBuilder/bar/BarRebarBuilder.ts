import { CompositeRebarBase } from "../Base";
import { MainBar } from "./MainBar";
import { StirBar } from "./StirBar";

export class BarRebarBuilder extends CompositeRebarBase{
  init(): void{
    this.push(
      MainBar,
      StirBar,
    )
    this.setName('拉杆');
  }
}