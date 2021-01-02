import { Figure, MaterialTableFigure, RebarTableFigure } from "../RebarBuilder";

export class UShellFigure {
  cMid = new Figure();
  cEnd = new Figure();
  lInner = new Figure();
  lOuter = new Figure();
  rTable = new RebarTableFigure();
  mTable = new MaterialTableFigure();
}
