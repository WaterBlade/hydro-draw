import { UShellCompositeRebarBuilder } from "../../UShellRebar";
import { CInnerBar } from "./CInnerBar";
import { COuterBar } from "./COuterBar";
import { LInnerBar } from "./LInnerBar";
import { LOuterBar } from "./LOuterBar";
import { MainBar } from "./MainBar";
import { TopBeamBar } from "./TopBeamBar";

export class RebarInShell extends UShellCompositeRebarBuilder {
  protected name = "槽壳";
  main = new MainBar(this.struct, this.rebars, this.figures, this);
  lInner = new LInnerBar(this.struct, this.rebars, this.figures, this);
  lOuter = new LOuterBar(this.struct, this.rebars, this.figures, this);
  cInner = new CInnerBar(this.struct, this.rebars, this.figures, this);
  cOuter = new COuterBar(this.struct, this.rebars, this.figures, this);
  topBeam = new TopBeamBar(this.struct, this.rebars, this.figures, this);
}
