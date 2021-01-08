import { Figure, FigureInBorder} from "../Figure";

export class UShellFigure {
  recordFigures: FigureInBorder[] = [];
  record(fig: FigureInBorder): void{
    this.recordFigures.push(fig);
  }
  cMid = new Figure();
  cEnd = new Figure();
  cTrans = new Figure();
  lInner = new Figure();
  lOuter = new Figure();
  sEndBeam = new Figure();
  sEndWall = new Figure();
  sBar = new Figure();
}