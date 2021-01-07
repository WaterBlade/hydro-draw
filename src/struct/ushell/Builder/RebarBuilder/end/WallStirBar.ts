import { PlaneRebar, Line, RebarPathForm, Side, vec } from "@/draw";
import { UShellRebarBuilder } from "../../../UShellRebar";

export class WallStirBar extends UShellRebarBuilder {
  build(): this {
    const u = this.struct;
    const bar = this.rebars.end.wStir;
    const lens = this.genMulShape().map((l) => l.calcLength());
    bar
      .setForm(
        RebarPathForm.RectWidthHook(bar.diameter, u.endSect.b - 2 * u.as, lens)
      )
      .setCount(lens.length * 4)
      .setId(this.id())
      .setStructure(this.name);
    this.figures.rTable.push(bar);
    this.figures.mTable.push(bar);

    this.drawCEnd();
    return this;
  }
  protected genMulShape(): Line[] {
    const u = this.struct;
    const bar = this.rebars.end.wStir;
    const y0 = u.hd - u.as;
    const y1 = -u.r - u.waterStop.h - u.as;
    const leftEdge = u.genEndLeftOutline().offset(u.as);
    const rightEdge = u
      .genEndLeftInner()
      .offset(u.waterStop.h + u.as, Side.Right);

    const pts = new Line(vec(0, y0), vec(0, y1)).divide(bar.space).removeEndPt()
      .points;
    return pts.map(
      (p) =>
        new Line(
          leftEdge.rayIntersect(p, vec(1, 0))[0],
          rightEdge.rayIntersect(p, vec(1, 0))[0]
        )
    );
  }
  cEnd: PlaneRebar[] = [];
  protected drawCEnd(): void {
    const bar = this.rebars.end.wStir;
    const fig = this.figures.cEnd;
    const lines = this.genMulShape();
    this.cEnd.push(
      fig.planeRebar()
        .spec(bar, lines.length, bar.space)
        .rebar(...lines.reverse()),
      fig.planeRebar()
        .spec(bar, lines.length, bar.space)
        .rebar(...lines.map((l) => l.mirrorByYAxis()))
    );
  }
}
