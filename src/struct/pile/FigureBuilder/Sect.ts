import { Circle, Side, vec } from "@/draw";
import { PileFigureContext } from "../Pile";

export class Sect extends PileFigureContext{
  initFigure(): this {
    const fig = this.figures.sect;
    const { id, title } = this.figures.sectId.gen();
    fig
      .resetScale(1, 30)
      .setTitle(title)
      .setId(id)
      .displayScale()
      .keepTitlePos()
      .centerAligned();
    this.figures.record(fig);
    return this;
  }
  build(): void {
    this.buildOutline();
    this.buildRebar();
    this.buildDim();
  }
  buildOutline(): this {
    const t = this.struct;
    const fig = this.figures.sect;
    fig.addOutline(new Circle(vec(0, 0), t.d / 2).greyLine());
    return this;
  }
  buildDim(): this {
    const t = this.struct;
    const fig = this.figures.sect;
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

  buildRebar(): this {
    this.drawMain();
    this.drawRib();
    this.drawStir();
    return this;
  }

  protected drawMain(): void {
    const fig = this.figures.sect;
    const bar = this.rebars.main;
    const as = this.rebars.as;
    const t = this.struct;
    fig.push(
      fig
        .circlePointRebar()
        .circle(
          new Circle(vec(0, 0), t.d / 2 - fig.r - as).divideByCount(
            bar.singleCount
          )
        )
        .spec(bar, bar.singleCount)
        .offset(as + fig.h, Side.Right)
        .onlineNote(90)
        .generate()
    );
  }

  protected drawRib(): void {
    const bar = this.rebars.rib;
    const as = this.rebars.as;
    const t = this.struct;
    const fig = this.figures.sect;
    fig.push(
      fig
        .planeRebar()
        .rebar(new Circle(vec(0, 0), t.d / 2 - as - 2 * fig.r))
        .spec(bar, 0, bar.space)
        .leaderNote(vec(-t.d / 2 + as + 2 * fig.r + fig.h, 0), vec(1, 0))
        .generate()
    );
  }

  protected drawStir(): void {
    const t = this.struct;
    const fig = this.figures.sect;
    const as = this.rebars.as;
    const bar = this.rebars.stir;
    fig.push(
      fig
        .planeRebar()
        .rebar(new Circle(vec(0, 0), t.d / 2 - as))
        .spec(bar, 0, bar.space, bar.denseSpace)
        .leaderNote(vec(-t.d / 2 - fig.h, 0), vec(1, 0))
        .generate()
    );
  }
}
