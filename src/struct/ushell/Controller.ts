import { DrawItem} from "@/draw";
import { Drawing } from "../Drawing";
import { MaterialTableFigure, RebarTableFigure } from "../Figure";
import { UShellFigureBuilder } from "./FigureBuilder";
import { UShellRebarBuilder } from "./RebarBuilder";
import { UShell } from "./UShell";
import { UShellFigure } from "./UShellFigure";
import { UShellRebar } from "./UShellRebar";

export class UShellController {
  struct = new UShell();
  rebar = new UShellRebar();
  drawing = new Drawing();
  generate(): DrawItem[] {
    const figure = new UShellFigure();

    const figBuilder = new UShellFigureBuilder(this.struct, this.rebar, figure);
    const rebarBuilder = new UShellRebarBuilder(this.struct, this.rebar, figure);

    figBuilder.initFigure();
    figBuilder.buildOutline();
    rebarBuilder.build();
    figBuilder.buildDim();

    this.drawing.push(
      ...figure.recordFigures,
      new RebarTableFigure().push(...this.rebar.recordRebars),
      new MaterialTableFigure().push(...this.rebar.recordRebars),
    );

    return this.drawing.generate();
  }
}
