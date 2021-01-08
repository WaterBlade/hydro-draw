import { FigureBase } from "./Base";

export class LOuter extends FigureBase{
  initFigure(): this{
    this.figures.lOuter.reset(1, 50)
      .setTitle("槽身跨中钢筋图")
      .displayScale()
      .centerAligned()
      .keepTitlePos();
    this.figures.record(this.figures.lOuter);
    return this;
  }
  buildOutline(): this{
    this.figures.lOuter.addOutline(this.struct.genLOuterLine().greyLine());
    return this;
  }
  buildDim(): this{
    const u = this.struct;
    const fig = this.figures.lOuter;
    const box = fig.getBoundingBox();
    const dim = fig.dimBuilder();
    dim.hBottom(-u.len / 2, box.bottom - 2 * fig.textHeight);
    if (u.cantLeft > 0) {
      dim.dim(u.cantLeft - u.trans).dim(u.trans);
    }
    dim
      .dim(u.endSect.b)
      .dim(u.trans)
      .dim(u.len - u.cantLeft - u.cantRight - 2 * u.trans - 2 * u.endSect.b)
      .dim(u.trans)
      .dim(u.endSect.b);
    if (u.cantRight > 0) {
      dim.dim(u.trans).dim(u.cantRight);
    }
    dim.next().dim(u.len);

    dim
      .vRight(box.right + 2 * fig.textHeight, u.hd)
      .dim(u.shellHeight)
      .dim(u.oBeam.w);

    const d = u.endHeight - u.shellHeight - u.oBeam.w;
    if (d > 0) dim.dim(d);
    dim.next().dim(u.endHeight);

    fig.push(dim.generate());
    return this;
  }
}