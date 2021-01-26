import { UnitRebarSpec } from "@/draw";
import { CountRebar, PosGen, RebarContainer, SpaceRebar } from "@/struct/utils";

export class Column{
  h = 0;
  w = 0;
  // to init
  l = 0;
  ld = 0;
  setInfo(l: number, ld: number):this{
    this.l = l;
    this.ld = ld;
    return this;
  }
  
}

export class ColumnRebar extends RebarContainer{
  corner = new UnitRebarSpec();
  along = new CountRebar({
    along: new PosGen(),
    sCol: new PosGen()
  });
  cross = new CountRebar({
    cross: new PosGen(),
    sCol: new PosGen()
  });
  stir = new SpaceRebar(new PosGen());
  // to init
  as = 0;
  stirPos: number[] = [];
  setInfo(as: number, stirPos: number[]): this{
    this.as = as;
    this.stirPos = stirPos;
    return this;
  }
}