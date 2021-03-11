import { FigureRoot } from "@/struct/utils";
import { PileRebar } from "../PileRebar";
import { PileStruct } from "../PileStruct";

export class PileFigure extends FigureRoot{
  ele = this.add(new Ele(this.struct, this.rebars, this));
  sect = this.add(new Sect(this.struct, this.rebars, this));
  constructor(protected struct: PileStruct, protected rebars: PileRebar){super();}
}

import { Ele } from "./Ele";
import { Sect } from "./Sect";