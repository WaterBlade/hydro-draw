import { Line, Polyline, Side, vec } from "@/draw";
import { UShellStruct } from "../UShellStruct";
import { UShellRebar } from "../UShellRebar";

export class PosShell {
  constructor(protected struct: UShellStruct, protected rebars: UShellRebar) {}
  cInner(offsetDist?: number): Line[] {
    const u = this.struct;
    const bar = this.rebars.shell.cInner;
    const as = this.rebars.as;
    const res: Line[] = [];
    const y = -u.shell.r;
    const midLeft = -u.len / 2 + u.cantLeft + this.rebars.denseL;
    const midRight = u.len / 2 - u.cantRight - this.rebars.denseL;

    let left: number;
    if (u.cantLeft > 0) {
      left = -u.len / 2 + u.waterStop.w + as;
    } else {
      left = -u.len / 2 + u.endSect.b;
    }
    let right: number;
    if (u.cantRight > 0) {
      right = u.len / 2 - u.waterStop.w - as;
    } else {
      right = u.len / 2 - u.endSect.b;
    }

    const dist = offsetDist ? offsetDist : as;

    res.push(
      new Line(vec(left, y), vec(midLeft, y))
        .offset(dist, Side.Right)
        .divide(bar.denseSpace),
      new Line(vec(midLeft, y), vec(midRight, y))
        .offset(dist, Side.Right)
        .divide(bar.space)
        .removeStartPt()
        .removeEndPt(),
      new Line(vec(midRight, y), vec(right, y))
        .offset(dist, Side.Right)
        .divide(bar.denseSpace)
    );
    if (u.cantLeft === 0) res[0].removeStartPt();
    if (u.cantRight === 0) res[2].removeEndPt();
    return res;
  }
  cOuter(offsetDist?: number): Line[] {
    const res: Line[] = [];
    const u = this.struct;
    const bar = this.rebars.shell.cOuter;
    const as = this.rebars.as;
    const y = -u.shell.r - u.shell.t - u.shell.hb;
    const endLeft = -u.len / 2 + u.cantLeft + u.endSect.b;
    const endRight = u.len / 2 - u.cantRight - u.endSect.b;
    const left = -u.len / 2 + u.cantLeft + this.rebars.denseL;
    const right = u.len / 2 - u.cantRight - this.rebars.denseL;

    const dist = offsetDist ? offsetDist : as;

    if (u.cantLeft > 0) {
      res.push(
        new Line(vec(-u.len / 2 + as, y), vec(-u.len / 2 + u.cantLeft, y))
          .offset(dist)
          .divide(bar.denseSpace)
          .removeEndPt()
      );
    }
    res.push(
      new Line(vec(endLeft, y), vec(left, y))
        .offset(dist)
        .divide(bar.denseSpace)
        .removeStartPt(),
      new Line(vec(left, y), vec(right, y))
        .offset(dist)
        .divide(bar.space)
        .removeStartPt()
        .removeEndPt(),
      new Line(vec(right, y), vec(endRight, y))
        .offset(dist)
        .divide(bar.denseSpace)
        .removeEndPt()
    );
    if (u.cantRight > 0) {
      res.push(
        new Line(vec(u.len / 2 - u.cantRight, y), vec(u.len / 2 - as, y))
          .offset(dist)
          .divide(bar.denseSpace)
          .removeStartPt()
      );
    }
    return res;
  }
  lInner(): Polyline {
    const u = this.struct;
    const path = new Polyline(-u.shell.r - u.shell.t, u.shell.hd).lineBy(
      u.shell.t + u.iBeam.w,
      0
    );
    if (u.iBeam.w !== 0) {
      path
        .lineBy(0, -u.iBeam.hd)
        .lineBy(-u.iBeam.w, -u.iBeam.hs)
        .lineBy(0, -u.shell.hd + u.iBeam.hd + u.iBeam.hs);
    } else {
      path.lineBy(0, -u.shell.hd);
    }
    path.arcBy(2 * u.shell.r, 0, 180);
    if (u.iBeam.w !== 0) {
      path
        .lineBy(0, u.shell.hd - u.iBeam.hd - u.iBeam.hs)
        .lineBy(-u.iBeam.w, u.iBeam.hs)
        .lineBy(0, u.iBeam.hd);
    } else {
      path.lineBy(0, -u.shell.hd);
    }
    path.lineBy(u.iBeam.w + u.shell.t, 0);
    return path;
  }
  lOuter(offsetDist?: number): Polyline {
    const u = this.struct;
    const bar = this.rebars.shell.lOuter;
    const as = this.rebars.as;
    const dist = offsetDist ? offsetDist : as;
    const path = new Polyline(-u.shell.r + u.iBeam.w, u.shell.hd - 1)
      .lineBy(0, 1)
      .lineBy(-u.beamWidth, 0);
    if (u.oBeam.w > 0) {
      path
        .lineBy(0, -u.oBeam.hd)
        .lineBy(u.oBeam.w, -u.oBeam.hs)
        .lineBy(0, -u.shell.hd + u.oBeam.hd + u.oBeam.hs);
    } else {
      path.lineBy(0, -u.shell.hd);
    }
    const leftPt = u.transPt[0];
    const angle = u.transAngle;
    return path
      .arcTo(leftPt.x, leftPt.y, angle)
      .lineTo(-u.shell.wb / 2, u.bottom)
      .lineTo(1, 0)
      .offset(dist)
      .removeStart()
      .removeEnd()
      .divide(bar.space)
      .removeBothPt();
  }
}
