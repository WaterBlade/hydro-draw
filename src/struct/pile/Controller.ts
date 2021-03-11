import { DrawItem, HydroBorderFactory, MaterialTable } from "@/draw";
import { PileFigure } from "./PileFigure";
import { PileRebar } from "./PileRebar";
import { PileRebarTable } from "./PileTable";
import { PileStruct } from "./PileStruct";

export class PileController {
  struct = new PileStruct();
  rebar = new PileRebar(this.struct);
  protected figure = new PileFigure(this.struct, this.rebar);
  drawing = new HydroBorderFactory();
  generate(): DrawItem[] {
    this.rebar.init();
    this.figure.init();

    const items = this.figure.genBorderItems();

    this.drawing.size = "A2";

    const border = this.drawing.border();
    border.add(...items);

    const rebarTable = new PileRebarTable();
    const materialTable = new MaterialTable();
    for (const pile of this.piles) {
      this.struct.id = pile.id;
      this.struct.top = pile.top;
      this.struct.bottom = pile.bottom;
      this.struct.count = pile.count;
      this.struct.load = pile.load;
      this.rebar.init();
      const specs  = this.rebar.genSpecs();
      rebarTable.push(this.struct, specs);
      materialTable.push(...specs);
    }
    border.addContent(rebarTable.generate());
    border.addContent(materialTable.generate());

    return border.generate();
  }
  protected piles: PileInfo[] = [];
  add(id: string, top: number, bottom: number, count: number, load = 0): void {
    this.piles.push(new PileInfo(id, top, bottom, count, load));
  }
}

class PileInfo {
  constructor(
    public id: string,
    public top: number,
    public bottom: number,
    public count: number,
    public load: number
  ) {}
}
