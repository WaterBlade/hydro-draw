import { UShellRebar } from "../UShellRebar";
import { UShellStruct } from "../UShellStruct";
import { PosBar } from "./PosBar";
import { PosShell } from "./PosShell";

export class UShellRebarPos {
  shell = new PosShell(this.struct, this.rebars);
  bar = new PosBar(this.struct, this.rebars);
  constructor(protected struct: UShellStruct, protected rebars: UShellRebar) {}
}
