import { DrawItem } from "@/draw";
import { Drawing, MaterialTableFigure, RebarTableFigure } from "../utils";
import { UShellFigureBuilder } from "./FigureBuilder";
import { UShellRebarBuilder } from "./RebarBuilder";
import { UShell } from "./UShell";

export class UShellController {
  ushell = new UShell();
  struct = this.ushell.struct;
  rebar = this.ushell.rebars;
  drawing = new Drawing();
  generate(): DrawItem[] {
    const figBuilder = new UShellFigureBuilder(this.ushell);
    const rebarBuilder = new UShellRebarBuilder(this.ushell);

    rebarBuilder.build();
    figBuilder.build();

    this.drawing.push(
      ...figBuilder.figures.recordFigures,
      new RebarTableFigure(...this.rebar.recordRebars),
      new MaterialTableFigure(...this.rebar.recordRebars)
    );

    return this.drawing.generate();
  }
}
