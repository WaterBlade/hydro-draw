import { ArrowNote, Circle, Line, RebarPathForm, vec } from "@/draw";
import { UShellRebarBuilder } from "../../UShellRebar";

export class BeamTopBar extends UShellRebarBuilder {
  buildRebar(): this {
    const bar = this.rebars.end.bTop;
    bar
      .setForm(RebarPathForm.Line(bar.diameter, this.genShape().calcLength()))
      .setId(this.id())
      .setStructure(this.name);
    return this;
  }
  buildFigure(): this {
    const bar = this.rebars.end.bTop;
    this.drawCEnd();
    this.drawLInner();
    this.figures.rTable.push(bar);
    this.figures.mTable.push(bar);
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
  protected drawCEnd(): void {
    const u = this.struct;
    const bar = this.rebars.end.bTop;
    const fig = this.figures.cEnd;
    fig.push(
      new ArrowNote(fig.textHeight)
        .rebar(this.genShape())
        .spec(bar)
        .leaderNote(
          vec(-u.r / 4, -u.r + 4 * fig.textHeight),
          vec(0, 1),
          vec(1, 0)
        )
        .generate()
    );
  }
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
    const leftBars = leftPts.map((p) => new Circle(p, r).thickLine());
    const rightPts = new Line(vec(x2, y), vec(x3, y)).divideByCount(
      bar.singleCount - 1
    ).points;
    const rightBars = rightPts.map((p) => new Circle(p, r).thickLine());
    fig.push(...leftBars, ...rightBars);
  }
}