import { Arc, PlaneRebar, Line, Polyline, RebarPathForm, vec } from "@/draw";
import { RebarBase } from "../Base";

export class BeamStirBar extends RebarBase {
  buildSpec(): this {
    const u = this.struct;
    const bar = this.specs.end.bStir;
    const lens = this.genMulShape().map((l) => l.calcLength());
    bar
      .setForm(
        RebarPathForm.RectWidthHook(bar.diameter, u.endSect.b - 2 * u.as, lens)
      )
      .setCount(2 * lens.length)
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
  protected genMulShape(): Line[] {
    const u = this.struct;
    const bar = this.specs.end.bStir;
    const l = Math.min(u.r, u.r + u.t + u.oBeam.w - u.endSect.w);
    const y = u.hd - u.endHeight + u.support.h + u.as;
    const pts = new Line(vec(-l, y), vec(l, y)).divide(bar.space).points;
    const topEdge = new Arc(vec(0, 0), u.r + u.waterStop.h + u.as, 180, 0);
    return pts.map((p) => new Line(p, topEdge.rayIntersect(p, vec(0, 1))[0]));
  }
  protected drawCEnd(): void {
    const u = this.struct;
    const bar = this.specs.end.bStir;
    const midCount = this.specs.end.bMid.singleCount;
    const fig = this.figures.cEnd;
    const y0 = u.hd - u.endHeight + u.support.h + u.as;
    const y1 = -u.r - u.waterStop.h - u.as;
    const y = y0 + (0.5 * (y1 - y0)) / (midCount + 1);
    const lens = this.genMulShape();
    fig.push(
      new PlaneRebar(fig.textHeight)
        .spec(bar, lens.length, bar.space)
        .rebar(...lens)
        .leaderNote(
          vec(-u.r - u.t - u.oBeam.w + u.endSect.w - 2 * fig.textHeight, y),
          vec(1, 0)
        )
        .generate()
    );
  }
  protected drawLInner(): void {
    const u = this.struct;
    const fig = this.figures.lInner;
    const h = u.endHeight - u.hd - u.r - 2 * u.as - u.waterStop.h - u.support.h;
    const w = u.endSect.b - 2 * u.as;
    fig.push(
      new Polyline(-u.len / 2 + u.cantLeft + u.as, -u.r - u.waterStop.h - u.as)
        .lineBy(0, -h)
        .lineBy(w, 0)
        .lineBy(0, h)
        .lineBy(-w, 0).thickLine(),
      new Polyline(u.len / 2 - u.cantRight - u.as, -u.r - u.waterStop.h - u.as)
        .lineBy(0, -h)
        .lineBy(-w, 0)
        .lineBy(0, h)
        .lineBy(w, 0).thickLine()
    );
  }
  protected drawSEndBeam(): void{
    const u = this.struct;
    const fig = this.figures.sEndBeam;
    const bar = this.specs.end.bStir;
    const r = fig.drawRadius;
    const w = u.endSect.b - 2*u.as;
    const h = u.endHeight - u.hd - u.r - u.support.h - 2*u.as - u.waterStop.h;
    const y = h / 2;
    fig.push(
      new PlaneRebar(fig.textHeight)
        .rebar(new Polyline(u.as, -u.waterStop.h - u.as).lineBy(w, 0).lineBy(0, -h).lineBy(-w, 0).lineBy(0, h))
        .spec(bar, 0, bar.space)
        .leaderNote(vec(-2*fig.textHeight, -u.waterStop.h - u.as - r - y), vec(1, 0))
        .generate()
    );
  }
}
