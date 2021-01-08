import { Line, Polyline, vec } from "@/draw";
import { FigureBase } from "./Base";

export class LInner extends FigureBase{
  initFigure(): this{
    this.figures.lInner.reset(1, 50)
      .setTitle("槽身纵剖钢筋图")
      .displayScale()
      .centerAligned()
      .keepTitlePos();
    this.figures.record(this.figures.lInner);
    return this;
  }
  buildOutline(): this{
    const u = this.struct;
    const fig = this.figures.lInner;
    fig.addOutline(this.struct.genLOuterLine().greyLine());
    const left = new Polyline(-u.len / 2 + u.waterStop.w, u.hd)
      .lineBy(0, -u.hd - u.r - u.waterStop.h)
      .lineBy(-u.waterStop.w, 0);
    const right = left.mirrorByYAxis();
    fig.addOutline(
      new Line(
        vec(-u.len / 2 + u.waterStop.w, -u.r),
        vec(u.len / 2 - u.waterStop.w, -u.r)
      ).greyLine(),
      left.greyLine(),
      right.greyLine()
    );
    if (u.support.h > 0) {
      const y = u.hd - u.endHeight + u.support.h;
      fig.addOutline(
        new Line(
          vec(-u.len / 2 + u.cantLeft, y),
          vec(-u.len / 2 + u.cantLeft + u.endSect.b, y)
        ).greyLine(),
        new Line(
          vec(u.len / 2 - u.cantRight, y),
          vec(u.len / 2 - u.cantRight - u.endSect.b, y)
        ).greyLine()
      );
    }
    const pts = u.genBarCenters();
    const {w, h} = u.bar;
    for(const p of pts){
      const {x, y} = p;
      fig.addOutline(new Polyline(x-w/2, y + h/2).lineBy(w, 0).lineBy(0, -h).lineBy(-w, 0).lineBy(0, h).greyLine());
    }
    return this;
  }
  buildDim(): this{
    const u = this.struct;
    const fig = this.figures.lInner;
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
      .dim(u.hd + u.r)
      .dim(u.t + u.butt.h)
      .dim(u.oBeam.w);

    const d = u.endHeight - u.shellHeight - u.oBeam.w;
    if (d > 0) dim.dim(d);
    dim.next().dim(u.endHeight);

    const pts = u.genBarCenters();
    const {w} = u.bar;
    
    dim.hTop(-u.len/2, box.top + 2* fig.textHeight).dim(u.waterStop.w)
    for(let i = 0; i < pts.length-1; i++){
      const l = pts[i+1].x - pts[i].x;
      dim.dim(w).dim(l-w)
    }
    dim.dim(w).dim(u.waterStop.w);

    fig.push(dim.generate());
    return this;
  }
}