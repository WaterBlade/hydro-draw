import { Arc, Line, Polyline, Side, vec } from "@/draw";
import { UShellRebar } from "../UShellRebar";
import { UShellStruct } from "../UShellStruct";

export class ShapeEnd {
  constructor(protected struct: UShellStruct, protected rebars: UShellRebar) {}

  bBot(): Line {
    const u = this.struct;
    const as = this.rebars.as;
    const y = u.shell.hd - u.endHeight + u.support.h + as;
    const leftEdge = u.genEndCOuterLeft().offset(as);
    const rightEdge = leftEdge.mirrorByVAxis();
    const left = leftEdge.rayIntersect(vec(0, y), vec(1, 0))[0];
    const right = rightEdge.rayIntersect(vec(0, y), vec(1, 0))[0];
    return new Line(left, right);
  }
  bMid(): Line[] {
    const u = this.struct;
    const bar = this.rebars.end.bMid;
    const as = this.rebars.as;
    const y0 = -u.shell.r - u.waterStop.h - as;
    const y1 = u.shell.hd - u.endHeight + u.support.h + as;
    const pts = new Line(vec(0, y0), vec(0, y1))
      .divideByCount(bar.singleCount + 1)
      .removeStartPt()
      .removeEndPt().points;
    const leftEdge = u.genEndCOuterLeft().offset(as);
    const rightEdge = leftEdge.mirrorByVAxis();
    return pts.map(
      (p) =>
        new Line(
          leftEdge.rayIntersect(p, vec(1, 0))[0],
          rightEdge.rayIntersect(p, vec(1, 0))[0]
        )
    );
  }
  bStir(): Line[] {
    return this.genBStirAndCant(this.struct.waterStop.h);
  }
  bStirCant(): Line[] {
    return this.genBStirAndCant(0);
  }
  protected genBStirAndCant(gap: number): Line[] {
    const u = this.struct;
    const bar = this.rebars.end.bStir;
    const as = this.rebars.as;
    const l = Math.min(
      u.shell.r,
      u.shell.r + u.shell.t + u.oBeam.w - u.endSect.w
    );
    const y = u.shell.hd - u.endHeight + u.support.h + as;
    const pts = new Line(vec(-l, y), vec(l, y)).divide(bar.space).points;
    const topEdge = new Arc(vec(0, 0), u.shell.r + gap + as, 180, 0);
    return pts.map((p) => new Line(p, topEdge.rayIntersect(p, vec(0, 1))[0]));
  }
  bTop(): Line {
    const u = this.struct;
    const as = this.rebars.as;
    const leftEdge = u.genEndCOuterLeft().offset(as);
    const rightEdge = leftEdge.mirrorByVAxis();

    const y = -u.shell.r - u.waterStop.h - as;
    const left = leftEdge.rayIntersect(vec(0, y), vec(1, 0))[0];
    const right = rightEdge.rayIntersect(vec(0, y), vec(1, 0))[0];
    return new Line(left, right);
  }
  cOuter(offDist?: number): Polyline {
    const u = this.struct;
    const as = this.rebars.as;
    const dist = offDist ? offDist : as;
    const path = new Polyline(
      -u.shell.r - u.shell.t - u.oBeam.w + 1,
      u.shell.hd
    )
      .lineBy(-1, 0)
      .lineBy(0, -u.endSect.hd)
      .lineBy(u.endSect.w, -u.endSect.hs)
      .lineBy(u.support.w > 0 ? u.support.w : 500, 0)
      .lineBy(500, 500)
      .offset(dist)
      .removeStart();
    return path;
  }
  topBeam(): Polyline {
    return this.genTopBeamAndCant(this.struct.waterStop.h);
  }
  topBeamCant(): Polyline {
    return this.genTopBeamAndCant(0);
  }
  protected genTopBeamAndCant(gap: number): Polyline {
    const u = this.struct;
    const as = this.rebars.as;
    const d = vec(-u.iBeam.w, -u.iBeam.hs).unit().mul(150);
    const path = new Polyline(
      -u.shell.r - u.shell.t - u.oBeam.w + as,
      u.shell.hd + gap
    )
      .lineBy(u.oBeam.w + u.shell.t + u.iBeam.w - as, 0)
      .lineTo(-u.shell.r + u.iBeam.w, u.shell.hd - u.iBeam.hd)
      .lineBy(-u.iBeam.w, -u.iBeam.hs)
      .lineBy(0, -1)
      .offset(as + gap, Side.Right)
      .removeEnd();
    path.resetEnd(path.end.add(d));
    return path;
  }
  wStir(): Line[] {
    return this.genWStirAndCant(this.struct.waterStop.h);
  }
  wStirCant(): Line[] {
    return this.genWStirAndCant(0);
  }
  protected genWStirAndCant(gap: number): Line[] {
    const u = this.struct;
    const bar = this.rebars.end.wStir;
    const as = this.rebars.as;
    const y0 = u.shell.hd - as;
    const y1 = -u.shell.r - gap - as;
    const leftEdge = u.genEndCOuterLeft().offset(as);
    const rightEdge = u.genEndCInnerLeft().offset(gap + as, Side.Right);

    const pts = new Line(vec(0, y0), vec(0, y1)).divide(bar.space).removeEndPt()
      .points;
    return pts.map(
      (p) =>
        new Line(
          leftEdge.rayIntersect(p, vec(1, 0))[0],
          rightEdge.rayIntersect(p, vec(1, 0))[0]
        )
    );
  }
}
