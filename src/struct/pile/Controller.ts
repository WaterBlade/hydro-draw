import { DrawItem } from "@/draw";
import { Drawing, MaterialTableFigure } from "../utils";
import { PileRebarTableFigure } from "./Figure";
import { PileFigureBuilder } from "./FigureBuilder";
import { Pile } from "./Pile";
import { PileFigure } from "./PileFigure";
import { PileRebar } from "./PileRebar";
import { PileRebarBuilder } from "./RebarBuilder";

export class PileController{
  struct = new Pile();
  rebar = new PileRebar();
  drawing = new Drawing(1, 0.75);
  generate(): DrawItem[] {
    const figure = new PileFigure();

    const figBuilder = new PileFigureBuilder(
      this.struct,
      this.rebar,
      figure
    );
    const rebarBuilder = new PileRebarBuilder(
      this.struct,
      this.rebar,
      figure
    );

    figBuilder.initFigure();
    figBuilder.buildOutline();
    figBuilder.buildPos();
    rebarBuilder.build();
    figBuilder.buildNote();
    figBuilder.buildDim();

    this.drawing.setSize('A2');

    this.drawing.push(
      ...figure.recordFigures,
    );

    const material = new MaterialTableFigure();
    for(const pile of this.piles){
      this.struct.id = pile.id;
      this.struct.top = pile.top;
      this.struct.bottom = pile.bottom;
      this.struct.count = pile.count;
      this.struct.load = pile.load;
      this.rebar.clear();
      rebarBuilder.buildSpec();
      this.drawing.push(
      new PileRebarTableFigure(this.struct, this.rebar.recordRebars),
      );
      material.push(...this.rebar.recordRebars);
    }
    this.drawing.push(material)

    return this.drawing.generate();
  }
  protected piles: PileInfo[] = [];
  add(id: string, top: number, bottom: number, count: number, load = 0): void{
    this.piles.push(
      new PileInfo(id, top, bottom, count, load)
    );
  }
}

class PileInfo{
  constructor(
    public id: string,
    public top: number,
    public bottom: number,
    public count: number,
    public load: number
  ){}
}