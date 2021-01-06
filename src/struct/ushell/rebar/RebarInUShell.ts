import { UShellCompositeRebarBuilder } from "../UShellRebar";
import { RebarInBar } from "./bar";
import { RebarInEnd } from "./end";
import { RebarInShell } from "./shell";

export class RebarInUShell extends UShellCompositeRebarBuilder {
  init(): void{
    this.push(
      new RebarInShell(this.struct, this.rebars, this.figures),
      new RebarInEnd(this.struct, this.rebars, this.figures),
      new RebarInBar(this.struct, this.rebars, this.figures),
    );
    this.setIdGen(this.idGen);
  }
}
