import { UShellCompositeRebarBuilder } from "../../UShellRebar";
import { MainBar } from "./MainBar";
import { StirBar } from "./StirBar";

export class RebarInBar extends UShellCompositeRebarBuilder{
  init(): void{
    this.push(
      new MainBar(this.struct, this.rebars, this.figures),
      new StirBar(this.struct, this.rebars, this.figures),
    )
    this.setName('拉杆');
  }
}