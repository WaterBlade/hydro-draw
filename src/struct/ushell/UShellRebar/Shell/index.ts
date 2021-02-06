import { CountRebar, CompositeRebar } from "@/struct/utils";
import { UShellStruct } from "../../UShellStruct";
import { UShellRebarInfo } from "../Info";
import { ShellCInner } from "./CInner";
import { ShellCOuter } from "./COuter";
import { ShellLInner } from "./LInner";
import { ShellLOuter } from "./LOuter";
import { ShellMain } from "./Main";
import { ShellTopBeam } from "./TopBeam";

export class ShellContainer extends CompositeRebar<UShellRebarInfo>{
  cInner = new ShellCInner(this.container, this.info);
  cOuter = new ShellCOuter(this.container, this.info);
  lInner = new ShellLInner(this.container, this.info);
  lOuter = new ShellLOuter(this.container, this.info);
  main = new ShellMain(this.container, this.info);
  topBeam = new ShellTopBeam(this.container, this.info);

  build(u: UShellStruct, name: string, endCOuter: CountRebar): void{
    this.cInner.build(u, name, endCOuter);
    this.cOuter.build(u, name);
    this.lInner.build(u, name);
    this.lOuter.build(u, name);
    this.main.build(u, name);
    this.topBeam.build(u, name);
  }

}