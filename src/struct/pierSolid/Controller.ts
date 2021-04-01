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
  rebar = new PierSolidRebar(this.struct);
  protected figure = new PierSolidFigure(this.struct, this.rebar);
  drawing = new HydroBorderFactory();
  generate(): DrawItem[] {
    this.rebar.init();
    this.figure.init();

    const specs = this.rebar.genSpecs();
    const items = this.figure.genBorderItems();

    const border = this.drawing.border();
    border.add(...items);
    border.addContent(new RebarTable(...specs).generate());
    border.addContent(new MaterialTable(...specs).generate());

    return border.generate();
  }
}
