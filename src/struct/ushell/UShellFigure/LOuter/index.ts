import { Figure, FigureContent } from "@/struct/utils";
import { UShellRebar } from "../../UShellRebar";
import { UShellStruct } from "../../UShellStruct";
import { RebarEnd } from "./RebarEnd";
import { RebarShell } from "./RebarShell";
import { RebarTrans } from "./RebarTrans";

export class LOuter extends Figure{
  protected end = new RebarEnd();
  protected shell = new RebarShell();
  protected trans = new RebarTrans();
  initFigure(): this {
    this.fig = new FigureContent();
    this.fig
      .resetScale(1, 50)
      .setTitle("槽身跨中钢筋图")
      .displayScale()
      .centerAligned()
      .keepTitlePos();
    this.container.record(this.fig);
    return this;
  }
  build(u: UShellStruct, rebars: UShellRebar): void {
    this.buildOutline(u);
    this.buildRebar(u, rebars);
    this.buildDim(u);
  }
  protected buildOutline(u: UShellStruct): this {
    this.fig.addOutline(u.genLOuterLine().greyLine());
    return this;
  }
  protected buildRebar(u: UShellStruct, rebars: UShellRebar): void {
    this.end.build(u, rebars, this.fig);
    this.shell.build(u, rebars, this.fig);
    this.trans.build(u, rebars, this.fig);
  }
  protected buildDim(u: UShellStruct): this {
    const fig = this.fig;
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
