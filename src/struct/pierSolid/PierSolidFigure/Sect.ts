import { Polyline } from "@/draw";
import { Figure, FigureContent } from "@/struct/utils";
import { PierSolidStruct } from "../PierSolidStruct";

export class PierSolidSect extends Figure{
  initFigure(): void{
    this.fig = new FigureContent();
    const { id, title } = this.container.sectId;
    this.fig
      .resetScale(1, 50)
      .setTitle(title)
      .setId(id)
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
    const w = t.w.val - 2*t.fr.val;
    const l = t.l.val - 2*t.fr.val;
    const r = t.fr.val;
    fig.addOutline(
      new Polyline(-l/2-r, w/2)
        .lineBy(0, -w)
        .arcBy(r, -r, 90)
        .lineBy(l, 0)
        .arcBy(r, r, 90)
        .lineBy(0, w)
        .arcBy(-r, r, 90)
        .lineBy(-l, 0)
        .arcBy(-r, -r, 90).greyLine()
    );
  }
  protected buildDim(t: PierSolidStruct): void{
    const fig = this.fig;
    const {top, right} = fig.getBoundingBox();
    const dim= fig.dimBuilder();
    dim.hTop(-t.l.val/2, top+fig.h)
      .dim(t.fr.val).dim(t.l.val - 2*t.fr.val).dim(t.fr.val)
      .next().dim(t.l.val);

    dim.vRight(right+fig.h, t.w.val/2)
      .dim(t.fr.val).dim(t.w.val - 2*t.fr.val).dim(t.fr.val)
      .next().dim(t.w.val);

    fig.push(dim.generate());

  }
}