import { Line, Polyline, RotateDirection, Side, vec } from "@/draw";
import { UShell } from "./UShell";
import { UShellFigure } from "./UShellFigure";

export class OutlineBuilder {
  constructor(protected struct: UShell, protected figures: UShellFigure) {}
  build(): this {
    this.drawLOuter();
    this.drawLInner();
    this.drawCMid();
    this.drawCEnd();
    this.drawSEndBeam();
    this.drawSEndWall();
    this.drawSBar();
    return this;
  }
  protected drawLOuter(): void {
    this.figures.lOuter.push(this.struct.genLOuterLine().greyLine());
  }
  protected drawLInner(): void {
    const u = this.struct;
    const fig = this.figures.lInner;
    fig.push(this.struct.genLOuterLine().greyLine());
    const left = new Polyline(-u.len / 2 + u.waterStop.w, u.hd)
      .lineBy(0, -u.hd - u.r - u.waterStop.h)
      .lineBy(-u.waterStop.w, 0);
    const right = left.mirrorByYAxis();
    fig.push(
      new Line(
        vec(-u.len / 2 + u.waterStop.w, -u.r),
        vec(u.len / 2 - u.waterStop.w, -u.r)
      ).greyLine(),
      left.greyLine(),
      right.greyLine()
    );
    if (u.support.h > 0) {
      const y = u.hd - u.endHeight + u.support.h;
      fig.push(
        new Line(
          vec(-u.len / 2 + u.cantLeft, y),
          vec(-u.len / 2 + u.cantLeft + u.endSect.b, y)
        ).greyLine(),
        new Line(
          vec(u.len / 2 - u.cantRight, y),
          vec(u.len / 2 - u.cantRight - u.endSect.b, y)
        ).greyLine()
      );
    }
    const pts = u.genBarCenters();
    const {w, h} = u.bar;
    for(const p of pts){
      const {x, y} = p;
      fig.push(new Polyline(x-w/2, y + h/2).lineBy(w, 0).lineBy(0, -h).lineBy(-w, 0).lineBy(0, h).greyLine());
    }
  }
  protected drawCMid(): void {
    const u = this.struct;
    const [transPt0, transPt1] = u.transPt;
    const angle = u.transAngle;

    // 跨中断面轮廓
    this.figures.cMid.push(
      new Polyline(-u.r + u.iBeam.w, u.hd)
        .lineBy(-u.beamWidth, 0)
        .lineBy(0, -u.oBeam.hd)
        .lineBy(u.oBeam.w, -u.oBeam.hs)
        .lineBy(0, -u.oWallH)
        .arcTo(transPt0.x, transPt0.y, angle)
        .lineTo(-u.butt.w / 2, -u.bottomRadius)
        .lineBy(u.butt.w, 0)
        .lineTo(transPt1.x, transPt1.y)
        .arcTo(u.r + u.t, 0, angle)
        .lineBy(0, u.oWallH)
        .lineBy(u.oBeam.w, u.oBeam.hs)
        .lineBy(0, u.oBeam.hd)
        .lineBy(-u.beamWidth, 0)
        .lineBy(0, -u.iBeam.hd)
        .lineBy(u.iBeam.w, -u.iBeam.hs)
        .lineBy(0, -u.iWallH)
        .arcBy(-2 * u.r, 0, 180, RotateDirection.clockwise)
        .lineBy(0, u.iWallH)
        .lineBy(u.iBeam.w, u.iBeam.hs)
        .lineBy(0, u.iBeam.hd)
        .close()
        .greyLine()
    );
  }
  protected drawCEnd(): void {
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

    this.figures.cEnd.push(
      path.greyLine(),
      inner.offset(u.waterStop.h, Side.Right).greyLine()
    );
  }
  protected drawSEndBeam(): void{
    const u = this.struct;
    const fig = this.figures.sEndBeam;
    const right = u.endSect.b + u.trans + 1.25*(u.t + u.butt.h);
    const h = u.endHeight - u.r - u.hd;
    fig.push(
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
      fig.push(
        new Line(vec(0, y), vec(u.endSect.b, y)).greyLine()
      );
    }
  }
  protected drawSEndWall(): void{
    const u = this.struct;
    const fig = this.figures.sEndWall;
    const right = u.endSect.b + u.trans + 1.25 * u.t;
    const h = u.t + u.oBeam.w;
    fig.push(
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
  }
  protected drawSBar(): void{
    const u = this.struct;
    const fig = this.figures.sBar;
    const {w, h} = u.bar;
    fig.push(
      new Polyline(-w/2, h/2).lineBy(w, 0).lineBy(0, -h).lineBy(-w, 0).lineBy(0, h).greyLine()
    );
  }
}
