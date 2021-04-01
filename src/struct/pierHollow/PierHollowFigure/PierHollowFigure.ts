import { FigureRoot, SectFigure } from "@/struct/utils";
import { PierHollowRebar } from "../PierHollowRebar/PierHollowRebar";
import { PierHollowStruct } from "../PierHollowStruct";

export class PierHollowFigure extends FigureRoot{
  lView = this.add(new LView(this.struct, this.rebars, this));
  wView = this.add(new WView(this.struct, this.rebars, this));
  lSect = this.add(new LSect(this.struct, this.rebars, this));
  wSect = this.add(new WSect(this.struct, this.rebars, this));
  solid = this.add(new SolidSect(this.struct, this.rebars));
  hollow = this.add(new HollowSect(this.struct, this.rebars));
  plate = this.add(new PlateSect(this.struct, this.rebars));
  constructor(protected struct: PierHollowStruct, protected rebars: PierHollowRebar){
    super();
  }

}

export abstract class PierHollowSectFigure extends SectFigure{
  constructor(protected struct: PierHollowStruct, protected rebars: PierHollowRebar){
    super();
  }
}

import { HollowSect } from "./HollowSect";
import { PlateSect } from "./PlateSect";
import { LSect, WSect } from "./Sect";
import { SolidSect } from "./SolidSect";
import { LView, WView } from "./View";