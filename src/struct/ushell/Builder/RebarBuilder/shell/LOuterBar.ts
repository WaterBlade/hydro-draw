import {
  Line,
  PolylinePointRebar,
  Polyline,
  RebarPathForm,
  vec,
} from "@/draw";
import { UShellRebarBuilder } from "../../../UShellRebar";

export class LOuterBar extends UShellRebarBuilder {
  build(): this {
    const u = this.struct;
    const bar = this.rebars.shell.lOuter;
    const path = this.genPos()
      .offset(u.as + bar.diameter / 2)
      .removeStart()
      .removeStart()
      .divide(bar.space)
      .removeStartPt()
      .removeEndPt();
    bar
      .setCount(2 * path.points.length)
      .setForm(RebarPathForm.Line(bar.diameter, u.len - 2 * u.as));
    bar.setId(this.id()).setStructure(this.name);
    this.figures.rTable.push(bar);
    this.figures.mTable.push(bar);
    this.drawCMid();
    this.drawLOuter();
    this.drawSEndBeam();
    this.drawSEndWall();
    return this;
  }
  protected genPos(): Polyline {
    const u = this.struct;
    const path = new Polyline(-u.r + u.iBeam.w, u.hd - 1)
      .lineBy(0, 1)
      .lineBy(-u.beamWidth, 0);
    if (u.oBeam.w > 0) {
      path
        .lineBy(0, -u.oBeam.hd)
        .lineBy(u.oBeam.w, -u.oBeam.hs)
        .lineBy(0, -u.hd + u.oBeam.hd + u.oBeam.hs);
    } else {
      path.lineBy(0, -u.hd);
    }
    const leftPt = u.transPt[0];
    const angle = u.transAngle;
    path
      .arcTo(leftPt.x, leftPt.y, angle)
      .lineTo(-u.butt.w / 2, u.bottom)
      .lineTo(1, 0);
    return path;
  }
  cMid: PolylinePointRebar[] = [];
  protected drawCMid(): void {
    const u = this.struct;
    const bar = this.rebars.shell.lOuter;
    const fig = this.figures.cMid;
    const pLeft = this.genPos()
      .offset(u.as + fig.drawRadius)
      .removeStart()
      .removeEnd()
      .divide(bar.space)
      .removeStartPt()
      .removeEndPt();
    const pRight = pLeft.mirrorByYAxis();
    this.cMid.push(
      fig.polylinePointRebar()
        .spec(bar, bar.count / 2, bar.space)
        .polyline(pLeft),
      fig.polylinePointRebar()
        .spec(bar, bar.count / 2, bar.space)
        .polyline(pRight)
    );
  }
  lOuter = this.figures.lOuter.planeRebar();
  protected drawLOuter(): void {
    const u = this.struct;
    const bar = this.rebars.shell.lOuter;
    const ys = Array.from(
      new Set(
        this.genPos()
          .offset(u.as)
          .removeStart()
          .removeEnd()
          .divide(bar.space)
          .removeStartPt()
          .removeEndPt()
          .points.map((p) => p.y)
      ).values()
    );
    const start = -u.len / 2 + u.as;
    const end = u.len / 2 - u.as;

    this.lOuter
        .spec(bar, 0, bar.space)
        .rebar(...ys.map((y) => new Line(vec(start, y), vec(end, y))))
  }
  sEndBeam = this.figures.sEndBeam.planeRebar();
  protected drawSEndBeam(): void{
    const u = this.struct;
    const bar = this.rebars.shell.lOuter;
    const fig = this.figures.sEndBeam;
    const right = fig.getBoundingBox().right;
    const y = -u.t - u.butt.h + u.as + fig.drawRadius;
    this.sEndBeam
        .rebar(new Line(vec(u.as, y), vec(right, y)))
        .spec(bar, 0, bar.space)
  }
  sEndWall = this.figures.sEndWall.planeRebar();
  protected drawSEndWall(): void{
    const u = this.struct;
    const bar = this.rebars.shell.lOuter;
    const fig = this.figures.sEndWall;
    const right = fig.getBoundingBox().right;
    const y = -u.t + u.as + fig.drawRadius;
    this.sEndWall
        .rebar(new Line(vec(u.as, y), vec(right, y)))
        .spec(bar, 0, bar.space)
  }
}
