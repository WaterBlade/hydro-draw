import { Polyline } from "@/draw";
import { FigureBase } from "../Base";

export class SBeamFigure extends FigureBase {
  initFigure(): this {
    const fig = this.figures.sBeam;
    const { id, title } = this.figures.sectId.gen();
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
  buildOutline(): this {
    const t = this.struct;
    const fig = this.figures.sBeam;
    fig.addOutline(
      new Polyline(-t.beam.w / 2, t.beam.h / 2)
        .lineBy(t.beam.w, 0)
        .lineBy(0, -t.beam.h)
        .lineBy(-t.beam.w, 0)
        .lineBy(0, t.beam.h)
        .greyLine()
    );
    return this;
  }
  buildNote(): this {
    return this;
  }
  buildDim(): this {
    const t = this.struct;
    const fig = this.figures.sBeam;
    const { right, bottom } = fig.getBoundingBox();
    const dim = fig.dimBuilder();
    dim.vRight(right + fig.h, t.beam.h / 2).dim(t.beam.h);
    dim.hBottom(-t.beam.w / 2, bottom - fig.h).dim(t.beam.w);
    fig.push(dim.generate());
    return this;
  }
}
