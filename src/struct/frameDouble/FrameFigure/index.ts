import { BeamSect, ColumnSect } from "@/struct/component";
import { FigureContainer } from "@/struct/utils";
import { FrameDoubleRebar } from "../FrameRebar";
import { FrameDoubleStruct } from "../FrameStruct";
import { FrameAlong } from "./Along";
import { FrameCross } from "./Cross";

export class FrameDoubleFigure extends FigureContainer {
  cross = new FrameCross(this);
  along = new FrameAlong(this);
  sCol = new ColumnSect(this);
  sTopCross = new BeamSect(this);
  sTopAlong = new BeamSect(this);
  sBeamCross = new BeamSect(this);
  sBeamAlong = new BeamSect(this);

  build(t: FrameDoubleStruct, rebars: FrameDoubleRebar): void {
    this.cross.initFigure();
    this.along.initFigure();
    this.sCol.initFigure();
    this.sTopCross.initFigure();
    this.sTopAlong.initFigure();
    this.sBeamCross.initFigure();
    this.sBeamAlong.initFigure();

    this.cross.build(t, rebars, this);
    this.along.build(t, rebars, this);
    this.sCol.build(t.col, rebars.col);
    this.sTopCross.build(t.topCross, rebars.topCross);
    this.sTopAlong.build(t.topAlong, rebars.topAlong);
    this.sBeamCross.build(t.beamCross, rebars.beamCross);
    this.sBeamAlong.build(t.beamAlong, rebars.beamAlong);
  }
}
