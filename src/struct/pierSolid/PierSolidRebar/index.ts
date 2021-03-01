import { RebarContainer } from "@/struct/utils";
import { PierSolidStruct } from "../PierSolidStruct";
import { LMain } from "./LMain";
import { Stir } from "./Stir";
import { WMain } from "./WMain";

export class PierSolidRebar extends RebarContainer{
  lMain = new LMain(this, this.info);
  wMain = new WMain(this, this.info);
  stir = new Stir(this, this.info);

  build(t: PierSolidStruct): void{
    this.lMain.build(t);
    this.wMain.build(t);
    this.stir.build(t);
  }
}