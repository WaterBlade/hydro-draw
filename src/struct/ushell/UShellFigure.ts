import { Figure, MaterialTableFigure, RebarTableFigure } from "../Figure";

export class UShellFigure {
  lOuter = new Figure();
  lInner = new Figure();
  cMid = new Figure();
  cEnd = new Figure();
  sEndBeam = new Figure();
  sEndWall = new Figure();
  sBar = new Figure();
  rTable = new RebarTableFigure();
  mTable = new MaterialTableFigure();
}
