import { CompositeRebarBase } from "../Base";
import { CInnerBar } from "./CInnerBar";
import { CInnerSubBar } from "./CInnerSubBar";
import { COuterBar } from "./COuterBar";
import { LInnerBar } from "./LInnerBar";
import { LOuterBar } from "./LOuterBar";
import { MainBar } from "./MainBar";
import { TopBeamBar } from "./TopBeamBar";

export class ShellRebarBuilder extends CompositeRebarBase {
  init(): void{
    this.push(
      MainBar,
      LInnerBar,
      LOuterBar,
      CInnerBar,
      CInnerSubBar,
      COuterBar,
      TopBeamBar,
    );
    this.setName('槽壳');
  }
}
