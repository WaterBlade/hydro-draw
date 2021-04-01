import {
  DrawItem,
  HydroBorderFactory,
  MaterialTable,
  RebarTable,
} from "@/draw";
import { FoundFigure } from "./FoundFigure";
import { FoundRebar } from "./FoundRebar";
import { FoundStruct } from "./FoundStruct";

export class FoundController {
  struct = new FoundStruct();
  rebar = new FoundRebar(this.struct);
  protected figure = new FoundFigure(this.struct, this.rebar);
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
