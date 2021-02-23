import { RebarContainer } from "@/struct/utils";
import { PlatformStruct } from "../PlatformStruct";
import { PlatformDistribute } from "./Distribute";
import { PlatformLMain } from "./LMain";
import { PlatformWMain } from "./WMain";

export class PlatformRebar extends RebarContainer{
  lMain = new PlatformLMain(this, this.info);
  wMain = new PlatformWMain(this, this.info);
  dist = new PlatformDistribute(this, this.info);

  build(t: PlatformStruct): void{
    this.lMain.build(t);
    this.wMain.build(t);
    this.dist.build(t);
  }
}