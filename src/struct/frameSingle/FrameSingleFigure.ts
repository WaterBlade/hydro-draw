import { Figure, FigureContainer, PosFigure, SpaceGen } from "../utils";

export class FrameSingleFigure extends FigureContainer{
  cross = new PosFigure({
    v: new SpaceGen(),
    hb: new SpaceGen(),
    ht: new SpaceGen()
  });
  along = new PosFigure({
    v: new SpaceGen()
  });
  sCol = new Figure();
  sBeam = new Figure();
  sTop = new Figure();
}