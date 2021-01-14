import { Figure, FigureInBorder, SectIdGen, SpecIdGen } from "../utils/Figure";

export class UShellFigure {
  recordFigures: FigureInBorder[] = [];
  specId = new SpecIdGen();
  sectId = new SectIdGen();
  record(fig: FigureInBorder): void {
    this.recordFigures.push(fig);
  }
  cMid = new Figure();
  cEnd = new Figure();
  cEndCant = new Figure();
  cTrans = new Figure();
  lInner = new Figure();
  lOuter = new Figure();
  sEndBLeft = new Figure();
  sEndBRight = new Figure();
  sEndCantBLeft = new Figure();
  sEndCantBRight = new Figure();
  sEndWLeft = new Figure();
  sEndWRight = new Figure();
  sEndCantWLeft = new Figure();
  sEndCantWRight = new Figure();
  sBar = new Figure();
}
