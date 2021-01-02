import { Arc, ArrowNote, Line, Polyline, RebarPathForm, vec } from "@/draw";
import { UShellRebarBuilder } from "../../UShellRebar";

export class BeamStirBar extends UShellRebarBuilder {
  buildRebar(): this {
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
    return this;
  }
  buildFigure(): this {
    const bar = this.rebars.end.bStir;
    this.drawCEnd();
    this.drawLInner();
    this.figures.rTable.push(bar);
    this.figures.mTable.push(bar);
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
  protected drawCEnd(): void {
    const u = this.struct;
    const bar = this.rebars.end.bStir;
    const midCount = this.rebars.end.bMid.singleCount;
    const fig = this.figures.cEnd;
    const y0 = u.hd - u.endHeight + u.support.h + u.as;
    const y1 = -u.r - u.waterStop.h - u.as;
    const y = y0 + (0.5 * (y1 - y0)) / (midCount + 1);
    const lens = this.genMulShape();
    fig.push(
      new ArrowNote(fig.textHeight)
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
    const h = u.endHeight - u.shellHeight - 2 * u.as;
    const w = u.endSect.b - 2 * u.as;
    fig.push(
      new Polyline(-u.len / 2 + u.cantLeft + u.as, -u.r - u.waterStop.h - u.as)
        .lineBy(0, -h)
        .lineBy(w, 0)
        .lineBy(0, h)
        .lineBy(-w, 0),
      new Polyline(u.len / 2 - u.cantRight - u.as, -u.r - u.waterStop.h - u.as)
        .lineBy(0, -h)
        .lineBy(-w, 0)
        .lineBy(0, h)
        .lineBy(w, 0)
    );
  }
}
