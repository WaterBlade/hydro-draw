import { BeamMidSect, ColumnSect } from "@/struct/component";
import { FigureRoot } from "@/struct/utils";
import { FrameDoubleRebar } from "../FrameRebar";
import { FrameDoubleStruct } from "../FrameStruct";
import { FrameAlong } from "./Along";
import { FrameCross } from "./Cross";

export class FrameDoubleFigure extends FigureRoot {
  cross = this.add(new FrameCross(this.struct, this.rebars, this));
  along = this.add(new FrameAlong(this.struct, this.rebars, this));
  sCol = this.add(new ColumnSect(this.struct.col, this.rebars.col));
  sTopCross = this.add(
    new BeamMidSect(this.struct.topCross, this.rebars.topCross)
  );
  sTopAlong = this.add(
    new BeamMidSect(this.struct.topAlong, this.rebars.topAlong)
  );
  sBeamCross = this.add(
    new BeamMidSect(this.struct.beamCross, this.rebars.beamCross)
  );
  sBeamAlong = this.add(
    new BeamMidSect(this.struct.beamCross, this.rebars.beamAlong)
  );

  constructor(
    protected struct: FrameDoubleStruct,
    protected rebars: FrameDoubleRebar
  ) {
    super();
  }
}
