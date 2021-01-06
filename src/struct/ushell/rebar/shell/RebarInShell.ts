import { UShellCompositeRebarBuilder } from "../../UShellRebar";
import { CInnerBar } from "./CInnerBar";
import { CInnerSubBar } from "./CInnerSubBar";
import { COuterBar } from "./COuterBar";
import { LInnerBar } from "./LInnerBar";
import { LOuterBar } from "./LOuterBar";
import { MainBar } from "./MainBar";
import { TopBeamBar } from "./TopBeamBar";

export class RebarInShell extends UShellCompositeRebarBuilder {
  init(): void{
    this.push(
      new MainBar(this.struct, this.rebars, this.figures),
      new LInnerBar(this.struct, this.rebars, this.figures),
      new LOuterBar(this.struct, this.rebars, this.figures),
      new CInnerBar(this.struct, this.rebars, this.figures),
      new CInnerSubBar(this.struct, this.rebars, this.figures),
      new COuterBar(this.struct, this.rebars, this.figures),
      new TopBeamBar(this.struct, this.rebars, this.figures),
    );
    this.setName('槽壳');
  }
}
