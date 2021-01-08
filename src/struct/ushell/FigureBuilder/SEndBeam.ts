import { Line, Polyline, vec } from "@/draw";
import { FigureBase } from "./Base";

export class SEndBeam extends FigureBase{
  initFigure(): this{
    this.figures.sEndBeam.reset(1, 25)
      .setTitle('大样A')
      .displayScale();
    this.figures.record(this.figures.sEndBeam);
    return this;
  }
  buildOutline(): this{
    const u = this.struct;
    const fig = this.figures.sEndBeam;
    const right = u.endSect.b + u.trans + 1.25*(u.t + u.butt.h);
    const h = u.endHeight - u.r - u.hd;
    fig.addOutline(
      new Polyline(0, -u.waterStop.h)
        .lineBy(u.waterStop.w, 0)
        .lineBy(0, u.waterStop.h)
        .lineTo(right, 0).greyLine(),
      new Polyline(0, -u.waterStop.h)
        .lineBy(0, -(h - u.waterStop.h))
        .lineBy(u.endSect.b, 0)
        .lineBy(0, h - u.t - u.butt.h - u.oBeam.w)
        .lineBy(u.trans, u.oBeam.w)
        .lineTo(right, -u.t-u.butt.h).greyLine()
    )
    if(u.support.h > 0){
      const y = -h + u.support.h;
      fig.addOutline(
        new Line(vec(0, y), vec(u.endSect.b, y)).greyLine()
      );
    }
    return this;
  }
  buildDim(): this{
    const u = this.struct;
    const fig = this.figures.sEndBeam;
    const box = fig.getBoundingBox();
    
    const dim = fig.dimBuilder();

    dim.hBottom(0, box.bottom-2*fig.textHeight)
      .dim(u.endSect.b).dim(u.trans)

    dim.vRight(box.right + 2*fig.textHeight, 0)
      .dim(u.t + u.butt.h).dim(u.oBeam.w)
      .dim(u.endHeight - u.shellHeight - u.oBeam.w - u.support.h)
    
    if(u.support.h > 0){
      dim.dim(u.support.h);
    }
    fig.push(dim.generate());
    return this;
  }
}