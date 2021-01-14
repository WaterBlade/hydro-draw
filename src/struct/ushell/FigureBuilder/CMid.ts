import { Line, Polyline, RotateDirection, vec } from "@/draw";
import { FigureBase } from "./Base";

export class CMid extends FigureBase {
  initFigure(): this {
    this.figures.cMid
      .reset(1, 50)
      .setTitle("槽身跨中钢筋图")
      .displayScale()
      .centerAligned()
      .keepTitlePos();
    this.figures.record(this.figures.cMid);
    return this;
  }
  buildOutline(): this {
    const u = this.struct;
    const [transPt0, transPt1] = u.transPt;
    const angle = u.transAngle;

    // 跨中断面轮廓
    this.figures.cMid.addOutline(
      new Polyline(-u.shell.r + u.iBeam.w, u.shell.hd)
        .lineBy(-u.beamWidth, 0)
        .lineBy(0, -u.oBeam.hd)
        .lineBy(u.oBeam.w, -u.oBeam.hs)
        .lineBy(0, -u.oWallH)
        .arcTo(transPt0.x, transPt0.y, angle)
        .lineTo(-u.shell.wb / 2, -u.bottomRadius)
        .lineBy(u.shell.wb, 0)
        .lineTo(transPt1.x, transPt1.y)
        .arcTo(u.shell.r + u.shell.t, 0, angle)
        .lineBy(0, u.oWallH)
        .lineBy(u.oBeam.w, u.oBeam.hs)
        .lineBy(0, u.oBeam.hd)
        .lineBy(-u.beamWidth, 0)
        .lineBy(0, -u.iBeam.hd)
        .lineBy(u.iBeam.w, -u.iBeam.hs)
        .lineBy(0, -u.iWallH)
        .arcBy(-2 * u.shell.r, 0, 180, RotateDirection.clockwise)
        .lineBy(0, u.iWallH)
        .lineBy(u.iBeam.w, u.iBeam.hs)
        .lineBy(0, u.iBeam.hd)
        .close()
        .greyLine(),
      new Line(
        vec(-u.shell.r + u.iBeam.w, u.shell.hd),
        vec(u.shell.r - u.iBeam.w, u.shell.hd)
      ).greyLine(),
      new Line(
        vec(-u.shell.r + u.iBeam.w, u.shell.hd - u.bar.h),
        vec(u.shell.r - u.iBeam.w, u.shell.hd - u.bar.h)
      ).greyLine()
    );
    return this;
  }
  buildDim(): this {
    const u = this.struct;
    const fig = this.figures.cMid;
    const dim = fig.dimBuilder();
    const box = fig.getBoundingBox();
    const transPt = u.transPt[0];
    // Top dim
    dim.hTop(-u.shell.r - u.shell.t - u.oBeam.w, box.top + 2 * fig.textHeight);
    if (u.oBeam.w > 0) dim.dim(u.oBeam.w);
    dim.dim(u.shell.t);
    if (u.iBeam.w > 0) dim.dim(u.iBeam.w);
    dim.dim(2 * u.shell.r - 2 * u.iBeam.w);
    if (u.iBeam.w > 0) dim.dim(u.iBeam.w);
    dim.dim(u.shell.t);
    if (u.oBeam.w > 0) dim.dim(u.oBeam.w);
    dim.next().dim(2 * u.shell.r + 2 * u.shell.t + 2 * u.oBeam.w);
    // right dim
    dim.vRight(box.right + 2 * fig.textHeight, u.shell.hd);
    if (u.iBeam.hd > 0) dim.dim(u.iBeam.hd);
    if (u.iBeam.hs > 0) dim.dim(u.iBeam.hs);
    dim
      .dim(u.shell.hd - u.iBeam.hd - u.iBeam.hs)
      .dim(u.shell.r)
      .dim(u.shell.t + u.shell.hb)
      .next();
    if (u.oBeam.hd > 0) dim.dim(u.oBeam.hd);
    if (u.oBeam.hs > 0) dim.dim(u.oBeam.hs);
    dim
      .dim(u.shell.hd - u.oBeam.hd - u.oBeam.hs)
      .dim(Math.abs(transPt.y))
      .dim(u.shell.r + u.shell.t + u.shell.hb - Math.abs(transPt.y))
      .next()
      .dim(u.shell.hd + u.shell.r + u.shell.t + u.shell.hb);
    // bottom
    dim.hBottom(
      -u.shell.r - u.shell.t - u.oBeam.w,
      box.bottom - 2 * fig.textHeight
    );
    if (u.oBeam.w > 0) dim.dim(u.oBeam.w);
    dim
      .dim(u.shell.r + u.shell.t - Math.abs(transPt.x))
      .dim(Math.abs(transPt.x) - u.shell.wb / 2)
      .dim(u.shell.wb)
      .dim(Math.abs(transPt.x) - u.shell.wb / 2)
      .dim(u.shell.r + u.shell.t - Math.abs(transPt.x));
    if (u.oBeam.w > 0) dim.dim(u.oBeam.w);

    fig.push(dim.generate());
    return this;
  }
}
