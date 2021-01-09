import { PlaneRebar, Circle, Line, RebarPathForm, SparsePointRebar, vec } from "@/draw";
import { RebarBase } from "../Base";

export class BeamBotBar extends RebarBase {
  buildSpec(): this {
    const bar = this.specs.end.bBot;
    bar
      .setForm(RebarPathForm.Line(bar.diameter, this.genShape().calcLength()))
      .setId(this.id())
      .setStructure(this.name);
    this.specs.record(bar);
    return this;
  }
  buildFigure(): this {
    this.drawCEnd();
    this.drawLInner();
    this.drawSEndBeam();
    return this;
  }
  protected genShape(): Line {
    const u = this.struct;
    const y = u.hd - u.endHeight + u.support.h + u.as;
    const leftEdge = u.genEndCOuterLeft().offset(u.as);
    const rightEdge = leftEdge.mirrorByYAxis();
    const left = leftEdge.rayIntersect(vec(0, y), vec(1, 0))[0];
    const right = rightEdge.rayIntersect(vec(0, y), vec(1, 0))[0];
    return new Line(left, right);
  }
  protected drawCEnd(): void {
    const u = this.struct;
    const fig = this.figures.cEnd;
    const bar = this.specs.end.bBot;
    fig.push(
      new PlaneRebar(fig.textHeight)
        .rebar(this.genShape())
        .spec(bar)
        .leaderNote(
          vec(-u.r / 4, u.hd - u.endHeight - 2 * fig.textHeight),
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
    const r = fig.drawRadius;
    const y = u.hd - u.endHeight + u.support.h + u.as + fig.drawRadius;
    const x0 = -u.len / 2 + u.cantLeft + u.as + r;
    const x1 = x0 + u.endSect.b - 2 * u.as - 2 * r;
    const x3 = u.len / 2 - u.cantRight - u.as - r;
    const x2 = x3 - u.endSect.b + 2 * u.as + 2 * r;
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
  protected drawSEndBeam(): void{
    const u = this.struct;
    const fig = this.figures.sEndBeam;
    const bar = this.specs.end.bBot;
    const r = fig.drawRadius;
    const y = -u.endHeight + u.r + u.hd + u.support.h + u.as + r ;
    fig.push(
      new SparsePointRebar(fig.textHeight, r, 30)
        .points(...new Line(vec(u.as + r, y), vec(u.endSect.b - u.as - r, y)).divideByCount(bar.singleCount-1).points)
        .spec(bar, bar.singleCount)
        .parallelLeader(vec(-2*fig.textHeight, y-2*fig.textHeight - u.support.h), vec(-1, 0))
        .generate()
    );
  }
}
