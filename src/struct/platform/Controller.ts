import {
  DrawItem,
  HydroBorderFactory,
  MaterialTable,
  RebarTable,
} from "@/draw";
import { PlatformFigure } from "./PlatformFigure";
import { PlatformRebar } from "./PlatformRebar";
import { PlatformStruct } from "./PlatformStruct";

export class PlatformController {
  struct = new PlatformStruct();
  rebar = new PlatformRebar(this.struct);
  protected figure = new PlatformFigure(this.struct, this.rebar);
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
