import {
  Line,
  RebarPathForm,
  vec,
} from "@/draw";
import { UShellRebarBuilder } from "../../../UShellRebar";

export class MainBar extends UShellRebarBuilder {
  build(): this {
    const u = this.struct;
    const bar = this.rebars.shell.main;
    bar.setForm(RebarPathForm.Line(bar.diameter, u.len - 2 * u.as));
    bar.setId(this.id()).setStructure(this.name);
    this.figures.rTable.push(bar);
    this.figures.mTable.push(bar);
    this.drawCMid();
    this.drawLInner();
    this.drawLOuter();
    return this;
  }
  cMidLayer = this.figures.cMid.layerPointRebar();
  cMidLine = this.figures.cMid.linePointRebar();
  isCMidLayer = true;
  protected drawCMid(): void {
    const u = this.struct;
    const bar = this.rebars.shell.main;
    const fig = this.figures.cMid;
    const y = u.bottom + u.as + fig.drawRadius;
    const left = vec(-u.butt.w / 2, y);
    const right = vec(u.butt.w / 2, y);
    if (bar.layerCount > 1) {
      this.cMidLayer
          .spec(bar, bar.count)
          .layers(left, right, bar.singleCount, bar.layerSpace, bar.layerCount)

    } else {
      this.isCMidLayer = false;
      this.cMidLine
          .spec(bar, bar.count)
          .line(new Line(left, right).divideByCount(bar.count - 1))
    }
  }
  lInner = this.figures.lInner.planeRebar();
  protected drawLInner(): void {
    const u = this.struct;
    const bar = this.rebars.shell.main;
    const fig = this.figures.lInner;
    const y = -u.r - u.t - u.butt.h + u.as + fig.drawRadius;
    this.lInner
        .rebar(new Line(vec(-u.len / 2 + u.as, y), vec(u.len / 2 - u.as, y)))
        .spec(bar)
  }
  lOuter = this.figures.lOuter.planeRebar();
  protected drawLOuter(): void {
    const u = this.struct;
    const bar = this.rebars.shell.main;
    const y = -u.r - u.t - u.butt.h + u.as;
    this.lOuter
        .rebar(new Line(vec(-u.len / 2 + u.as, y), vec(u.len / 2 - u.as, y)))
        .spec(bar)
  }
}
