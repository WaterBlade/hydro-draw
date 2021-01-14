import {
  PlaneRebar,
  Circle,
  Line,
  RebarFormPreset,
  SparsePointRebar,
  vec,
} from "@/draw";
import { Figure } from "@/struct/Figure";
import { RebarBase } from "../Base";

export class BeamBotBar extends RebarBase {
  buildSpec(): this {
    const bar = this.specs.end.bBot;
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
    if (this.struct.isLeftExist()) this.drawSEndBeam(this.figures.sEndBLeft);
    if (this.struct.isRightExist()) this.drawSEndBeam(this.figures.sEndBRight);
    if (this.struct.isLeftCantExist())
      this.drawSEndBeam(this.figures.sEndCantBLeft);
    if (this.struct.isRightCantExist())
      this.drawSEndBeam(this.figures.sEndCantBRight);
    return this;
  }
  protected genShape(): Line {
    const u = this.struct;
    const as = this.specs.as;
    const y = u.shell.hd - u.endHeight + u.support.h + as;
    const leftEdge = u.genEndCOuterLeft().offset(as);
    const rightEdge = leftEdge.mirrorByVAxis();
    const left = leftEdge.rayIntersect(vec(0, y), vec(1, 0))[0];
    const right = rightEdge.rayIntersect(vec(0, y), vec(1, 0))[0];
    return new Line(left, right);
  }
  protected drawCEnd(fig: Figure): void {
    const u = this.struct;
    const bar = this.specs.end.bBot;
    fig.push(
      new PlaneRebar(fig.textHeight)
        .rebar(this.genShape())
        .spec(bar)
        .leaderNote(
          vec(-u.shell.r / 4, u.shell.hd - u.endHeight - 2 * fig.textHeight),
          vec(0, 1),
          vec(-1, 0)
        )
        .generate()
    );
  }
  protected drawLInner(): void {
    const u = this.struct;
    const fig = this.figures.lInner;
    const bar = this.specs.end.bBot;
    const as = this.specs.as;
    const r = fig.drawRadius;
    const y = u.shell.hd - u.endHeight + u.support.h + as + fig.drawRadius;
    const x0 = -u.len / 2 + u.cantLeft + as + r;
    const x1 = x0 + u.endSect.b - 2 * as - 2 * r;
    const x3 = u.len / 2 - u.cantRight - as - r;
    const x2 = x3 - u.endSect.b + 2 * as + 2 * r;
    const leftPts = new Line(vec(x0, y), vec(x1, y)).divideByCount(
      bar.singleCount - 1
    ).points;
    const leftBars = leftPts.map((p) =>
      new Circle(p, fig.drawRadius).thickLine()
    );
    const rightPts = new Line(vec(x2, y), vec(x3, y)).divideByCount(
      bar.singleCount - 1
    ).points;
    const rightBars = rightPts.map((p) =>
      new Circle(p, fig.drawRadius).thickLine()
    );
    fig.push(...leftBars, ...rightBars);
  }
  protected drawSEndBeam(fig: Figure): void {
    const u = this.struct;
    const bar = this.specs.end.bBot;
    const as = this.specs.as;
    const r = fig.drawRadius;
    const y = -u.endHeight + u.shell.r + u.shell.hd + u.support.h + as + r;
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
          vec(-2 * fig.textHeight, y - 2 * fig.textHeight - u.support.h),
          vec(-1, 0)
        )
        .generate()
    );
  }
}
