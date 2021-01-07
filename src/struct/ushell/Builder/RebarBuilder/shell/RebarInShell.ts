import { item } from "@/struct/RebarBuilder";
import { UShellCompositeRebarBuilder } from "../../../UShellRebar";
import { CInnerBar } from "./CInnerBar";
import { CInnerSubBar } from "./CInnerSubBar";
import { COuterBar } from "./COuterBar";
import { LInnerBar } from "./LInnerBar";
import { LOuterBar } from "./LOuterBar";
import { MainBar } from "./MainBar";
import { TopBeamBar } from "./TopBeamBar";

export class RebarInShell extends UShellCompositeRebarBuilder {
  name = '槽壳';
  main = item(MainBar, this);
  lInner = item(LInnerBar, this);
  lOuter = item(LOuterBar, this);
  cInner = item(CInnerBar, this);
  cInnerSub = item(CInnerSubBar, this);
  cOuter = item(COuterBar, this);
  topBeam = item(TopBeamBar, this);
}
