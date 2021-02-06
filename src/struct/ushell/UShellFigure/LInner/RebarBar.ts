import { Circle, Polyline, vec } from "@/draw";
import { FigureContent } from "@/struct/utils";
import { UShellRebar } from "../../UShellRebar";
import { UShellStruct } from "../../UShellStruct";

export class RebarBar{
  build(u: UShellStruct, rebars: UShellRebar, fig: FigureContent): void {
    this.drawMain(u, rebars, fig);
    this.drawStir(u, rebars, fig);
  }
  protected drawMain(u: UShellStruct, rebars: UShellRebar, fig: FigureContent): void {
    const { w, h } = u.bar;
    const r = fig.drawRadius;
    const as = rebars.info.asBar;
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
  protected drawStir(u: UShellStruct, rebars: UShellRebar, fig: FigureContent): void {
    const as = rebars.info.asBar;
    const w0 = u.bar.w - 2 * as;
    const h0 = u.bar.h - 2 * as;
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
