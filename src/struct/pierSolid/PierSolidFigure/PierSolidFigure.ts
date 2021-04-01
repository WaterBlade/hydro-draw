import { FigureRoot } from "@/struct/utils";
import { PierSolidRebar } from "../PierSolidRebar";
import { PierSolidStruct } from "../PierSolidStruct";
import { PierSolidAlong } from "./Along";
import { PierSolidCross } from "./Cross";
import { PierSolidSect } from "./Sect";

export class PierSolidFigure extends FigureRoot{
  cross = this.add(new PierSolidCross(this.sturct, this.rebars, this));
  along = this.add(new PierSolidAlong(this.sturct, this.rebars, this));
  sect = this.add(new PierSolidSect(this.sturct, this.rebars, this));
  constructor(protected sturct: PierSolidStruct, protected rebars: PierSolidRebar){super();}

}