import { Line, Polyline, RotateDirection, Side, vec } from "@/draw";
import { Figure, FigureContent } from "@/struct/utils";
import { UShellRebar } from "../UShellRebar";
import { UShellStruct } from "../UShellStruct";

export class CMid extends Figure {
  initFigure(): void {
    this.fig = new FigureContent();
    this.fig
      .resetScale(1, 50)
      .setTitle("槽身跨中钢筋图")
      .displayScale()
      .centerAligned()
      .keepTitlePos();
    this.container.record(this.fig);
  }
  build(u: UShellStruct, rebars: UShellRebar): void {
    this.buildOutline(u);
    this.buildRebar(u, rebars);
    this.buildDim(u);
  }
  protected buildOutline(u: UShellStruct): this {
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
  protected buildRebar(u: UShellStruct, rebars: UShellRebar): void {
    this.drawCInner(u, rebars);
    this.drawCOuter(u, rebars);
    this.drawLInner(u, rebars);
    this.drawLOuter(u, rebars);
    this.drawMain(u, rebars);
    this.drawTopBeam(u, rebars);
  }
  protected buildDim(u: UShellStruct): this {
    const fig = this.fig;
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
  protected drawCInner(u: UShellStruct, rebars: UShellRebar): void {
    const bar = rebars.shell.cInner;
    const fig = this.fig;
    const as = rebars.info.as;
    const path = bar.shape(u)
      .offset(as, Side.Right)
      .removeStart()
      .removeEnd();
    const pt = vec(-u.shell.r + 3 * fig.textHeight, u.shell.hd / 5);
    fig.push(
      fig
        .planeRebar()
        .spec(bar.spec, 0, bar.space)
        .rebar(path)
        .leaderNote(pt, vec(1, 0))
        .generate()
    );
  }
  protected drawCOuter(u: UShellStruct, rebars: UShellRebar): void {
    const bar = rebars.shell.cOuter;
    const as = rebars.info.as;
    const fig = this.fig;
    const path = bar.shape(u).offset(as).removeStart().removeEnd();
    const pt = vec(-u.shell.r - u.shell.t - 3 * fig.textHeight, u.shell.hd / 5);
    fig.push(
      fig
        .planeRebar()
        .spec(bar.spec, 0, bar.space)
        .rebar(path)
        .leaderNote(pt, vec(1, 0))
        .generate()
    );
  }
  protected drawLInner(u: UShellStruct, rebars: UShellRebar): void {
    const bar = rebars.shell.lInner;
    const as = rebars.info.as;
    const fig = this.fig;
    const p = bar.pos(u)
      .offset(as + fig.drawRadius, Side.Right)
      .removeStart()
      .removeEnd()
      .divide(bar.space);
    fig.push(
      fig
        .polylinePointRebar()
        .spec(bar.spec, bar.spec.count, bar.space)
        .polyline(p)
        .offset(2 * fig.textHeight)
        .onlineNote(vec(0, -u.shell.r / 2))
        .generate()
    );
  }
  protected drawLOuter(u: UShellStruct, rebars: UShellRebar): void {
    const bar = rebars.shell.lOuter;
    const fig = this.fig;
    const as = rebars.info.as;
    const pLeft = bar.pos(u, as + fig.r);

    const pRight = pLeft.mirrorByVAxis();
    fig.push(
      fig
        .polylinePointRebar()
        .spec(bar.spec, bar.spec.count / 2, bar.space)
        .polyline(pLeft)
        .offset(2 * fig.textHeight, Side.Right)
        .onlineNote(vec(-u.shell.r, -u.shell.r / 4))
        .generate(),
      fig
        .polylinePointRebar()
        .spec(bar.spec, bar.spec.count / 2, bar.space)
        .polyline(pRight)
        .offset(2 * fig.textHeight)
        .onlineNote(vec(u.shell.r, -u.shell.r / 4))
        .generate()
    );
  }
  protected drawMain(u: UShellStruct, rebars: UShellRebar): void {
    const bar = rebars.shell.main;
    const fig = this.fig;
    const as = rebars.info.as;
    const y = u.bottom + as + fig.drawRadius;
    const left = vec(-u.shell.wb / 2, y);
    const right = vec(u.shell.wb / 2, y);
    const pt = vec(0, y - 2 * fig.textHeight);
    if (bar.layerCount > 1) {
      fig.push(
        fig
          .layerPointRebar()
          .spec(bar.spec, bar.spec.count)
          .layers(left, right, bar.singleCount, bar.layerSpace, bar.layerCount)
          .onlineNote(pt, vec(1, 0))
          .generate()
      );
    } else {
      fig.push(
        fig
          .linePointRebar()
          .spec(bar.spec, bar.singleCount)
          .line(new Line(left, right).divideByCount(bar.singleCount- 1))
          .onlineNote()
          .generate()
      );
    }
  }
  protected drawTopBeam(u: UShellStruct, rebars: UShellRebar): void {
    const bar = rebars.shell.topBeam;
    const fig = this.fig;
    const as = rebars.info.as;
    const pLeft = bar.shape(u)
      .offset(as, Side.Right)
      .removeStart()
      .removeEnd();
    const pRight = pLeft.mirrorByVAxis();
    const ptLeft = vec(
      -u.shell.r + u.iBeam.w + 1.5 * fig.textHeight,
      u.shell.hd + 2 * fig.textHeight
    );
    const ptRight = ptLeft.mirrorByVAxis();
    fig.push(
      fig
        .planeRebar()
        .spec(bar.spec, 0, bar.space)
        .rebar(pLeft)
        .leaderNote(ptLeft, vec(1, 1), vec(1, 0))
        .generate(),
      fig
        .planeRebar()
        .spec(bar.spec, 0, bar.space)
        .rebar(pRight)
        .leaderNote(ptRight, vec(1, -1), vec(-1, 0))
        .generate()
    );
  }
}
