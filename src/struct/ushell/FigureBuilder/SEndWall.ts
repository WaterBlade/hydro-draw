import { Polyline } from "@/draw";
import { FigureBase } from "./Base";

export class SEndWall extends FigureBase{
  initFigure(): this{
    this.figures.sEndWall.reset(1, 25)
      .setTitle('Ⅰ--Ⅰ')
      .displayScale();
    this.figures.record(this.figures.sEndWall);
    return this;
  }
  buildOutline(): this{
    const u = this.struct;
    const fig = this.figures.sEndWall;
    const right = u.endSect.b + u.trans + 1.25 * u.t;
    const h = u.t + u.oBeam.w;
    fig.addOutline(
      new Polyline(0, -u.waterStop.h)
        .lineBy(u.waterStop.w, 0)
        .lineBy(0, u.waterStop.h)
        .lineTo(right, 0).greyLine(),
      new Polyline(0, -u.waterStop.h)
        .lineBy(0, -h+u.waterStop.h)
        .lineBy(u.endSect.b, 0)
        .lineBy(u.trans, u.oBeam.w)
        .lineTo(right, -u.t).greyLine()
    )
    return this;
  }
  buildDim(): this{
    const u = this.struct;
    const fig = this.figures.sEndWall;
    const box = fig.getBoundingBox();
    
    const dim = fig.dimBuilder();

    dim.hBottom(0, box.bottom-2*fig.textHeight)
      .dim(u.endSect.b).dim(u.trans)

    dim.vRight(box.right + 2*fig.textHeight, 0)
      .dim(u.t).dim(u.oBeam.w)
    
    fig.push(dim.generate());
    return this;
  }
}