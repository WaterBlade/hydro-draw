import { CompositeRebarBase } from "../Base";
import { CInnerBar } from "./CInnerBar";
import { CInnerSubBar } from "./CInnerSubBar";
import { COuterBar } from "./COuterBar";
import { LInnerBar } from "./LInnerBar";
import { LOuterBar } from "./LOuterBar";
import { MainBar } from "./MainBar";
import { TopBeamBar } from "./TopBeamBar";

export class ShellRebarBuilder extends CompositeRebarBase {
  init(): void {
    this.push(
      new MainBar(this.struct, this.specs, this.figures),
      new LInnerBar(this.struct, this.specs, this.figures),
      new LOuterBar(this.struct, this.specs, this.figures),
      new CInnerBar(this.struct, this.specs, this.figures),
      new CInnerSubBar(this.struct, this.specs, this.figures),
      new COuterBar(this.struct, this.specs, this.figures),
      new TopBeamBar(this.struct, this.specs, this.figures)
    );
    this.setName("槽壳");
  }
}
