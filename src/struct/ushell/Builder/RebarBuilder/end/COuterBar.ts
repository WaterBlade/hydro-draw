import {
  PlaneRebar,
  Line,
  Polyline,
  RebarPathForm,
  Side,
  toDegree,
  vec,
} from "@/draw";
import { UShellRebarBuilder } from "../../../UShellRebar";

export class COuterBar extends UShellRebarBuilder {
  build(): this {
    const u = this.struct;
    const bar = this.rebars.end.cOuter;
    const path = this.genShape();
    const lens = path.segments.map((s) => s.calcLength());
    let i = 0;
    const angle = 180 - toDegree(Math.atan(u.endSect.w / u.endSect.hs));
    bar
      .setForm(
        new RebarPathForm(bar.diameter)
          .lineBy(0, -1.5)
          .dimLength(lens[i++], Side.Right)
          .lineBy(0.75, -1.5)
          .dimLength(lens[i++], Side.Right)
          .dimAngle(angle)
          .lineBy(1, 0)
          .dimLength(lens[i++])
          .lineBy(0.5, 0.5)
          .dimLength(500, Side.Right)
      )
      .setId(this.id())
      .setStructure(this.name);
    this.figures.rTable.push(bar);
    this.figures.mTable.push(bar);

    this.drawCEnd();
    this.drawLOuter();
    this.drawSEndWall();
    return this;
  }
  protected genShape(offDist?: number): Polyline {
    const u = this.struct;
    const dist = offDist ? offDist : u.as;
    const path = new Polyline(-u.r - u.t - u.oBeam.w + 1, u.hd)
      .lineBy(-1, 0)
      .lineBy(0, -u.endSect.hd)
      .lineBy(u.endSect.w, -u.endSect.hs)
      .lineBy(u.support.w > 0 ? u.support.w : 500, 0)
      .lineBy(500, 500)
      .offset(dist)
      .removeStart();
    return path;
  }
  cEnd: PlaneRebar[] = [];
  protected drawCEnd(): void {
    const bar = this.rebars.end.cOuter;
    const fig = this.figures.cEnd;
    const left = this.genShape();
    const right = left.mirrorByYAxis();
    this.cEnd.push(
      fig.planeRebar()
        .rebar(left)
        .spec(bar),
      fig.planeRebar()
        .rebar(right)
        .spec(bar)
    );
  }
  lOuter: PlaneRebar[] = [];
  protected drawLOuter(): void {
    const u = this.struct;
    const bar = this.rebars.end.cOuter;
    const fig = this.figures.lOuter;
    const y0 = u.hd - u.as;
    const y1 = u.hd - u.endHeight + u.as;
    const leftXs = new Line(
      vec(-u.len / 2 + u.cantLeft + u.as, 0),
      vec(-u.len / 2 + u.cantLeft + u.endSect.b - u.as, 0)
    )
      .divideByCount(bar.singleCount)
      .points.map((p) => p.x);
    const rightXs = new Line(
      vec(u.len / 2 - u.cantRight - u.as, 0),
      vec(u.len / 2 - u.cantRight - u.endSect.b + u.as, 0)
    )
      .divideByCount(bar.singleCount)
      .points.map((p) => p.x);
    this.lOuter.push(
      fig.planeRebar()
        .rebar(...leftXs.map((x) => new Line(vec(x, y0), vec(x, y1))))
        .spec(bar, bar.singleCount),
      fig.planeRebar()
        .rebar(...rightXs.map((x) => new Line(vec(x, y0), vec(x, y1))))
        .spec(bar, bar.singleCount)
    );
  }
  sEndWall = this.figures.sEndWall.sparsePointRebar();
  protected drawSEndWall(): void{
    const u = this.struct;
    const fig = this.figures.sEndWall;
    const bar = this.rebars.end.cOuter;
    const r = fig.drawRadius;
    const y = -u.t - u.oBeam.w + u.as + r ;
    this.sEndWall
        .points(...new Line(vec(u.as + r, y), vec(u.endSect.b - u.as - r, y)).divideByCount(bar.singleCount-1).points)
        .spec(bar, bar.singleCount)
  }
}
