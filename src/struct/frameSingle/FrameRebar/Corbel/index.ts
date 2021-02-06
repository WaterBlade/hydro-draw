import { CompositeRebar } from "@/struct/utils";
import { FrameStruct } from "../../FrameStruct";
import { CorbelHStir } from "./HStir";
import { CorbelMain } from "./Main";
import { CorbelVStir } from "./VStir";

export class FrameCorbel extends CompositeRebar{
  main = new CorbelMain(this.container, this.info);
  hStir = new CorbelHStir(this.container, this.info);
  vStir = new CorbelVStir(this.container, this.info);
  build(t: FrameStruct, name: string): void{
    this.main.build(t, name);
    this.hStir.build(t, name);
    this.vStir.build(t, name);
  }
}