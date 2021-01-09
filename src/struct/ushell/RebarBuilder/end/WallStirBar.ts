import { Line, Polyline, RebarPathForm, Side, vec } from "@/draw";
import { RebarBase } from "../Base";

export class WallStirBar extends RebarBase {
  buildSpec(): this {
    const u = this.struct;
    const bar = this.specs.end.wStir;
    const lens = this.genMulShape().map((l) => l.calcLength());
    bar
      .setForm(
        RebarPathForm.RectWidthHook(bar.diameter, u.endSect.b - 2 * u.as, lens)
      )
      .setCount(lens.length * 4)
      .setId(this.id())
      .setStructure(this.name);
    this.specs.record(bar);
    return this;
  }
  buildFigure(): this {
    this.drawCEnd();
    this.drawSEndWall();
    return this;
  }
  protected genMulShape(): Line[] {
    const u = this.struct;
    const bar = this.specs.end.wStir;
    const y0 = u.hd - u.as;
    const y1 = -u.r - u.waterStop.h - u.as;
    const leftEdge = u.genEndCOuterLeft().offset(u.as);
    const rightEdge = u
      .genEndCInnerLeft()
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
    const bar = this.specs.end.wStir;
    const fig = this.figures.cEnd;
    const lines = this.genMulShape();
    fig.push(
      fig.planeRebar()
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
      fig.planeRebar()
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
  protected drawSEndWall(): void{
    const u = this.struct;
    const fig = this.figures.sEndWall;
    const bar = this.specs.end.wStir;
    const w0 = u.endSect.b - 2*u.as;
    const h0 = u.oBeam.w + u.t - u.waterStop.h - 2*u.as;
    const y = -u.waterStop.h - u.as - h0/2;
    fig.push(
      fig.planeRebar()
        .rebar(new Polyline(u.as, -u.waterStop.h - u.as).lineBy(w0, 0).lineBy(0, -h0).lineBy(-w0, 0).lineBy(0, h0))
        .spec(bar, 0, bar.space)
        .leaderNote(vec(-2*fig.h, y), vec(1, 0))
        .generate()
    );
  }
}
