import {
  DrawItem,
  HydroBorderFactory,
  MaterialTable,
  RebarTable,
} from "@/draw";
import { PierSolidFigure } from "./PierSolidFigure";
import { PierSolidRebar } from "./PierSolidRebar";
import { PierSolidStruct } from "./PierSolidStruct";

export class PierSolidController {
  struct = new PierSolidStruct();
  rebar = new PierSolidRebar();
  drawing = new HydroBorderFactory();
  generate(): DrawItem[] {
    this.rebar.build(this.struct);
    const figure = new PierSolidFigure();
    figure.build(this.struct, this.rebar);

    const border = this.drawing.border();
    border.add(...figure.figures);
    border.addContent(new RebarTable(...this.rebar.rebars).generate());
    border.addContent(new MaterialTable(...this.rebar.rebars).generate());

    return border.generate();
  }
}
