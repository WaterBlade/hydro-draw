import { DrawItem } from "@/draw";
import { Drawing, MaterialTableFigure, RebarTableFigure } from "../utils";
import { PierSolidFigure } from "./PierSolidFigure";
import { PierSolidRebar } from "./PierSolidRebar";
import { PierSolidStruct } from "./PierSolidStruct";

export class PierSolidController{
  struct = new PierSolidStruct();
  rebar = new PierSolidRebar();
  drawing = new Drawing();
  generate(): DrawItem[]{
    this.rebar.build(this.struct);
    const fig = new PierSolidFigure();
    fig.build(this.struct, this.rebar);

    this.drawing.push(
      ...fig.figures,
      new RebarTableFigure(...this.rebar.rebars),
      new MaterialTableFigure(...this.rebar.rebars)
    );
    return this.drawing.generate();
  }
}