import { Circle, Side, vec } from "@/draw";
import { FigureConfig, SectFigure } from "@/struct/utils";
import { PileRebar } from "../PileRebar";
import { PileStruct } from "../PileStruct";
import { PileFigure } from "./PileFigure";

export class Sect extends SectFigure{
  constructor(protected struct: PileStruct, protected rebars: PileRebar, protected figures: PileFigure){super();}
  protected unitScale = 1;
  protected drawScale = 30;
  protected config = new FigureConfig(true, true);
  protected draw(): void {
    this.buildOutline();
    this.buildRebar();
    this.buildDim();
  }
  protected buildOutline(): this {
    const t = this.struct;
    const fig = this.fig;
    fig.addOutline(new Circle(vec(0, 0), t.d / 2).greyLine());
    return this;
  }
  protected buildDim(): this {
    const t = this.struct;
    const fig = this.fig;
    const bottom = fig.getBoundingBox().bottom;
    fig.push(
      fig
        .dimBuilder()
        .hBottom(-t.d / 2, bottom - fig.h)
        .dim(t.d)
        .generate()
    );
    return this;
  }

  protected buildRebar(): this {
    this.drawMain();
    this.drawRib();
    this.drawStir();
    return this;
  }

  protected drawMain(): void {
    const t = this.struct;
    const rebars = this.rebars;
    const fig = this.fig;
    const bar = rebars.main;
    const as = rebars.as;
    fig.push(
      fig
        .circlePointRebar()
        .circle(
          new Circle(vec(0, 0), t.d / 2 - fig.r - as).divideByCount(
            bar.singleCount
          )
        )
        .spec(bar).count(bar.singleCount)
        .offset(as + fig.h, Side.Right)
        .onlineNote(90)
        .generate()
    );
  }

  protected drawRib(): void {
    const t = this.struct;
    const rebars = this.rebars;
    const bar = rebars.rib;
    const as = rebars.as;
    const fig = this.fig;
    fig.push(
      fig
        .planeRebar()
        .rebar(new Circle(vec(0, 0), t.d / 2 - as - 2 * fig.r))
        .spec(bar).space(bar.space)
        .leaderNote(vec(-t.d / 2 + as + 2 * fig.r + fig.h, 0), vec(1, 0))
        .generate()
    );
  }

  protected drawStir(): void {
    const t = this.struct;
    const rebars = this.rebars;
    const fig = this.fig;
    const as = rebars.as;
    const bar = rebars.stir;
    fig.push(
      fig
        .planeRebar()
        .rebar(new Circle(vec(0, 0), t.d / 2 - as))
        .spec(bar).space(bar.space, bar.denseSpace)
        .leaderNote(vec(-t.d / 2 - fig.h, 0), vec(1, 0))
        .generate()
    );
  }
}
