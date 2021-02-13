import { DrawItem } from "@/draw";
import { Drawing, MaterialTableFigure, RebarTableFigure } from "../utils";
import { UShellFigure } from "./UShellFigure/indext";
import { UShellRebar } from "./UShellRebar";
import { UShellStruct } from "./UShellStruct";

export class UShellController {
  struct = new UShellStruct();
  rebar = new UShellRebar();
  drawing = new Drawing();
  generate(): DrawItem[] {
    const figure = new UShellFigure();
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
