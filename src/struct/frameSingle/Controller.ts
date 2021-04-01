import {
  DrawItem,
  HydroBorderFactory,
  MaterialTable,
  RebarTable,
} from "@/draw";
import { FrameSingleFigure } from "./FrameFigure";
import { FrameSingleRebar } from "./FrameRebar";
import { FrameSingleStruct } from "./FrameStruct";

export class FrameSingleController {
  struct = new FrameSingleStruct();
  rebar = new FrameSingleRebar(this.struct);
  protected figure = new FrameSingleFigure(this.struct, this.rebar);
  drawing = new HydroBorderFactory();
  generate(H?: number): DrawItem[] {
    this.struct.initComponent();
    this.rebar.init();
    this.figure.init();

    const specs = this.rebar.genSpecs();
    const items = this.figure.genBorderItems();

    const border = this.drawing.border();
    border.add(...items);

    const rTable = new RebarTable(...specs);
    const mTable = new MaterialTable(...specs);
    if(H){
      rTable.title(`钢筋表(H=${H.toFixed(0)})`);
      mTable.title(`材料表(H=${H.toFixed(0)})`);
    }
    border.addContent(rTable.generate());
    border.addContent(mTable.generate());

    return border.generate();
  }
}
