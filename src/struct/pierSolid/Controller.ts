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
  generate(H?: number): DrawItem[] {
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
