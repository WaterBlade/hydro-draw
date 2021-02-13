import { DrawItem } from "@/draw";
import { Drawing, MaterialTableFigure, RebarTableFigure } from "../utils";
import { FrameDoubleFigure } from "./FrameFigure";
import { FrameDoubleRebar } from "./FrameRebar";
import { FrameDoubleStruct } from "./FrameStruct";

export class FrameDoubleController {
  struct = new FrameDoubleStruct();
  rebar = new FrameDoubleRebar();
  drawing = new Drawing();
  generate(): DrawItem[] {
    const figure = new FrameDoubleFigure();

    this.rebar.build(this.struct);
    figure.build(this.struct, this.rebar);

    this.drawing.push(
      ...figure.figures,
      new RebarTableFigure(...this.rebar.rebars),
      new MaterialTableFigure(...this.rebar.rebars)
    );

    return this.drawing.generate();
  }
}
