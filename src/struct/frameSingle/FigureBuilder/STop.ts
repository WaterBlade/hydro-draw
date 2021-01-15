import { Polyline } from "@/draw";
import { FigureBase } from "../Base";

export class STopFigure extends FigureBase{
  initFigure(): this{
    const fig = this.figures.sTop;
    const {id, title} = this.figures.sectId.gen();
    fig
      .resetScale(1, 20)
      .setTitle(title)
      .setId(id)
      .keepTitlePos()
      .centerAligned();

    this.figures.record(fig);
    return this;
  }
  buildOutline(): this{
    const t = this.struct;
    const fig = this.figures.sTop;
    fig.addOutline(
      new Polyline(-t.topBeam.w/2, t.topBeam.h/2)
        .lineBy(t.topBeam.w, 0)
        .lineBy(0, -t.topBeam.h)
        .lineBy(-t.topBeam.w, 0)
        .lineBy(0, t.topBeam.h).greyLine()
    );
    return this;
  }
  buildNote(): this{
    return this;
  }
  buildDim(): this{
    const t = this.struct;
    const fig = this.figures.sTop;
    const {right, bottom} = fig.getBoundingBox();
    const dim = fig.dimBuilder();
    dim.vRight(right+fig.h, t.topBeam.h/2).dim(t.topBeam.h);
    dim.hBottom(-t.topBeam.w/2, bottom-fig.h).dim(t.topBeam.w);
    fig.push(dim.generate());
    return this;
  }
}