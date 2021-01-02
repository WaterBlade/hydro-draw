import { polar, Polyline, toDegree, Vector } from "@/draw";

export class UShell {
  r = 0;
  t = 0;
  hd = 0;
  len = 0;
  denseL = 0;
  cantLeft = 0;
  cantRight = 0;
  as = 0;
  trans = 0;
  waterStop = {
    w: 0,
    h: 0,
  };
  butt = {
    h: 0,
    w: 0,
  };
  iBeam = {
    w: 0,
    hd: 0,
    hs: 0,
  };
  oBeam = {
    w: 0,
    hd: 0,
    hs: 0,
  };
  endSect = {
    w: 0,
    b: 0,
    hd: 0,
    hs: 0,
  };
  bar = {
    h: 0,
    w: 0,
    s: 0,
  };
  support = {
    w: 0,
    h: 0,
  };
  get shellHeight(): number {
    return this.hd + this.r + this.t + this.butt.h;
  }
  get endHeight(): number {
    return this.endSect.hd + this.endSect.hs;
  }
  get bottom(): number {
    return -this.r - this.t - this.butt.h;
  }
  get beamWidth(): number {
    return this.iBeam.w + this.oBeam.w + this.t;
  }
  get transPt(): [Vector, Vector] {
    const r0 = this.r + this.t;
    const angle = this.transAngle;
    return [polar(r0, angle + 180), polar(r0, -angle)];
  }
  get transAngle(): number {
    const d0 = this.butt.w;
    const r0 = this.r + this.t;
    const r1 = this.r + this.t + this.butt.h;
    const angle0 = Math.atan((0.5 * d0) / r1);
    const l0 = Math.sqrt(0.25 * d0 ** 2 + r1 ** 2);
    const angle1 = Math.acos(r0 / l0);
    return toDegree(Math.PI / 2 - angle0 - angle1);
  }
  get oWallH(): number {
    return this.hd - this.oBeam.hd - this.oBeam.hs;
  }
  get iWallH(): number {
    return this.hd - this.iBeam.hd - this.iBeam.hs;
  }
  get bottomRadius(): number {
    return this.r + this.t + this.butt.h;
  }
  genLOuterLine(): Polyline {
    const path = new Polyline(-this.len / 2, this.hd).lineBy(this.len, 0);
    const d = this.endHeight - this.shellHeight - this.oBeam.w;
    const l =
      this.len -
      this.cantLeft -
      this.cantRight -
      2 * this.trans -
      2 * this.endSect.b;
    if (this.cantRight > 0) {
      path
        .lineBy(0, -this.shellHeight)
        .lineBy(-this.cantRight + this.trans, 0)
        .lineBy(-this.trans, -this.oBeam.w);
      if (d > 0) path.lineBy(0, -d);
    } else {
      path.lineBy(0, -this.endHeight);
    }
    path.lineBy(-this.endSect.b, 0);
    if (d > 0) path.lineBy(0, d);
    path
      .lineBy(-this.trans, this.oBeam.w)
      .lineBy(-l, 0)
      .lineBy(-this.trans, -this.oBeam.w);
    if (d > 0) path.lineBy(0, -d);
    path.lineBy(-this.endSect.b, 0);
    if (this.cantLeft > 0) {
      if (d > 0) path.lineBy(0, d);
      path
        .lineBy(-this.trans, this.oBeam.w)
        .lineBy(-this.cantLeft + this.trans, 0)
        .lineBy(0, this.shellHeight);
    } else {
      path.lineBy(0, this.endHeight);
    }
    return path;
  }
  genEndLeftOutline(): Polyline {
    return new Polyline(-this.r - this.t - this.oBeam.w, this.hd)
      .lineBy(0, -this.endSect.hd)
      .lineBy(this.endSect.w, -this.endSect.hs);
  }
  genLeftInnerOutline(): Polyline {
    return new Polyline(-this.r, this.hd)
      .lineBy(0, -this.hd)
      .arcTo(0, -this.r, 90);
  }
}
