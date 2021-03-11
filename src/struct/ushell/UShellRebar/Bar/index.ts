import { UShellCompositeRebar } from "../UShellRebar";
import { BarMain } from "./Main";
import { BarStir } from "./Stir";

export class UShellBarRebar extends UShellCompositeRebar {
  main = this.add(new BarMain(this.struct, this.rebars));
  stir = this.add(new BarStir(this.struct, this.rebars));
}
