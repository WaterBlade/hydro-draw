import { ArrowNote, Circle, Line, RebarPathForm, vec } from "@/draw";
import { UShellRebarBuilder } from "@/struct/ushell/UShellRebar";

export class BeamBotBar extends UShellRebarBuilder {
  buildRebar(): this {
    const bar = this.rebars.end.bBot;
    bar
      .setForm(RebarPathForm.Line(bar.diameter, this.genShape().calcLength()))
      .setId(this.id())
      .setStructure(this.name);
    return this;
  }
  buildFigure(): this {
    const bar = this.rebars.end.bBot;
    this.drawCEnd();
    this.drawLInner();
    this.figures.rTable.push(bar);
    this.figures.mTable.push(bar);
    return this;
  }
  protected genShape(): Line {
    const u = this.struct;
    const y = u.hd - u.endHeight + u.support.h + u.as;
    const leftEdge = u.genEndLeftOutline().offset(u.as);
    const rightEdge = leftEdge.mirrorByYAxis();
    const left = leftEdge.rayIntersect(vec(0, y), vec(1, 0))[0];
    const right = rightEdge.rayIntersect(vec(0, y), vec(1, 0))[0];
    return new Line(left, right);
  }
  protected drawCEnd(): void {
    const u = this.struct;
    const fig = this.figures.cEnd;
    const bar = this.rebars.end.bBot;
    fig.push(
      new ArrowNote(fig.textHeight)
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
    const bar = this.rebars.end.bBot;
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
}
