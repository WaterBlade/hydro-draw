import { Line, Polyline, Side, vec } from "@/draw";
import { FigureBase } from "./Base";

export class CEnd extends FigureBase{
  initFigure(): this{
    this.figures.cEnd.reset(1, 50)
      .setTitle("槽身端肋钢筋图")
      .displayScale()
      .centerAligned()
      .keepTitlePos();
    this.figures.record(this.figures.cEnd);
    return this;
  }
  buildOutline(): this{
    const u = this.struct;
    const path = new Polyline(-u.r - u.t - u.oBeam.w, u.hd).lineBy(
      u.beamWidth,
      0
    );
    if (u.iBeam.w > 0) {
      path.lineBy(0, -u.iBeam.hd).lineBy(-u.iBeam.w, -u.iBeam.hs);
    }
    path.lineTo(-u.r, 0).arcTo(u.r, 0, 180);
    if (u.iBeam.w > 0) {
      path
        .lineBy(0, u.hd - u.iBeam.hd - u.iBeam.hs)
        .lineBy(-u.iBeam.w, u.iBeam.hs)
        .lineBy(0, u.iBeam.hd);
    } else {
      path.lineBy(0, u.hd);
    }
    path
      .lineBy(u.beamWidth, 0)
      .lineBy(0, -u.endSect.hd)
      .lineBy(-u.endSect.w, -u.endSect.hs);
    if (u.support.w > 0) {
      path.lineBy(-u.support.w, 0).lineBy(-u.support.h, u.support.h);
    }
    const l =
      2 * u.oBeam.w +
      2 * u.r +
      2 * u.t -
      2 * u.endSect.w -
      2 * u.support.w -
      2 * u.support.h;
    path.lineBy(-l, 0);
    if (u.support.w > 0) {
      path.lineBy(-u.support.h, -u.support.h).lineBy(-u.support.w, 0);
    }
    path.lineBy(-u.endSect.w, u.endSect.hs).lineBy(0, u.endSect.hd);

    const inner = new Polyline(-u.r + u.iBeam.w, u.hd);
    if (u.iBeam.w > 0) {
      inner.lineBy(0, -u.iBeam.hd).lineBy(-u.iBeam.w, -u.iBeam.hs);
    }
    inner
      .lineTo(-u.r, 0)
      .arcTo(u.r, 0, 180)
      .lineBy(0, u.hd - u.iBeam.hs - u.iBeam.hd);
    if (u.iBeam.w > 0) {
      inner.lineBy(-u.iBeam.w, u.iBeam.hs).lineBy(0, u.iBeam.hd);
    }

    this.figures.cEnd.addOutline(
      path.greyLine(),
      inner.offset(u.waterStop.h, Side.Right).greyLine(),
      new Line(vec(-u.r + u.iBeam.w, u.hd), vec(u.r - u.iBeam.w, u.hd)),
      new Line(vec(-u.r + u.iBeam.w, u.hd-u.bar.h), vec(u.r - u.iBeam.w, u.hd - u.bar.h)),
    );
    return this;
  }
  buildDim(): this{
    const u = this.struct;
    const fig = this.figures.cEnd;
    const box = fig.getBoundingBox();
    const dim = fig.dimBuilder();
    dim
      .hTop(-u.r - u.t - u.oBeam.w, box.top + 2 * fig.textHeight)
      .dim(u.oBeam.w + u.t);
    if (u.iBeam.w > 0) dim.dim(u.iBeam.w);
    dim.dim(2 * u.r - 2 * u.iBeam.w);
    if (u.iBeam.w > 0) dim.dim(u.iBeam.w);
    dim
      .dim(u.oBeam.w + u.t)
      .next()
      .dim(2 * u.oBeam.w + 2 * u.t + 2 * u.r);

    dim.vRight(box.right + 2 * fig.textHeight, u.hd);
    if (u.iBeam.hd > 0) dim.dim(u.iBeam.hd);
    if (u.iBeam.hs > 0) dim.dim(u.iBeam.hs);
    dim
      .dim(u.hd - u.iBeam.hd - u.iBeam.hs)
      .dim(u.r)
      .dim(u.endSect.hd + u.endSect.hs - u.hd - u.r - u.support.h);
    if (u.support.h > 0) dim.dim(u.support.h);
    dim
      .next()
      .dim(u.endSect.hd)
      .dim(u.endSect.hs)
      .next()
      .dim(u.endSect.hd + u.endSect.hs);

    dim
      .hBottom(-u.r - u.t - u.oBeam.w, box.bottom - 2 * fig.textHeight)
      .dim(u.endSect.w);
    if (u.support.h > 0) {
      dim.dim(u.support.w).dim(u.support.h);
    }
    const l =
      2 * u.oBeam.w +
      2 * u.r +
      2 * u.t -
      2 * u.endSect.w -
      2 * u.support.w -
      2 * u.support.h;
    dim.dim(l);
    if (u.support.h > 0) {
      dim.dim(u.support.h).dim(u.support.w);
    }
    dim.dim(u.endSect.w);

    fig.push(dim.generate());
    return this;
  }
}