import {
  PlaneRebar,
  Circle,
  last,
  Line,
  RebarFormPreset,
  SparsePointRebar,
  vec,
} from "@/draw";
import { Figure } from "@/struct/utils/Figure";
import { RebarBase } from "../Base";

export class BeamMidBar extends RebarBase {
  buildSpec(): this {
    const bar = this.specs.end.bMid;
    bar
      .setForm(
        RebarFormPreset.Line(
          bar.diameter,
          this.genMulShape().map((p) => p.calcLength())
        )
      )
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
      this.drawSEndBeam(this.figures.sEndCantBLeft);
    if (this.struct.isRightCantFigureExist())
      this.drawSEndBeam(this.figures.sEndCantBRight);
    return this;
  }
  protected genMulShape(): Line[] {
    const u = this.struct;
    const bar = this.specs.end.bMid;
    const as = this.specs.as;
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
  protected drawCEnd(fig: Figure): void {
    const u = this.struct;
    const bar = this.specs.end.bMid;
    fig.push(
      new PlaneRebar(fig.textHeight)
        .rebar(...this.genMulShape())
        .spec(bar)
        .leaderNote(
          vec(u.shell.r / 4, u.shell.hd - u.endHeight - 2 * fig.textHeight),
          vec(0, 1),
          vec(1, 0)
        )
        .generate()
    );
  }
  protected drawLInner(): void {
    const u = this.struct;
    const bar = this.specs.end.bMid;
    const fig = this.figures.lInner;
    const as = this.specs.as;
    const r = fig.drawRadius;
    const x0 = -u.len / 2 + u.cantLeft + as + r;
    const x1 = x0 + u.endSect.b - 2 * as - 2 * r;
    const x3 = u.len / 2 - u.cantRight - as - r;
    const x2 = x3 - u.endSect.b + 2 * as + 2 * r;
    const y0 = -u.shell.r - u.waterStop.h - as - r;
    const y1 = u.shell.hd - u.endHeight + u.support.h + as + r;
    for (const x of [x0, x1, x2, x3]) {
      const pts = new Line(vec(x, y0), vec(x, y1))
        .divideByCount(bar.singleCount + 1)
        .removeStartPt()
        .removeEndPt().points;
      fig.push(...pts.map((p) => new Circle(p, r).thickLine()));
    }
  }
  protected drawSEndBeam(fig: Figure): void {
    const u = this.struct;
    const bar = this.specs.end.bMid;
    const as = this.specs.as;
    const r = fig.drawRadius;
    const x0 = as + r;
    const x1 = u.endSect.b - as - r;
    const y0 = -u.waterStop.h - as - r;
    const y1 = u.shell.hd + u.shell.r - u.endHeight + u.support.h + as + r;
    const pts0 = new Line(vec(x0, y0), vec(x0, y1))
      .divideByCount(bar.singleCount + 1)
      .removeStartPt()
      .removeEndPt().points;
    const pts1 = new Line(vec(x1, y0), vec(x1, y1))
      .divideByCount(bar.singleCount + 1)
      .removeStartPt()
      .removeEndPt().points;
    const y2 = (last(pts0).y + y1) / 2;
    fig.push(
      new SparsePointRebar(fig.textHeight, r)
        .points(...pts0, ...pts1)
        .spec(bar, 2 * bar.singleCount)
        .jointLeader(vec(u.endSect.b / 2, y2), vec(-2 * fig.textHeight, y2))
        .generate()
    );
  }
}
