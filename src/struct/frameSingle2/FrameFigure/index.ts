import { BeamSect, ColumnSect, TopBeamSect } from "@/struct/component";
import { FigureContainer } from "@/struct/utils";
import { FrameSingleRebar } from "../FrameRebar";
import { FrameSingleStruct } from "../FrameStruct";
import { FrameAlong } from "./Along";
import { FrameCross } from "./Cross";

export class FrameSingleFigure extends FigureContainer {
  cross = new FrameCross(this);
  along = new FrameAlong(this);
  sCol = new ColumnSect(this);
  sTopBeam = new TopBeamSect(this);
  sBeam = new BeamSect(this);

  build(t: FrameSingleStruct, rebars: FrameSingleRebar): void {
    this.cross.initFigure();
    this.along.initFigure();
    this.sCol.initFigure();
    this.sTopBeam.initFigure();
    if(t.n > 0) this.sBeam.initFigure();

    this.cross.build(t, rebars, this);
    this.along.build(t, rebars);
    this.sCol.build(t.col, rebars.col);
    this.sTopBeam.build(t.topBeam, rebars.topBeam);
    if(t.n > 0) this.sBeam.build(t.beam, rebars.beam);
  }
}
