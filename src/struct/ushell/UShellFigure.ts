import { Figure, FigureInBorder, MaterialTableFigure, RebarTableFigure } from "../Figure";

export class UShellFigure {
  figures: FigureInBorder[] = [];
  cMid = new Figure();
  cEnd = new Figure();
  lInner = new Figure();
  lOuter = new Figure();
  sEndBeam = new Figure();
  sEndWall = new Figure();
  sBar = new Figure();
  rTable = new RebarTableFigure();
  mTable = new MaterialTableFigure();
}
