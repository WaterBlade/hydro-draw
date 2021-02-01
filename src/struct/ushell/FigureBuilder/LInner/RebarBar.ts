import { Circle, Polyline, vec } from "@/draw";
import { UShellFigureContext } from "../../UShell";

export class RebarBar extends UShellFigureContext {
  build(): void {
    this.drawMain();
    this.drawStir();
  }
  protected drawMain(): void {
    const u = this.struct;
    const { w, h } = u.bar;
    const fig = this.figures.lInner;
    const r = fig.drawRadius;
    const as = this.rebars.asBar;
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
  protected drawStir(): void {
    const u = this.struct;
    const as = this.rebars.asBar;
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
}
