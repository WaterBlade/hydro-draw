import { BarRebarBuilder } from "./bar";
import { CompositeRebarBase } from "./Base";
import { EndRebarBuilder } from "./end";
import { ShellRebarBuilder } from "./shell";
import { TransBarBuilder } from "./trans";

export class UShellRebarBuilder extends CompositeRebarBase {
  init(): void{
    this.push(
      ShellRebarBuilder,
      EndRebarBuilder,
      TransBarBuilder,
      BarRebarBuilder,
    );
    this.setIdGen(this.idGen);
  }
}
