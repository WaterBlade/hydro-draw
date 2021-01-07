import { Arc, PlaneRebar, Line, Polyline, RebarPathForm, vec } from "@/draw";
import { UShellRebarBuilder } from "../../../UShellRebar";

export class BeamStirBar extends UShellRebarBuilder {
  build(): this {
    const u = this.struct;
    const bar = this.rebars.end.bStir;
    const lens = this.genMulShape().map((l) => l.calcLength());
    bar
      .setForm(
        RebarPathForm.RectWidthHook(bar.diameter, u.endSect.b - 2 * u.as, lens)
      )
      .setCount(2 * lens.length)
      .setId(this.id())
      .setStructure(this.name);
    this.figures.rTable.push(bar);
    this.figures.mTable.push(bar);
    this.drawCEnd();
    this.drawLInner();
    this.drawSEndBeam();
    return this;
  }
  protected genMulShape(): Line[] {
    const u = this.struct;
    const bar = this.rebars.end.bStir;
    const l = Math.min(u.r, u.r + u.t + u.oBeam.w - u.endSect.w);
    const y = u.hd - u.endHeight + u.support.h + u.as;
    const pts = new Line(vec(-l, y), vec(l, y)).divide(bar.space).points;
    const topEdge = new Arc(vec(0, 0), u.r + u.waterStop.h + u.as, 180, 0);
    return pts.map((p) => new Line(p, topEdge.rayIntersect(p, vec(0, 1))[0]));
  }
  cEnd = this.figures.cEnd.planeRebar();
  protected drawCEnd(): void {
    const bar = this.rebars.end.bStir;
    const lens = this.genMulShape();
    this.cEnd
      .spec(bar, lens.length, bar.space)
      .rebar(...lens)
  }
  lInner: PlaneRebar[] = [];
  protected drawLInner(): void {
    const u = this.struct;
    const fig = this.figures.lInner;
    const h = u.endHeight - u.hd - u.r - 2 * u.as - u.waterStop.h - u.support.h;
    const w = u.endSect.b - 2 * u.as;
    this.lInner.push(
      fig.planeRebar().rebar(new Polyline(-u.len / 2 + u.cantLeft + u.as, -u.r - u.waterStop.h - u.as)
        .lineBy(0, -h)
        .lineBy(w, 0)
        .lineBy(0, h)
        .lineBy(-w, 0)),
      fig.planeRebar().rebar(new Polyline(u.len / 2 - u.cantRight - u.as, -u.r - u.waterStop.h - u.as)
        .lineBy(0, -h)
        .lineBy(-w, 0)
        .lineBy(0, h)
        .lineBy(w, 0))
    );
  }
  sEndBeam = this.figures.sEndBeam.planeRebar();
  protected drawSEndBeam(): void{
    const u = this.struct;
    const bar = this.rebars.end.bStir;
    const w = u.endSect.b - 2*u.as;
    const h = u.endHeight - u.hd - u.r - u.support.h - 2*u.as - u.waterStop.h;
    this.sEndBeam
      .rebar(new Polyline(u.as, -u.waterStop.h - u.as).lineBy(w, 0).lineBy(0, -h).lineBy(-w, 0).lineBy(0, h))
      .spec(bar, 0, bar.space)
  }
}
