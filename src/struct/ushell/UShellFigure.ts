import { Figure, FigureContainer, PosFigure, PosGen } from "../utils";

export class UShellFigure extends FigureContainer{
  cMid = new Figure();
  cEnd = new Figure();
  cEndCant = new Figure();
  cTrans = new PosFigure(new PosGen());
  lInner = new Figure();
  lOuter = new PosFigure(
    {
      h: new PosGen(),
      v: new PosGen()
    }
  );
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
