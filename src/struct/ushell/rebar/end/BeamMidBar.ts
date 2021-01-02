import { ArrowNote, Circle, Line, RebarPathForm, vec } from "@/draw";
import { UShellRebarBuilder } from "../../UShellRebar";

export class BeamMidBar extends UShellRebarBuilder {
  buildRebar(): this {
    const bar = this.rebars.end.bMid;
    bar
      .setForm(
        RebarPathForm.Line(
          bar.diameter,
          this.genMulShape().map((p) => p.calcLength())
        )
      )
      .setId(this.id())
      .setStructure(this.name);
    return this;
  }
  buildFigure(): this {
    const bar = this.rebars.end.bMid;
    this.drawCEnd();
    this.drawLInner();
    this.figures.rTable.push(bar);
    this.figures.mTable.push(bar);
    return this;
  }
  protected genMulShape(): Line[] {
    const u = this.struct;
    const bar = this.rebars.end.bMid;
    const y0 = -u.r - u.waterStop.h - u.as;
    const y1 = u.hd - u.endHeight + u.support.h + u.as;
    const pts = new Line(vec(0, y0), vec(0, y1))
      .divideByCount(bar.singleCount + 1)
      .removeStartPt()
      .removeEndPt().points;
    const leftEdge = u.genEndLeftOutline().offset(u.as);
    const rightEdge = leftEdge.mirrorByYAxis();
    return pts.map(
      (p) =>
        new Line(
          leftEdge.rayIntersect(p, vec(1, 0))[0],
          rightEdge.rayIntersect(p, vec(1, 0))[0]
        )
    );
  }
  protected drawCEnd(): void {
    const u = this.struct;
    const bar = this.rebars.end.bMid;
    const fig = this.figures.cEnd;
    fig.push(
      new ArrowNote(fig.textHeight)
        .rebar(...this.genMulShape())
        .spec(bar)
        .leaderNote(
          vec(u.r / 4, u.hd - u.endHeight - 2 * fig.textHeight),
          vec(0, 1),
          vec(1, 0)
        )
        .generate()
    );
  }
  protected drawLInner(): void {
    const u = this.struct;
    const bar = this.rebars.end.bMid;
    const fig = this.figures.lInner;
    const r = fig.drawRadius;
    const x0 = -u.len / 2 + u.cantLeft + u.as + r;
    const x1 = x0 + u.endSect.b - 2 * u.as - 2 * r;
    const x3 = u.len / 2 - u.cantRight - u.as - r;
    const x2 = x3 - u.endSect.b + 2 * u.as + 2 * r;
    const y0 = -u.r - u.waterStop.h - u.as - r;
    const y1 = u.hd - u.endHeight + u.support.h + u.as + r;
    for (const x of [x0, x1, x2, x3]) {
      const pts = new Line(vec(x, y0), vec(x, y1))
        .divideByCount(bar.singleCount + 1)
        .removeStartPt()
        .removeEndPt().points;
      fig.push(...pts.map((p) => new Circle(p, r).thickLine()));
    }
  }
}
