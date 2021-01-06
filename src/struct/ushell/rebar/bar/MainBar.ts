import { Circle, RebarPathForm, SparsePointNote, vec } from "@/draw";
import { UShellRebarBuilder } from "../../UShellRebar";

export class MainBar extends UShellRebarBuilder{
  buildRebar(): this{
    const u = this.struct;
    const bar = this.rebars.bar.main;
    const pts = u.genBarCenters();
    bar
      .setCount(pts.length * 4)
      .setId(this.id())
      .setStructure(this.name)
      .setForm(RebarPathForm.Line(bar.diameter, 2*u.r + 2*u.t + 2*u.oBeam.w - 2*u.as));
    return this;
  }
  buildFigure(): this{
    const bar = this.rebars.bar.main;
    this.drawLInner();
    this.drawSBar();
    this.figures.rTable.push(bar);
    this.figures.mTable.push(bar);
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
    const bar = this.rebars.bar.main;
    const {w, h} = u.bar;
    const fig = this.figures.sBar;
    const r = fig.drawRadius;
    const w0 = w/2 - u.as - r;
    const h0 = h/2 - u.as -r;
    fig.push(
      new SparsePointNote(fig.textHeight, r)
        .points(vec(-w0, h0), vec(w0, h0), vec(-w0, -h0), vec(w0, -h0))
        .spec(bar, 4)
        .jointLeader(vec(0, 0), vec(-w/2 - 2*fig.textHeight, 0))
        .generate()
    )
  }
}