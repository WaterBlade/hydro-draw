import { Line, Polyline, RotateDirection, Side, vec } from "@/draw";
import { FigureConfig } from "@/struct/utils";
import { UShellBasicFigure } from "./UShellFigure";

export class CMid extends UShellBasicFigure {
  protected unitScale = 1;
  protected drawScale = 50;
  protected title = "槽身跨中钢筋图";
  protected config = new FigureConfig(true, true);
  draw(): void {
    this.drawOutline();

    this.drawCInner();
    this.drawCOuter();
    this.drawLInner();
    this.drawLOuter();
    this.drawMain();
    this.drawTopBeam();

    this.drawDim();
  }
  protected drawOutline(): this {
    const u = this.struct;
    const [transPt0, transPt1] = u.transPt;
    const angle = u.transAngle;

    // 跨中断面轮廓
    this.fig.addOutline(
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
  protected drawDim(): this {
    const u = this.struct;
    const fig = this.fig;
    const dim = fig.dimBuilder();
    const box = fig.getBoundingBox();
    const transPt = u.transPt[0];
    // Top dim
    dim.hTop(-u.shell.r - u.shell.t - u.oBeam.w, box.top + 2 * fig.h);
    if (u.oBeam.w > 0) dim.dim(u.oBeam.w);
    dim.dim(u.shell.t);
    if (u.iBeam.w > 0) dim.dim(u.iBeam.w);
    dim.dim(2 * u.shell.r - 2 * u.iBeam.w);
    if (u.iBeam.w > 0) dim.dim(u.iBeam.w);
    dim.dim(u.shell.t);
    if (u.oBeam.w > 0) dim.dim(u.oBeam.w);
    dim.next().dim(2 * u.shell.r + 2 * u.shell.t + 2 * u.oBeam.w);
    // right dim
    dim.vRight(box.right + 2 * fig.h, u.shell.hd);
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
    dim.hBottom(-u.shell.r - u.shell.t - u.oBeam.w, box.bottom - 2 * fig.h);
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
  protected drawCInner(): void {
    const u = this.struct;
    const bar = this.rebars.shell.cInner;
    const fig = this.fig;
    const path = bar.shape();
    const pt = vec(-u.shell.r + 3 * fig.h, u.shell.hd / 5);
    fig.push(
      fig
        .planeRebar()
        .spec(bar)
        .space(bar.space)
        .rebar(path)
        .leaderNote(pt, vec(1, 0))
        .generate()
    );
  }
  protected drawCOuter(): void {
    const u = this.struct;
    const bar = this.rebars.shell.cOuter;
    const fig = this.fig;
    const path = bar.shape();
    const pt = vec(-u.shell.r - u.shell.t - 3 * fig.h, u.shell.hd / 5);
    fig.push(
      fig
        .planeRebar()
        .spec(bar)
        .space(bar.space)
        .rebar(path)
        .leaderNote(pt, vec(1, 0))
        .generate()
    );
  }
  protected drawLInner(): void {
    const u = this.struct;
    const bar = this.rebars.shell.lInner;
    const fig = this.fig;
    const p = bar.pos(fig.r);
    fig.push(
      fig
        .polylinePointRebar()
        .spec(bar)
        .count(bar.count)
        .space(bar.space)
        .polyline(p)
        .offset(2 * fig.h)
        .onlineNote(vec(0, -u.shell.r / 2))
        .generate()
    );
  }
  protected drawLOuter(): void {
    const u = this.struct;
    const bar = this.rebars.shell.lOuter;
    const fig = this.fig;
    const pLeft = bar.pos(fig.r);

    const pRight = pLeft.mirrorByVAxis();
    fig.push(
      fig
        .polylinePointRebar()
        .spec(bar)
        .count(bar.count / 2)
        .space(bar.space)
        .polyline(pLeft)
        .offset(2 * fig.h, Side.Right)
        .onlineNote(vec(-u.shell.r, -u.shell.r / 4))
        .generate(),
      fig
        .polylinePointRebar()
        .spec(bar)
        .count(bar.count / 2)
        .space(bar.space)
        .polyline(pRight)
        .offset(2 * fig.h)
        .onlineNote(vec(u.shell.r, -u.shell.r / 4))
        .generate()
    );
  }
  protected drawMain(): void {
    const u = this.struct;
    const bar = this.rebars.shell.main;
    const fig = this.fig;
    const as = this.rebars.as;
    const y = u.bottom + as + fig.r;
    const left = vec(-u.shell.wb / 2, y);
    const right = vec(u.shell.wb / 2, y);
    const pt = vec(0, y - 2 * fig.h);
    if (bar.layerCount > 1) {
      fig.push(
        fig
          .layerPointRebar()
          .spec(bar)
          .count(bar.count)
          .layers(left, right, bar.singleCount, bar.layerSpace, bar.layerCount)
          .onlineNote(pt, vec(1, 0))
          .generate()
      );
    } else {
      fig.push(
        fig
          .linePointRebar()
          .spec(bar)
          .count(bar.singleCount)
          .line(new Line(left, right).divideByCount(bar.singleCount - 1))
          .onlineNote()
          .generate()
      );
    }
  }
  protected drawTopBeam(): void {
    const u = this.struct;
    const bar = this.rebars.shell.topBeam;
    const fig = this.fig;
    const pLeft = bar.shape();
    const pRight = pLeft.mirrorByVAxis();
    const ptLeft = vec(
      -u.shell.r + u.iBeam.w + 1.5 * fig.h,
      u.shell.hd + 2 * fig.h
    );
    const ptRight = ptLeft.mirrorByVAxis();
    fig.push(
      fig
        .planeRebar()
        .spec(bar)
        .space(bar.space)
        .rebar(pLeft)
        .leaderNote(ptLeft, vec(1, 1), vec(1, 0))
        .generate(),
      fig
        .planeRebar()
        .spec(bar)
        .space(bar.space)
        .rebar(pRight)
        .leaderNote(ptRight, vec(1, -1), vec(-1, 0))
        .generate()
    );
  }
}
