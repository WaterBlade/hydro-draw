import { UShellContext } from "../UShell";
import { RebarBar } from "./RebarBar";
import { RebarEnd } from "./RebarEnd";
import { RebarShell } from "./RebarShell";
import { RebarTrans } from "./RebarTrans";

export class UShellRebarBuilder extends UShellContext {
  bar = new RebarBar(this.context);
  end = new RebarEnd(this.context);
  shell = new RebarShell(this.context);
  trans = new RebarTrans(this.context);

  build(): void {
    this.shell.build();
    this.end.build();
    this.trans.build();
    this.bar.build();
  }
}
