import { UShellCompositeRebar } from "../UShellRebar";
import { ShellCInner, ShellCInnerSub } from "./CInner";
import { ShellCOuter } from "./COuter";
import { ShellLInner } from "./LInner";
import { ShellLOuter } from "./LOuter";
import { ShellMain } from "./Main";
import { ShellTopBeam } from "./TopBeam";

export class UShellShellRebar extends UShellCompositeRebar {
  cInner = this.add(new ShellCInner(this.struct, this.rebars));
  cInnerSub = this.add(new ShellCInnerSub(this.struct, this.rebars));
  cOuter = this.add(new ShellCOuter(this.struct, this.rebars));
  lInner = this.add(new ShellLInner(this.struct, this.rebars));
  lOuter = this.add(new ShellLOuter(this.struct, this.rebars));
  main = this.add(new ShellMain(this.struct, this.rebars));
  topBeam = this.add(new ShellTopBeam(this.struct, this.rebars));
}
