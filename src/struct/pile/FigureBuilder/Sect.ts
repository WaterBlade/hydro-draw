import { Circle, vec } from "@/draw";
import { FigureBase } from "../Base";

export class Sect extends FigureBase{
  initFigure(): this{
    const fig = this.figures.sect;
    const {id, title} = this.figures.sectId.gen();
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
  buildOutline(): this{
    const t = this.struct;
    const fig = this.figures.sect;
    fig.addOutline(
      new Circle(vec(0, 0), t.d/2).greyLine()
    )
    return this;
  }
  buildDim(): this{
    return this;
  }
}