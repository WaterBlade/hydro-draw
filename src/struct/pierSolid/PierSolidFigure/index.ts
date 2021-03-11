import { FigureContainer } from "@/struct/utils";
import { PierSolidRebar } from "../PierSolidRebar";
import { PierSolidStruct } from "../PierSolidStruct";
import { PierSolidAlong } from "./Along";
import { PierSolidCross } from "./Cross";
import { PierSolidSect } from "./Sect";

export class PierSolidFigure extends FigureContainer {
  cross = new PierSolidCross(this);
  along = new PierSolidAlong(this);
  sect = new PierSolidSect(this);

  build(t: PierSolidStruct, rebars: PierSolidRebar): void {
    this.cross.initFigure();
    this.along.initFigure();
    this.sect.initFigure();

    this.cross.build(t);
    this.along.build(t, rebars);
    this.sect.build(t);
  }
}
