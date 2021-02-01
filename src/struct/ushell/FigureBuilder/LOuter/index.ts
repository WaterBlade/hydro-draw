import { UShellFigureContext } from "../../UShell";
import { RebarEnd } from "./RebarEnd";
import { RebarShell } from "./RebarShell";
import { RebarTrans } from "./RebarTrans";

export class LOuter extends UShellFigureContext {
  protected end = new RebarEnd(this.context, this.figures);
  protected shell = new RebarShell(this.context, this.figures);
  protected trans = new RebarTrans(this.context, this.figures);
  initFigure(): this {
    this.figures.lOuter
      .resetScale(1, 50)
      .setTitle("槽身跨中钢筋图")
      .displayScale()
      .centerAligned()
      .keepTitlePos();
    this.figures.record(this.figures.lOuter);
    return this;
  }
  build(): void {
    this.buildOutline();
    this.buildRebar();
    this.buildDim();
  }
  protected buildOutline(): this {
    const u = this.struct;
    const fig = this.figures.lOuter;
    fig.addOutline(u.genLOuterLine().greyLine());
    return this;
  }
  protected buildRebar(): void {
    this.end.build();
    this.shell.build();
    this.trans.build();
  }
  protected buildDim(): this {
    const u = this.struct;
    const fig = this.figures.lOuter;
    const box = fig.getBoundingBox();
    const dim = fig.dimBuilder();
    dim.hBottom(-u.len / 2, box.bottom - 2 * fig.textHeight);
    if (u.cantLeft > 0) {
      dim.dim(u.cantLeft - u.lenTrans).dim(u.lenTrans);
    }
    dim
      .dim(u.endSect.b)
      .dim(u.lenTrans)
      .dim(u.len - u.cantLeft - u.cantRight - 2 * u.lenTrans - 2 * u.endSect.b)
      .dim(u.lenTrans)
      .dim(u.endSect.b);
    if (u.cantRight > 0) {
      dim.dim(u.lenTrans).dim(u.cantRight - u.lenTrans);
    }
    dim.next().dim(u.len);

    dim
      .vRight(box.right + 2 * fig.textHeight, u.shell.hd)
      .dim(u.shellHeight)
      .dim(u.oBeam.w);

    const d = u.endHeight - u.shellHeight - u.oBeam.w;
    if (d > 0) dim.dim(d);
    dim.next().dim(u.endHeight);

    fig.push(dim.generate());
    return this;
  }
}
