import { BeamMidSect, ColumnSect } from "@/struct/component";
import { FigureRoot } from "@/struct/utils";
import { FrameSingleRebar } from "../FrameRebar";
import { FrameSingleStruct } from "../FrameStruct";
import { FrameAlong } from "./Along";
import { FrameCross } from "./Cross";

export class FrameSingleFigure extends FigureRoot {
  cross = this.add(new FrameCross(this.struct, this.rebars, this));
  along = this.add(new FrameAlong(this.struct, this.rebars));
  sCol = this.add(new ColumnSect(this.struct.col, this.rebars.col));
  sTopBeam = this.add(
    new BeamMidSect(this.struct.topBeam, this.rebars.topBeam)
  );
  sBeam = this.add(new BeamMidSect(this.struct.beam, this.rebars.beam));

  constructor(
    protected struct: FrameSingleStruct,
    protected rebars: FrameSingleRebar
  ) {
    super();
  }
}
