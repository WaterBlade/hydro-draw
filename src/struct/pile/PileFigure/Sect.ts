import { Circle, Side, vec } from "@/draw";
import { FigureContent } from "@/struct/utils";
import { Figure } from "../../utils/Figure";
import { PileRebar } from "../PileRebar";
import { PileStruct } from "../PileStruct";

export class Sect extends Figure {
  initFigure(): this {
    this.fig = new FigureContent();
    const { id, title } = this.container.sectId;
    this.fig
      .resetScale(1, 30)
      .setTitle(title)
      .setId(id)
      .displayScale()
      .keepTitlePos()
      .centerAligned();
    this.container.record(this.fig);
    return this;
  }
  build(t: PileStruct, rebars: PileRebar): void {
    this.buildOutline(t);
    this.buildRebar(t, rebars);
    this.buildDim(t);
  }
  buildOutline(t: PileStruct): this {
    const fig = this.fig;
    fig.addOutline(new Circle(vec(0, 0), t.d / 2).greyLine());
    return this;
  }
  buildDim(t: PileStruct): this {
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

  buildRebar(t: PileStruct, rebars: PileRebar): this {
    this.drawMain(t, rebars);
    this.drawRib(t, rebars);
    this.drawStir(t, rebars);
    return this;
  }

  protected drawMain(t: PileStruct, rebars: PileRebar): void {
    const fig = this.fig;
    const bar = rebars.main;
    const as = rebars.info.as;
    fig.push(
      fig
        .circlePointRebar()
        .circle(
          new Circle(vec(0, 0), t.d / 2 - fig.r - as).divideByCount(
            bar.singleCount
          )
        )
        .spec(bar.spec, bar.singleCount)
        .offset(as + fig.h, Side.Right)
        .onlineNote(90)
        .generate()
    );
  }

  protected drawRib(t: PileStruct, rebars: PileRebar): void {
    const bar = rebars.rib;
    const as = rebars.info.as;
    const fig = this.fig;
    fig.push(
      fig
        .planeRebar()
        .rebar(new Circle(vec(0, 0), t.d / 2 - as - 2 * fig.r))
        .spec(bar.spec, 0, bar.space)
        .leaderNote(vec(-t.d / 2 + as + 2 * fig.r + fig.h, 0), vec(1, 0))
        .generate()
    );
  }

  protected drawStir(t: PileStruct, rebars: PileRebar): void {
    const fig = this.fig;
    const as = rebars.info.as;
    const bar = rebars.stir;
    fig.push(
      fig
        .planeRebar()
        .rebar(new Circle(vec(0, 0), t.d / 2 - as))
        .spec(bar.spec, 0, bar.space, bar.denseSpace)
        .leaderNote(vec(-t.d / 2 - fig.h, 0), vec(1, 0))
        .generate()
    );
  }
}
