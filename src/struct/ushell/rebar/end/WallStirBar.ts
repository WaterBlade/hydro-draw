import { ArrowNote, Line, Polyline, RebarPathForm, Side, vec } from "@/draw";
import { UShellRebarBuilder } from "../../UShellRebar";

export class WallStirBar extends UShellRebarBuilder {
  buildRebar(): this {
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
    return this;
  }
  buildFigure(): this {
    this.drawCEnd();
    const bar = this.rebars.end.wStir;
    this.figures.rTable.push(bar);
    this.figures.mTable.push(bar);
    return this;
  }
  protected genMulShape(): Line[] {
    const u = this.struct;
    const bar = this.rebars.end.wStir;
    const y0 = u.hd - u.as;
    const y1 = -u.r - u.waterStop.h - u.as;
    const leftEdge = u.genEndLeftOutline().offset(u.as);
    const rightEdge = u
      .genLeftInnerOutline()
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
  protected drawCEnd(): void {
    const u = this.struct;
    const bar = this.rebars.end.wStir;
    const fig = this.figures.cEnd;
    const lines = this.genMulShape();
    fig.push(
      new ArrowNote(fig.textHeight)
        .spec(bar, lines.length, bar.space)
        .rebar(...lines.reverse())
        .cross(
          new Polyline(
            -u.r -
              u.t -
              u.oBeam.w +
              u.endSect.w +
              Math.max(u.support.w / 2, 200),
            u.hd - u.endHeight
          )
            .lineBy(-u.endSect.w, u.endSect.hs)
            .lineBy(0, u.endSect.hd + 3 * fig.textHeight)
        )
        .note(vec(1, 0))
        .generate(),
      new ArrowNote(fig.textHeight)
        .spec(bar, lines.length, bar.space)
        .rebar(...lines.map((l) => l.mirrorByYAxis()))
        .cross(
          new Polyline(
            u.r +
              u.t +
              u.oBeam.w -
              u.endSect.w -
              Math.max(u.support.w / 2, 200),
            u.hd - u.endHeight
          )
            .lineBy(u.endSect.w, u.endSect.hs)
            .lineBy(0, u.endSect.hd + 3 * fig.textHeight)
        )
        .note(vec(-1, 0))
        .generate()
    );
  }
}
