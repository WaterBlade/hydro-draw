import { DrawItem } from "@/draw";
import { Drawing, MaterialTableFigure } from "../utils";
import { PileFigureBuilder } from "./FigureBuilder";
import { Pile } from "./Pile";
import { PileRebarTableFigure } from "./PileRebarTable";
import { PileRebarBuilder } from "./RebarBuilder";

export class PileController {
  pile = new Pile();
  struct = this.pile.struct;
  rebar = this.pile.rebars;
  drawing = new Drawing(1, 0.75);
  generate(): DrawItem[] {
    const rebarBuilder = new PileRebarBuilder(this.pile);

    const figBuilder = new PileFigureBuilder(this.pile);

    rebarBuilder.build();
    figBuilder.build();

    this.drawing.setSize("A2");

    this.drawing.push(...figBuilder.figures.recordFigures);

    const material = new MaterialTableFigure();
    for (const pile of this.piles) {
      this.struct.id = pile.id;
      this.struct.top = pile.top;
      this.struct.bottom = pile.bottom;
      this.struct.count = pile.count;
      this.struct.load = pile.load;
      this.rebar.clear();
      rebarBuilder.build();
      this.drawing.push(
        new PileRebarTableFigure(this.struct, this.rebar.recordRebars)
      );
      material.push(...this.rebar.recordRebars);
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
