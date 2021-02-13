import { CompositeRebar } from "@/struct/utils";
import { UShellStruct } from "../../UShellStruct";
import { UShellRebarInfo } from "../Info";
import { BarMain } from "./Main";
import { BarStir } from "./Stir";

export class BarContainer extends CompositeRebar<UShellRebarInfo> {
  main = new BarMain(this.container, this.info);
  stir = new BarStir(this.container, this.info);

  build(u: UShellStruct, name: string): void {
    this.main.build(u, name);
    this.stir.build(u, name);
  }
}
