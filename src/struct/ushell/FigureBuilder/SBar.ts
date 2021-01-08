import { Polyline } from "@/draw";
import { FigureBase } from "./Base";

export class SBar extends FigureBase{
  initFigure(): this{
    this.figures.sBar.reset(1, 10)
      .setTitle('大样B')
      .displayScale()
      .centerAligned()
      .keepTitlePos();
    this.figures.record(this.figures.sBar);
    return this;
  }
  buildOutline(): this{
    const u = this.struct;
    const fig = this.figures.sBar;
    const {w, h} = u.bar;
    fig.addOutline(
      new Polyline(-w/2, h/2).lineBy(w, 0).lineBy(0, -h).lineBy(-w, 0).lineBy(0, h).greyLine()
    );
    return this;
  }
  buildDim(): this{
    const u = this.struct;
    const fig = this.figures.sBar;
    const box = fig.getBoundingBox();
    const dim = fig.dimBuilder();

    dim.hBottom(-u.bar.w/2, box.bottom - 2*fig.textHeight).dim(u.bar.w);
    dim.vRight(box.right + 2*fig.textHeight, u.bar.h/2).dim(u.bar.h);

    fig.push(dim.generate());
    return this;
  }
}