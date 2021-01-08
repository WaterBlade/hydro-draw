import { Circle, RebarPathForm, vec } from "@/draw";
import { RebarBase } from "../Base";

export class MainBar extends RebarBase{
  buildSpec(): this{
    const u = this.struct;
    const bar = this.specs.bar.main;
    const pts = u.genBarCenters();
    bar
      .setCount(pts.length * 4)
      .setId(this.id())
      .setStructure(this.name)
      .setForm(RebarPathForm.Line(bar.diameter, 2*u.r + 2*u.t + 2*u.oBeam.w - 2*u.as));
    this.specs.record(bar);
    return this;
  }
  buildFigure(): this{
    this.drawLInner();
    this.drawSBar();
    return this;
  }
  protected drawLInner(): void{
    const u = this.struct;
    const {w, h} = u.bar;
    const fig = this.figures.lInner;
    const r = fig.drawRadius;
    const w0 = w/2 - u.as - r;
    const h0 = h/2 - u.as - r;
    const pts = u.genBarCenters();
    for(const p of pts){
      fig.push(
        new Circle(p.add(vec(-w0, h0)), r).thickLine(),
        new Circle(p.add(vec(w0, h0)), r).thickLine(),
        new Circle(p.add(vec(-w0, -h0)), r).thickLine(),
        new Circle(p.add(vec(w0, -h0)), r).thickLine(),
      );
    }
  }
  protected drawSBar(): void{
    const u = this.struct;
    const bar = this.specs.bar.main;
    const {w, h} = u.bar;
    const fig = this.figures.sBar;
    const w0 = w/2 - u.as - fig.r;
    const h0 = h/2 - u.as -fig.r;
    fig.push(
      fig.sparsePointRebar()
        .points(vec(-w0, h0), vec(w0, h0), vec(-w0, -h0), vec(w0, -h0))
        .spec(bar, 4)
        .jointLeader(vec(0, 0), vec(-w / 2 - 2 * fig.h, 0))
        .generate()
    )
  }
}