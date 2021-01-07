import { Line, RebarPathForm, SparsePointRebar, vec } from "@/draw";
import { UShellRebarBuilder } from "../../../UShellRebar";

export class BeamTopBar extends UShellRebarBuilder {
  build(): this {
    const bar = this.rebars.end.bTop;
    bar
      .setForm(RebarPathForm.Line(bar.diameter, this.genShape().calcLength()))
      .setId(this.id())
      .setStructure(this.name);
    this.figures.rTable.push(bar);
    this.figures.mTable.push(bar);

    this.drawCEnd();
    this.drawLInner();
    this.drawSEndBeam();
    return this;
  }
  protected genShape(): Line {
    const u = this.struct;
    const leftEdge = u.genEndLeftOutline().offset(u.as);
    const rightEdge = leftEdge.mirrorByYAxis();

    const y = -u.r - u.waterStop.h - u.as;
    const left = leftEdge.rayIntersect(vec(0, y), vec(1, 0))[0];
    const right = rightEdge.rayIntersect(vec(0, y), vec(1, 0))[0];
    return new Line(left, right);
  }
  cEnd = this.figures.cEnd.planeRebar();
  protected drawCEnd(): void {
    const bar = this.rebars.end.bTop;
    this.cEnd
      .rebar(this.genShape())
      .spec(bar)
  }
  lInner: SparsePointRebar[] = [];
  protected drawLInner(): void {
    const u = this.struct;
    const bar = this.rebars.end.bTop;
    const fig = this.figures.lInner;
    const r = fig.drawRadius;
    const y = -u.r - u.waterStop.h - u.as - r;
    const x0 = -u.len / 2 + u.cantLeft + u.as + r;
    const x1 = x0 + u.endSect.b - 2 * u.as - 2 * r;
    const x3 = u.len / 2 - u.cantRight - u.as - r;
    const x2 = x3 - u.endSect.b + 2 * u.as + 2 * r;
    const leftPts = new Line(vec(x0, y), vec(x1, y)).divideByCount(
      bar.singleCount - 1
    ).points;
    const rightPts = new Line(vec(x2, y), vec(x3, y)).divideByCount(
      bar.singleCount - 1
    ).points;
    this.lInner.push(
      fig.sparsePointRebar().points(...leftPts),
      fig.sparsePointRebar().points(...rightPts)
    )
  }
  sEndBeam = this.figures.sEndBeam.sparsePointRebar();
  protected drawSEndBeam(): void{
    const u = this.struct;
    const fig = this.figures.sEndBeam;
    const bar = this.rebars.end.bTop;
    const r = fig.drawRadius;
    const y = -u.waterStop.h - u.as - r ;
    this.sEndBeam
      .points(...new Line(vec(u.as + r, y), vec(u.endSect.b - u.as - r, y)).divideByCount(bar.singleCount - 1).points)
      .spec(bar, bar.singleCount)
  }
}
