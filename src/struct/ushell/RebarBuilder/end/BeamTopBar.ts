import {
  PlaneRebar,
  Circle,
  Line,
  RebarFormPreset,
  SparsePointRebar,
  vec,
} from "@/draw";
import { Figure } from "@/struct/utils/Figure";
import { RebarBase } from "../Base";

export class BeamTopBar extends RebarBase {
  buildSpec(): this {
    const bar = this.specs.end.bTop;
    bar
      .setForm(RebarFormPreset.Line(bar.diameter, this.genShape().calcLength()))
      .setId(this.specs.id.gen())
      .setStructure(this.name);
    this.specs.record(bar);
    return this;
  }
  buildFigure(): this {
    if (this.struct.hasUnCant()) this.drawCEnd(this.figures.cEnd);
    if (this.struct.hasCant()) this.drawCEnd(this.figures.cEndCant);
    this.drawLInner();
    if (this.struct.isLeftFigureExist()) this.drawSEndBeam(this.figures.sEndBLeft);
    if (this.struct.isRightFigureExist()) this.drawSEndBeam(this.figures.sEndBRight);
    if (this.struct.isLeftCantFigureExist())
      this.drawSEndBeam(this.figures.sEndCantBLeft, true);
    if (this.struct.isRightCantFigureExist())
      this.drawSEndBeam(this.figures.sEndCantBRight, true);
    return this;
  }
  protected genShape(): Line {
    const u = this.struct;
    const as = this.specs.as;
    const leftEdge = u.genEndCOuterLeft().offset(as);
    const rightEdge = leftEdge.mirrorByVAxis();

    const y = -u.shell.r - u.waterStop.h - as;
    const left = leftEdge.rayIntersect(vec(0, y), vec(1, 0))[0];
    const right = rightEdge.rayIntersect(vec(0, y), vec(1, 0))[0];
    return new Line(left, right);
  }
  protected drawCEnd(fig: Figure): void {
    const u = this.struct;
    const bar = this.specs.end.bTop;
    fig.push(
      new PlaneRebar(fig.textHeight)
        .rebar(this.genShape())
        .spec(bar)
        .leaderNote(
          vec(-u.shell.r / 4, -u.shell.r + 4 * fig.textHeight),
          vec(0, 1),
          vec(1, 0)
        )
        .generate()
    );
  }
  protected drawLInner(): void {
    const u = this.struct;
    const bar = this.specs.end.bTop;
    const fig = this.figures.lInner;
    const r = fig.drawRadius;
    const as = this.specs.as;
    const leftGap = u.cantLeft > 0 ? 0 : u.waterStop.h;
    const rightGap = u.cantRight > 0 ? 0 : u.waterStop.h;
    const y = -u.shell.r - as - 2 * r;
    const x0 = -u.len / 2 + u.cantLeft + as + r;
    const x1 = x0 + u.endSect.b - 2 * as - 2 * r;
    const x3 = u.len / 2 - u.cantRight - as - r;
    const x2 = x3 - u.endSect.b + 2 * as + 2 * r;
    const leftPts = new Line(
      vec(x0, y - leftGap),
      vec(x1, y - leftGap)
    ).divideByCount(bar.singleCount - 1).points;
    const leftBars = leftPts.map((p) => new Circle(p, r).thickLine());
    const rightPts = new Line(
      vec(x2, y - rightGap),
      vec(x3, y - rightGap)
    ).divideByCount(bar.singleCount - 1).points;
    const rightBars = rightPts.map((p) => new Circle(p, r).thickLine());
    fig.push(...leftBars, ...rightBars);
  }
  protected drawSEndBeam(fig: Figure, isCant = false): void {
    const u = this.struct;
    const bar = this.specs.end.bTop;
    const as = this.specs.as;
    const r = fig.drawRadius;
    const gap = isCant ? 0 : u.waterStop.h;
    const y = -gap - as - r;
    fig.push(
      new SparsePointRebar(fig.textHeight, r, 30)
        .points(
          ...new Line(
            vec(as + r, y),
            vec(u.endSect.b - as - r, y)
          ).divideByCount(bar.singleCount - 1).points
        )
        .spec(bar, bar.singleCount)
        .parallelLeader(
          vec(-2 * fig.textHeight, y - 2 * fig.textHeight),
          vec(-1, 0)
        )
        .generate()
    );
  }
}
