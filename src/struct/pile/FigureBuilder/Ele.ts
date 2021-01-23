import { Line, Polyline, Text, TextAlign, vec } from "@/draw";
import { FigureBase } from "../Base";

export class Ele extends FigureBase{
  initFigure(): this{
    const fig = this.figures.ele;
    fig
      .resetScale(1, 50)
      .setTitle('桩身结构钢筋图')
      .displayScale()
      .keepTitlePos()
      .centerAligned();
    this.figures.record(fig);
    return this;
  }
  buildOutline(): this{
    const t = this.struct;
    const fig = this.figures.ele;
    const s = 500;
    fig.addOutline(
      new Polyline(-t.d/2, t.hs)
        .lineBy(0, -t.hs-t.h)
        .arcBy(t.d, 0, 60)
        .lineBy(0, t.hs+t.h).close().greyLine(),
      new Line(vec(-t.d/2, 0), vec(-t.d/2-s, 0)).greyLine(),
      new Line(vec(t.d/2, 0), vec(t.d/2+s, 0)).greyLine(),
      new Line(vec(-t.d/2-s, t.hp), vec(t.d/2+s, t.hp)).greyLine(),
    );
    return this;
  }
  buildNote(): this{
    const fig = this.figures.ele;
    const {left, right, top} = fig.outline.getBoundingBox();
    fig.breakline(vec(left, 0), vec(left, top));
    fig.breakline(vec(right, 0), vec(right, top));
    return this;
  }
  buildDim(): this{
    const fig = this.figures.ele;
    const t = this.struct;
    const dim = fig.dimBuilder();
    const bar = this.specs.stir;
    const right = fig.getBoundingBox().right+fig.h;
    const bottom = fig.getBoundingBox().bottom;
    dim.vRight(right+0.5*fig.h, t.hs)
    if(t.hs > 0){
      dim.dim(t.hs)
    }
    const ln = this.specs.denseFactor * t.d;
    dim.dim(ln).dim(t.h-ln, `H-${ln}`).next().skip(t.hs).dim(t.h, '桩长H');

    dim.hBottom(-t.d/2, bottom-fig.h).dim(t.d);
    fig.push(
      dim.generate(),
      new Text(`间距${bar.denseSpace}`, vec(right, -0.5*ln), fig.h, TextAlign.BottomCenter, 90),
      new Text(`间距${bar.space}`, vec(right, (-t.h-ln)/2), fig.h, TextAlign.BottomCenter, 90),
      )
    return this;
  }
}