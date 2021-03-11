import {
  DrawItem,
  HydroBorderFactory,
  MaterialTable,
  RebarTable,
} from "@/draw";
import { FrameDoubleFigure } from "./FrameFigure";
import { FrameDoubleRebar } from "./FrameRebar";
import { FrameDoubleStruct } from "./FrameStruct";

export class FrameDoubleController {
  struct = new FrameDoubleStruct();
  rebar = new FrameDoubleRebar(this.struct);
  protected figure = new FrameDoubleFigure(this.struct, this.rebar);
  drawing = new HydroBorderFactory();
  generate(): DrawItem[] {
    this.struct.initComponent();
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
