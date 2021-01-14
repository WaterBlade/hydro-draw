import { Line, polar, Polyline, Side, toDegree, vec, Vector } from "@/draw";

export class UShell {
  len = 0;
  cantLeft = 0;
  cantRight = 0;
  lenTrans = 0;
  spaceBar = 0;

  shell = new Shell(this);
  waterStop = new WaterStop(this);
  iBeam = new TopBeam(this);
  oBeam = new TopBeam(this);
  endSect = new EndSect(this);
  bar = new Bar(this);
  support = new Support(this);
  get shellHeight(): number {
    return this.shell.hd + this.shell.r + this.shell.t + this.shell.hb;
  }
  get endHeight(): number {
    return this.endSect.hd + this.endSect.hs;
  }
  get bottom(): number {
    return -this.shell.r - this.shell.t - this.shell.hb;
  }
  get beamWidth(): number {
    return this.iBeam.w + this.oBeam.w + this.shell.t;
  }
  get transPt(): [Vector, Vector] {
    const r0 = this.shell.r + this.shell.t;
    const angle = this.transAngle;
    return [polar(r0, angle + 180), polar(r0, -angle)];
  }
  get transAngle(): number {
    const d0 = this.shell.wb;
    const r0 = this.shell.r + this.shell.t;
    const r1 = this.shell.r + this.shell.t + this.shell.hb;
    const angle0 = Math.atan((0.5 * d0) / r1);
    const l0 = Math.sqrt(0.25 * d0 ** 2 + r1 ** 2);
    const angle1 = Math.acos(r0 / l0);
    return toDegree(Math.PI / 2 - angle0 - angle1);
  }
  get oWallH(): number {
    return this.shell.hd - this.oBeam.hd - this.oBeam.hs;
  }
  get iWallH(): number {
    return this.shell.hd - this.iBeam.hd - this.iBeam.hs;
  }
  get bottomRadius(): number {
    return this.shell.r + this.shell.t + this.shell.hb;
  }
  isLeftFigureExist(): boolean {
    return this.cantLeft === 0;
  }
  isLeftCantFigureExist(): boolean {
    return this.cantLeft !== 0;
  }
  isRightFigureExist(): boolean {
    return this.cantLeft !== 0 && this.cantRight === 0;
  }
  isRightCantFigureExist(): boolean {
    return (
      this.cantRight !== 0 && Math.abs(this.cantLeft - this.cantRight) > 1e-6
    );
  }
  hasUnCant(): boolean {
    return !this.hasTwoCant();
  }
  hasCant(): boolean {
    return this.cantLeft + this.cantRight > 1e-6;
  }
  hasTwoCant(): boolean {
    return this.cantLeft * this.cantRight > 1e-6;
  }
  hasOneCant(): boolean {
    const r = this.cantRight;
    const l = this.cantLeft;
    return r * l < 1e-6 && r + l > 1e-6;
  }
  hasNoCant(): boolean {
    return this.cantLeft + this.cantRight < 1e-6;
  }

  genLOuterLine(): Polyline {
    const path = new Polyline(-this.len / 2, this.shell.hd).lineBy(this.len, 0);
    const d = this.endHeight - this.shellHeight - this.oBeam.w;
    const l =
      this.len -
      this.cantLeft -
      this.cantRight -
      2 * this.lenTrans -
      2 * this.endSect.b;
    if (this.cantRight > 0) {
      path
        .lineBy(0, -this.shellHeight)
        .lineBy(-this.cantRight + this.lenTrans, 0)
        .lineBy(-this.lenTrans, -this.oBeam.w);
      if (d > 0) path.lineBy(0, -d);
    } else {
      path.lineBy(0, -this.endHeight);
    }
    path.lineBy(-this.endSect.b, 0);
    if (d > 0) path.lineBy(0, d);
    path
      .lineBy(-this.lenTrans, this.oBeam.w)
      .lineBy(-l, 0)
      .lineBy(-this.lenTrans, -this.oBeam.w);
    if (d > 0) path.lineBy(0, -d);
    path.lineBy(-this.endSect.b, 0);
    if (this.cantLeft > 0) {
      if (d > 0) path.lineBy(0, d);
      path
        .lineBy(-this.lenTrans, this.oBeam.w)
        .lineBy(-this.cantLeft + this.lenTrans, 0)
        .lineBy(0, this.shellHeight);
    } else {
      path.lineBy(0, this.endHeight);
    }
    return path;
  }
  genEndCOuterLeft(): Polyline {
    return new Polyline(
      -this.shell.r - this.shell.t - this.oBeam.w,
      this.shell.hd
    )
      .lineBy(0, -this.endSect.hd)
      .lineBy(this.endSect.w, -this.endSect.hs);
  }
  genEndCOuter(): Polyline {
    const path = new Polyline(
      -this.shell.r - this.shell.t - this.oBeam.w,
      this.shell.hd
    );
    path.lineBy(0, -this.endSect.hd).lineBy(this.endSect.w, -this.endSect.hs);
    if (this.support.h > 0) {
      const { w, h } = this.support;
      path
        .lineBy(w, 0)
        .lineBy(h, h)
        .lineBy(
          2 * this.shell.r +
            2 * this.shell.t +
            2 * this.oBeam.w -
            2 * this.endSect.w -
            2 * w -
            2 * h,
          0
        )
        .lineBy(h, -h)
        .lineBy(w, 0);
    } else {
      path.lineBy(
        2 * this.shell.r +
          2 * this.shell.t +
          2 * this.oBeam.w -
          2 * this.endSect.w,
        0
      );
    }
    path.lineBy(this.endSect.w, this.endSect.hs).lineBy(0, this.endSect.hd);

    return path;
  }
  genEndCInnerLeft(): Polyline {
    return new Polyline(-this.shell.r, this.shell.hd)
      .lineBy(0, -this.shell.hd)
      .arcTo(0, -this.shell.r, 90);
  }
  genBarCenters(): Vector[] {
    const x0 = -this.len / 2 + this.waterStop.w + this.bar.w / 2;
    const x1 = this.len / 2 - this.waterStop.w - this.bar.w / 2;
    const y = this.shell.hd - this.bar.h / 2;
    return new Line(vec(x0, y), vec(x1, y)).divide(this.spaceBar).points;
  }
  genCInner(): Polyline {
    const path = new Polyline(-this.shell.r + this.iBeam.w, this.shell.hd);
    if (this.iBeam.w > 0) {
      path.lineBy(0, -this.iBeam.hd).lineBy(-this.iBeam.w, -this.iBeam.hs);
    }
    path
      .lineTo(-this.shell.r, 0)
      .arcTo(this.shell.r, 0, 180)
      .lineTo(this.shell.r, this.shell.hd - this.iBeam.hd - this.iBeam.hs);
    if (this.iBeam.w > 0) {
      path.lineBy(-this.iBeam.w, this.iBeam.hs).lineBy(0, this.iBeam.hd);
    }
    return path;
  }
  genCOuterArc(): Polyline {
    const [transPt0, transPt1] = this.transPt;
    const angle = this.transAngle;
    const path = new Polyline(-this.shell.r - this.shell.t, 0);
    path
      .arcTo(transPt0.x, transPt0.y, angle)
      .lineTo(-this.shell.wb / 2, -this.bottomRadius)
      .lineBy(this.shell.wb, 0)
      .lineTo(transPt1.x, transPt1.y)
      .arcTo(this.shell.r + this.shell.t, 0, angle);
    return path;
  }
  genTransCOuter(): Polyline {
    return this.genCOuterArc().offset(this.oBeam.w, Side.Right);
  }
  genCOuter(): Polyline {
    const [transPt0, transPt1] = this.transPt;
    const angle = this.transAngle;
    const path = new Polyline(-this.shell.r + this.iBeam.w, this.shell.hd);
    path.lineBy(-this.beamWidth, 0);
    if (this.oBeam.w > 0) {
      path.lineBy(0, -this.oBeam.hd).lineBy(this.oBeam.w, -this.oBeam.hs);
    }
    path
      .lineBy(0, -this.oWallH)
      .arcTo(transPt0.x, transPt0.y, angle)
      .lineTo(-this.shell.wb / 2, -this.bottomRadius)
      .lineBy(this.shell.wb, 0)
      .lineTo(transPt1.x, transPt1.y)
      .arcTo(this.shell.r + this.shell.t, 0, angle)
      .lineBy(0, this.oWallH);
    if (this.oBeam.w > 0) {
      path.lineBy(this.oBeam.w, this.oBeam.hs).lineBy(0, this.oBeam.hd);
    }
    path.lineBy(-this.beamWidth, 0);

    return path;
  }
}

class Part<T> {
  constructor(protected parent: T) {}
}

class Shell extends Part<UShell> {
  r = 0;
  t = 0;
  hd = 0;
  hb = 0;
  wb = 0;
  get tb(): number {
    return this.hb + this.t;
  }
}

class EndSect extends Part<UShell> {
  b = 0;
  hd = 0;
  hs = 0;
  w = 0;
}

class TopBeam extends Part<UShell> {
  hd = 0;
  hs = 0;
  w = 0;
}

class WaterStop extends Part<UShell> {
  h = 0;
  w = 0;
}

class Bar extends Part<UShell> {
  h = 0;
  w = 0;
}

class Support extends Part<UShell> {
  h = 0;
  w = 0;
}
