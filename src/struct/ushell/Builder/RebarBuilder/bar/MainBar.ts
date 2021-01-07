import { RebarPathForm, SparsePointRebar, vec } from "@/draw";
import { UShellRebarBuilder } from "../../../UShellRebar";

export class MainBar extends UShellRebarBuilder{
  build(): this{
    const u = this.struct;
    const bar = this.rebars.bar.main;
    const pts = u.genBarCenters();
    bar
      .setCount(pts.length * 4)
      .setId(this.id())
      .setStructure(this.name)
      .setForm(RebarPathForm.Line(bar.diameter, 2*u.r + 2*u.t + 2*u.oBeam.w - 2*u.as));
    this.figures.rTable.push(bar);
    this.figures.mTable.push(bar);

    this.drawLInner();
    this.drawSBar();
    return this;
  }
  lInner: SparsePointRebar[] = [];
  protected drawLInner(): void{
    const u = this.struct;
    const {w, h} = u.bar;
    const fig = this.figures.lInner;
    const r = fig.drawRadius;
    const w0 = w/2 - u.as - r;
    const h0 = h/2 - u.as - r;
    const pts = u.genBarCenters();
    this.lInner = pts.map(
      p => fig.sparsePointRebar().points(
        p.add(vec(-w0, h0)),
        p.add(vec(w0, h0)),
        p.add(vec(-w0, -h0)),
        p.add(vec(w0, -h0)),
      )
    )
  }
  sBar = this.figures.sBar.sparsePointRebar();
  protected drawSBar(): void{
    const u = this.struct;
    const bar = this.rebars.bar.main;
    const {w, h} = u.bar;
    const fig = this.figures.sBar;
    const r = fig.drawRadius;
    const w0 = w/2 - u.as - r;
    const h0 = h/2 - u.as -r;
    this.sBar
      .points(vec(-w0, h0), vec(w0, h0), vec(-w0, -h0), vec(w0, -h0))
      .spec(bar, 4)
  }
}