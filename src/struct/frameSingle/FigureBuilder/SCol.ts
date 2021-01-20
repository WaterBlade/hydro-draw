import { Polyline } from "@/draw";
import { FigureBase } from "../Base";

export class SColFigure extends FigureBase{
  initFigure(): this{
    const fig = this.figures.sCol;
    const {id, title} = this.figures.sectId.gen();
    fig
      .resetScale(1, 20)
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
    const fig = this.figures.sCol;
    fig.addOutline(
      new Polyline(-t.col.w/2, t.col.h/2)
        .lineBy(t.col.w, 0)
        .lineBy(0, -t.col.h)
        .lineBy(-t.col.w, 0)
        .lineBy(0, t.col.h).greyLine()
    );
    return this;
  }
  buildNote(): this{
    return this;
  }
  buildDim(): this{
    const t = this.struct;
    const fig = this.figures.sCol;
    const {right, bottom} = fig.getBoundingBox();
    const dim = fig.dimBuilder();
    dim.vRight(right+fig.h, t.col.h/2).dim(t.col.h);
    dim.hBottom(-t.col.w/2, bottom-fig.h).dim(t.col.w);
    fig.push(dim.generate());
    return this;
  }
}