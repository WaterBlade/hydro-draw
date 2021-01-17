import { PlaneRebar, Line, Polyline, RebarFormPreset, vec } from "@/draw";
import { RebarBase } from "../Base";

export class StirBar extends RebarBase {
  buildSpec(): this {
    const u = this.struct;
    const bar = this.specs.bar.stir;
    const as = this.specs.asBar;
    const pts = u.genBarCenters();
    const lines = this.genShape();
    bar
      .setId(this.specs.id.gen())
      .setStructure(this.name)
      .setCount(pts.length * lines.length)
      .setForm(
        RebarFormPreset.RectStir(
          bar.diameter,
          u.bar.h - 2 * as,
          u.bar.w - 2 * as
        )
      );
    this.specs.record(bar);
    return this;
  }
  buildFigure(): this {
    this.drawLInner();
    this.drawSBar();
    return this;
  }
  protected genShape(): Line[] {
    const u = this.struct;
    const bar = this.specs.bar.stir;
    const h = u.bar.h;
    const x0 = -u.shell.r + u.iBeam.w;
    const x1 = -x0;
    const y = u.shell.hd - h / 2;
    const pts = new Line(vec(x0, y), vec(x1, y))
      .divide(bar.space)
      .removeStartPt()
      .removeEndPt().points;
    return pts.map(
      (p) => new Line(p.add(vec(0, h / 2)), p.add(vec(0, -h / 2)))
    );
  }
  protected drawLInner(): void {
    const u = this.struct;
    const as = this.specs.asBar;
    const w0 = u.bar.w - 2 * as;
    const h0 = u.bar.h - 2 * as;
    const fig = this.figures.lInner;
    const pts = u.genBarCenters();
    for (const p of pts) {
      const { x, y } = p;
      fig.push(
        new Polyline(x - w0 / 2, y + h0 / 2)
          .lineBy(w0, 0)
          .lineBy(0, -h0)
          .lineBy(-w0, 0)
          .lineBy(0, h0)
          .thickLine()
      );
    }
  }
  protected drawSBar(): void {
    const u = this.struct;
    const bar = this.specs.bar.stir;
    const { w, h } = u.bar;
    const fig = this.figures.sBar;
    const as = this.specs.asBar;
    const w0 = w / 2 - as;
    const h0 = h / 2 - as;
    fig.push(
      new PlaneRebar(fig.textHeight)
        .rebar(
          new Polyline(-w0, h0)
            .lineBy(2 * w0, 0)
            .lineBy(0, -2 * h0)
            .lineBy(-2 * w0, 0)
            .lineBy(0, 2 * h0)
        )
        .spec(bar, 0, bar.space)
        .leaderNote(vec(0, h / 2 + 2 * fig.textHeight), vec(0, 1), vec(-1, 0))
        .generate()
    );
  }
}
