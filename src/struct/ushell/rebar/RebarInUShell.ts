import { UShellCompositeRebarBuilder } from "../UShellRebar";
import { RebarInEnd } from "./end";
import { RebarInShell } from "./shell";

export class RebarInUShell extends UShellCompositeRebarBuilder {
  shell = new RebarInShell(this.struct, this.rebars, this.figures, this);
  end = new RebarInEnd(this.struct, this.rebars, this.figures, this);
}
