import { Line, polar, Polyline, Side, toDegree, vec, Vector } from "@/draw";

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
    as: 0,
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
  genEndCOuterLeft(): Polyline {
    return new Polyline(-this.r - this.t - this.oBeam.w, this.hd)
      .lineBy(0, -this.endSect.hd)
      .lineBy(this.endSect.w, -this.endSect.hs);
  }
  genEndCOuter(): Polyline{
    const path = new Polyline(-this.r - this.t - this.oBeam.w, this.hd);
    path
      .lineBy(0, -this.endSect.hd)
      .lineBy(this.endSect.w, -this.endSect.hs);
    if(this.support.h > 0){
      const {w, h} = this.support;
      path
        .lineBy(w, 0)
        .lineBy(h, h)
        .lineBy(2*this.r + 2* this.t + 2*this.oBeam.w - 2* this.endSect.w - 2*w - 2*h, 0)
        .lineBy(h, -h)
        .lineBy(w, 0);
    }else{
      path.lineBy(2*this.r + 2*this.t + 2*this.oBeam.w - 2*this.endSect.w, 0);
    }
    path
      .lineBy(this.endSect.w, this.endSect.hs)
      .lineBy(0, this.endSect.hd);
    
    return path;
  }
  genEndCInnerLeft(): Polyline {
    return new Polyline(-this.r, this.hd)
      .lineBy(0, -this.hd)
      .arcTo(0, -this.r, 90);
  }
  genBarCenters(): Vector[]{
    const x0 = -this.len/2 + this.waterStop.w + this.bar.w/2;
    const x1 = this.len/2 - this.waterStop.w - this.bar.w/2;
    const y = this.hd - this.bar.h/2;
    return new Line(vec(x0, y), vec(x1, y)).divide(this.bar.s).points;
  }
  genCInner(): Polyline{
    const path = new Polyline(-this.r + this.iBeam.w, this.hd)
    if (this.iBeam.w > 0) {
      path
        .lineBy(0, -this.iBeam.hd)
        .lineBy(-this.iBeam.w, -this.iBeam.hs);
    }
    path
      .lineTo(-this.r, 0)
      .arcTo(this.r, 0, 180)
      .lineTo(this.r, this.hd - this.iBeam.hd - this.iBeam.hs);
    if (this.iBeam.w > 0) {
      path
        .lineBy(-this.iBeam.w, this.iBeam.hs)
        .lineBy(0, this.iBeam.hd);
    }
    return path;
  }
  genCOuterArc(): Polyline{
    const [transPt0, transPt1] = this.transPt;
    const angle = this.transAngle;
    const path = new Polyline(-this.r - this.t, 0);
    path
      .arcTo(transPt0.x, transPt0.y, angle)
      .lineTo(-this.butt.w / 2, -this.bottomRadius)
      .lineBy(this.butt.w, 0)
      .lineTo(transPt1.x, transPt1.y)
      .arcTo(this.r + this.t, 0, angle)
    return path;
  }
  genTransCOuter(): Polyline{
    return this.genCOuterArc().offset(this.oBeam.w, Side.Right);
  }
  genCOuter(): Polyline{
    const [transPt0, transPt1] = this.transPt;
    const angle = this.transAngle;
    const path = new Polyline(-this.r + this.iBeam.w, this.hd);
    path.lineBy(-this.beamWidth, 0)
    if(this.oBeam.w > 0){
      path
        .lineBy(0, -this.oBeam.hd)
        .lineBy(this.oBeam.w , -this.oBeam.hs)
    }
    path
      .lineBy(0, -this.oWallH)
      .arcTo(transPt0.x, transPt0.y, angle)
      .lineTo(-this.butt.w / 2, -this.bottomRadius)
      .lineBy(this.butt.w, 0)
      .lineTo(transPt1.x, transPt1.y)
      .arcTo(this.r + this.t, 0, angle)
      .lineBy(0, this.oWallH)
    if(this.oBeam.w > 0){
      path
        .lineBy(this.oBeam.w , this.oBeam.hs)
        .lineBy(0, this.oBeam.hd)
    }
    path.lineBy(-this.beamWidth, 0)
    
    return path;
  }
}
