import { PlatformRebar } from "../PlatformRebar";
import { PlatformStruct } from "../PlatformStruct";
import { FigureRoot } from "@/struct/utils";

export class PlatformFigure extends FigureRoot {
  lView = this.add(new LView(this.struct, this.rebars, this));
  wView = this.add(new WView(this.struct, this.rebars, this));
  lSect = this.add(new LSect(this.struct, this.rebars, this));
  wSect = this.add(new WSect(this.struct, this.rebars, this));
  constructor(
    protected struct: PlatformStruct,
    protected rebars: PlatformRebar
  ) {
    super();
  }
}

import { LView, WView } from "./View";
import { LSect, WSect } from "./Sect";
