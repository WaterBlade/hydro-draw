import { DrawItem } from "@/draw";
import { Drawing, MaterialTableFigure } from "../utils";
import { PileFigure } from "./PileFigure";
import { PileRebar } from "./PileRebar";
import { PileRebarTableFigure } from "./PileRebarTable";
import { PileStruct } from "./PileStruct";

export class PileController {
  struct = new PileStruct();
  rebar = new PileRebar();
  drawing = new Drawing(1, 0.75);
  generate(): DrawItem[] {

    const figure = new PileFigure();

    this.rebar.build(this.struct);
    figure.build(this.struct, this.rebar);

    this.drawing.setSize("A2");

    this.drawing.push(...figure.figures);

    const material = new MaterialTableFigure();
    for (const pile of this.piles) {
      this.struct.id = pile.id;
      this.struct.top = pile.top;
      this.struct.bottom = pile.bottom;
      this.struct.count = pile.count;
      this.struct.load = pile.load;
      this.rebar.clear();
      this.rebar.build(this.struct);
      this.drawing.push(
        new PileRebarTableFigure(this.struct, this.rebar.rebars)
      );
      material.push(...this.rebar.rebars);
    }
    this.drawing.push(material);

    return this.drawing.generate();
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
