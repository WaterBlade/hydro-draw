import { Line, vec } from "@/draw";
import { FigureBase } from "./Base";

export class CTrans extends FigureBase{
  initFigure(): this{
    this.figures.cTrans
      .reset(1, 50)
      .setTitle('槽身渐变段钢筋图')
      .displayScale()
      .keepTitlePos()
      .centerAligned()
    this.figures.record(this.figures.cTrans);
    return this;
  }
  buildOutline(): this{
    const u = this.struct;
    this.figures.cTrans.addOutline(
      u.genCInner().greyLine(),
      u.genTransCOuter().greyLine(),
      u.genEndCOuter().greyLine(),
      new Line(vec(-u.r + u.iBeam.w, u.hd), vec(-u.r -u.t - u.oBeam.w, u.hd)).greyLine(),
      new Line(vec(u.r - u.iBeam.w, u.hd), vec(u.r +u.t + u.oBeam.w, u.hd)).greyLine(),
    )
    return this;
  }
  buildDim(): this{
    return this;
  }
}