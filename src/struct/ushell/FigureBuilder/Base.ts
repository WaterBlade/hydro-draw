import { CompositeFigureBuilder, FigureBuilder } from "@/struct/FigureBuilder";
import { UShell } from "../UShell";
import { UShellFigure } from "../UShellFigure";
import { UShellRebar } from "../UShellRebar";

export abstract class FigureBase extends FigureBuilder<
  UShell,
  UShellRebar,
  UShellFigure
> {}
export abstract class CompositeFigureBase extends CompositeFigureBuilder<
  UShell,
  UShellRebar,
  UShellFigure
> {}
