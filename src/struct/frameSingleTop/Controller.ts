import {
  DrawItem,
  HydroBorderFactory,
  MaterialTable,
  RebarTable,
} from "@/draw";
import { FrameSingleFigure } from "./FrameFigure";
import { FrameSingleRebar } from "./FrameRebar";
import { FrameSingleStruct } from "./FrameStruct";

export class FrameSingleControllerTop {
  struct = new FrameSingleStruct();
  rebar = new FrameSingleRebar(this.struct);
  protected figure = new FrameSingleFigure(this.struct, this.rebar);
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
