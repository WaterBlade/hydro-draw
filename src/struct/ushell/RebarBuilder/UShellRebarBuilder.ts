import { BarRebarBuilder } from "./bar";
import { CompositeRebarBase } from "./Base";
import { EndRebarBuilder } from "./end";
import { ShellRebarBuilder } from "./shell";
import { TransBarBuilder } from "./trans";

export class UShellRebarBuilder extends CompositeRebarBase {
  init(): void {
    this.push(
      new ShellRebarBuilder(this.struct, this.specs, this.figures),
      new EndRebarBuilder(this.struct, this.specs, this.figures),
      new TransBarBuilder(this.struct, this.specs, this.figures),
      new BarRebarBuilder(this.struct, this.specs, this.figures)
    );
  }
}
