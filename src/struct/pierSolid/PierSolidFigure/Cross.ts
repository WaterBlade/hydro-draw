import { Line, Polyline, vec } from "@/draw";
import { Figure, FigureContent } from "@/struct/utils";
import { PierSolidStruct } from "../PierSolidStruct";

export class PierSolidCross extends Figure{
  initFigure(): void{
    this.fig = new FigureContent();
    this.fig
      .resetScale(1, 100)
      .setTitle('实心墩垂直水流向立面钢筋图')
      .displayScale()
      .centerAligned()
      .baseAligned()
      .keepTitlePos();
    this.container.record(this.fig);
  }
  build(t: PierSolidStruct): void{
    this.buildOutline(t);
    this.buildDim(t);
  }
  protected buildOutline(t: PierSolidStruct): void{
    const fig = this.fig;
    fig.addOutline(
      new Polyline(-t.topBeam.l.val / 2, t.h.val)
        .lineBy(0, t.topBeam.h.val)
        .lineBy(t.topBeam.l.val, 0)
        .lineBy(0, -t.topBeam.h.val)
        .lineBy(-t.topBeam.l.val, 0)
        .greyLine(),
      new Line(vec(-t.l.val / 2, t.h.val), vec(-t.l.val/2, 0)).greyLine(),
      new Line(vec(t.l.val / 2, t.h.val), vec(t.l.val/2, 0)).greyLine(),
      new Polyline(-t.found.l.val / 2, 0)
        .lineBy(0, -t.found.h.val)
        .lineBy(t.found.l.val, 0)
        .lineBy(0, t.found.h.val)
        .lineBy(-t.found.l.val, 0)
        .greyLine(),
    )
  }
  protected buildDim(t: PierSolidStruct): void{
    const fig = this.fig;
    const dim = fig.dimBuilder();
    const {top, right} = fig.getBoundingBox();
    dim.vRight(right+fig.h, t.h.val+t.topBeam.h.val)
      .dim(t.topBeam.h.val)
      .dim(t.h.val)
      .dim(t.found.h.val);
    
    dim.hTop(-t.l.val/2, top+fig.h)
      .dim(t.l.val);

    fig.push(dim.generate());
  }
}