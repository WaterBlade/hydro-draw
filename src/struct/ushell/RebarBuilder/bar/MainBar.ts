import { Circle, RebarFormPreset, vec } from "@/draw";
import { RebarBase } from "../Base";

export class MainBar extends RebarBase {
  buildSpec(): this {
    const u = this.struct;
    const bar = this.specs.bar.main;
    const as = this.specs.asBar;
    const pts = u.genBarCenters();
    bar
      .setCount(pts.length * 4)
      .setId(this.specs.id.gen())
      .setStructure(this.name)
      .setForm(
        RebarFormPreset.Line(
          bar.diameter,
          2 * u.shell.r + 2 * u.shell.t + 2 * u.oBeam.w - 2 * as
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
  protected drawLInner(): void {
    const u = this.struct;
    const { w, h } = u.bar;
    const fig = this.figures.lInner;
    const r = fig.drawRadius;
    const as = this.specs.asBar;
    const w0 = w / 2 - as - r;
    const h0 = h / 2 - as - r;
    const pts = u.genBarCenters();
    for (const p of pts) {
      fig.push(
        new Circle(p.add(vec(-w0, h0)), r).thickLine(),
        new Circle(p.add(vec(w0, h0)), r).thickLine(),
        new Circle(p.add(vec(-w0, -h0)), r).thickLine(),
        new Circle(p.add(vec(w0, -h0)), r).thickLine()
      );
    }
  }
  protected drawSBar(): void {
    const u = this.struct;
    const bar = this.specs.bar.main;
    const { w, h } = u.bar;
    const fig = this.figures.sBar;
    const as = this.specs.asBar;
    const w0 = w / 2 - as - fig.r;
    const h0 = h / 2 - as - fig.r;
    fig.push(
      fig
        .sparsePointRebar()
        .points(vec(-w0, h0), vec(w0, h0), vec(-w0, -h0), vec(w0, -h0))
        .spec(bar, 4)
        .jointLeader(vec(0, 0), vec(-w / 2 - 2 * fig.h, 0))
        .generate()
    );
  }
}
