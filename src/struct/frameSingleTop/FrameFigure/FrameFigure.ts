import {
  BeamEndSect,
  BeamMidSect,
  ColumnSect,
  TopBeamSect,
} from "@/struct/component";
import { FigureRoot } from "@/struct/utils";
import { FrameSingleRebar } from "../FrameRebar";
import { FrameSingleStruct } from "../FrameStruct";

export class FrameSingleFigure extends FigureRoot {
  cross = this.add(new FrameCross(this.struct, this.rebars, this));
  along = this.add(new FrameAlong(this.struct, this.rebars));
  sCol = this.add(new ColumnSect(this.struct.col, this.rebars.col));
  sTopBeam = this.add(
    new TopBeamSect(this.struct.topBeam, this.rebars.topBeam)
  );
  sBeamMid = this.add(new BeamMidSect(this.struct.beam, this.rebars.beam));
  sBeamEnd = this.add(new BeamEndSect(this.struct.beam, this.rebars.beam));

  constructor(
    protected struct: FrameSingleStruct,
    protected rebars: FrameSingleRebar
  ) {
    super();
  }
}

import { FrameAlong } from "./Along";
import { FrameCross } from "./Cross";
