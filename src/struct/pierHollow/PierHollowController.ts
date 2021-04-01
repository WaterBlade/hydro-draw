import { DrawItem, HydroBorderFactory, MaterialTable, RebarTable } from "@/draw";
import { PierHollowFigure } from "./PierHollowFigure";
import { PierHollowRebar } from "./PierHollowRebar";
import {PierHollowStruct} from "./PierHollowStruct";

export class PierHollowController{
  struct = new PierHollowStruct();
  rebar = new PierHollowRebar(this.struct);
  protected figure = new PierHollowFigure(this.struct, this.rebar);
  
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