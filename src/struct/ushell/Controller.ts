import {
  DrawItem,
  HydroBorderFactory,
  MaterialTable,
  RebarTable,
} from "@/draw";
import { UShellFigure } from "./UShellFigure/indext";
import { UShellRebar } from "./UShellRebar";
import { UShellStruct } from "./UShellStruct";

export class UShellController {
  struct = new UShellStruct();
  rebar = new UShellRebar(this.struct);
  protected figure = new UShellFigure(this.struct, this.rebar);
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
