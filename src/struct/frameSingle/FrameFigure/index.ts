import { BeamSect, ColumnSect } from "@/struct/component";
import { FigureContainer } from "@/struct/utils";
import { FrameRebar } from "../FrameRebar";
import { FrameStruct } from "../FrameStruct";
import { FrameAlong } from "./Along";
import { FrameCross } from "./Cross";

export class FrameFigure extends FigureContainer{
  cross = new FrameCross(this);
  along = new FrameAlong(this);
  sCol = new ColumnSect(this);
  sTopBeam = new BeamSect(this);
  sBeam = new BeamSect(this);

  build(t: FrameStruct, rebars: FrameRebar): void{
    this.cross.initFigure();
    this.along.initFigure();
    this.sCol.initFigure();
    this.sTopBeam.initFigure();
    this.sBeam.initFigure();

    this.cross.build(t, rebars, this);
    this.along.build(t, rebars);
    this.sCol.build(t.col, rebars.col);
    this.sTopBeam.build(t.topBeam, rebars.topBeam);
    this.sBeam.build(t.beam, rebars.beam);
  }
}