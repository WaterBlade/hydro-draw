import { DrawItem } from "@/draw";
import { Drawing, MaterialTableFigure, RebarTableFigure } from "../utils";
import { FrameFigure } from "./FrameFigure";
import { FrameRebar } from "./FrameRebar";
import { FrameStruct } from "./FrameStruct";

export class FrameSingleController {
  struct = new FrameStruct();
  rebar = new FrameRebar();
  drawing = new Drawing();
  generate(): DrawItem[] {
    const figure = new FrameFigure();

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
