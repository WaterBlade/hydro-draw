import { DrawItem } from "@/draw";
import { Drawing, MaterialTableFigure, RebarTableFigure } from "../utils";
import { FrameSingleFigure } from "./FrameFigure";
import { FrameSingleRebar } from "./FrameRebar";
import { FrameSingleStruct } from "./FrameStruct";

export class FrameSingleController2 {
  struct = new FrameSingleStruct();
  rebar = new FrameSingleRebar();
  drawing = new Drawing();
  generate(): DrawItem[] {
    const figure = new FrameSingleFigure();

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
