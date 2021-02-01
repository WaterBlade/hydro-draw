import { DrawItem } from "@/draw";
import { Drawing, MaterialTableFigure, RebarTableFigure } from "../utils";
import { FrameSingleFigureBuilder } from "./FigureBuilder";
import { FrameSingle } from "./FrameSingle";
import { FrameSingleFigure } from "./FrameSingleFigure";
import { FrameSingleRebar } from "./FrameSingleRebar";
import { FrameSingleRebarBuilder } from "./RebarBuilder";

export class FrameSingleController {
  struct = new FrameSingle();
  rebar = new FrameSingleRebar();
  drawing = new Drawing();
  generate(): DrawItem[] {
    const figure = new FrameSingleFigure();

    const figBuilder = new FrameSingleFigureBuilder(
      this.struct,
      this.rebar,
      figure
    );
    const rebarBuilder = new FrameSingleRebarBuilder(
      this.struct,
      this.rebar,
      figure
    );

    figBuilder.initFigure();
    figBuilder.buildOutline();
    figBuilder.buildPos();
    rebarBuilder.build();
    figBuilder.buildNote();
    figBuilder.buildDim();

    this.drawing.push(
      ...figure.recordFigures,
      new RebarTableFigure(...this.rebar.recordRebars),
      new MaterialTableFigure(...this.rebar.recordRebars)
    );

    return this.drawing.generate();
  }
}
