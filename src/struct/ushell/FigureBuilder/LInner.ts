import { Line, Polyline, vec } from "@/draw";
import { FigureBase } from "./Base";

export class LInner extends FigureBase {
  initFigure(): this {
    this.figures.lInner
      .reset(1, 50)
      .setTitle("槽身纵剖钢筋图")
      .displayScale()
      .centerAligned()
      .keepTitlePos();
    this.figures.record(this.figures.lInner);
    return this;
  }
  buildOutline(): this {
    const u = this.struct;
    const fig = this.figures.lInner;
    fig.addOutline(this.struct.genLOuterLine().greyLine());
    const left = new Polyline(-u.len / 2 + u.waterStop.w, u.shell.hd)
      .lineBy(0, -u.shell.hd - u.shell.r - u.waterStop.h)
      .lineBy(-u.waterStop.w, 0);
    const right = left.mirrorByVAxis();
    fig.addOutline(
      new Line(
        vec(-u.len / 2 + u.waterStop.w, -u.shell.r),
        vec(u.len / 2 - u.waterStop.w, -u.shell.r)
      ).greyLine(),
      left.greyLine(),
      right.greyLine()
    );
    if (u.support.h > 0) {
      const y = u.shell.hd - u.endHeight + u.support.h;
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
    const { w, h } = u.bar;
    for (const p of pts) {
      const { x, y } = p;
      fig.addOutline(
        new Polyline(x - w / 2, y + h / 2)
          .lineBy(w, 0)
          .lineBy(0, -h)
          .lineBy(-w, 0)
          .lineBy(0, h)
          .greyLine()
      );
    }
    return this;
  }
  buildNote(): this{
    const u = this.struct;
    const fig = this.figures.lInner;
    const h = u.endHeight - u.shell.hd - u.shell.r - u.shell.tb;
    const bot = u.shell.hd - u.endHeight;
    const y = -u.shell.r-u.shell.tb - 0.25*h;
    const r = 0.75*h;
    // end beam
    if(u.isLeftFigureExist()){
      const id = this.figures.sEndBLeft.id;
      const x = -u.len/2+u.endSect.b/2
      fig.leaderSpec(`大样${id}`, vec(x, y), r, vec(x-fig.h, bot-2*fig.h))
    }
    if(u.isLeftCantFigureExist()){
      const id = this.figures.sEndCantBLeft.id;
      const x = -u.len/2+u.endSect.b/2 + u.cantLeft;
      fig.leaderSpec(`大样${id}`, vec(x, y), r, vec(x+fig.h, bot-2*fig.h))
    }
    if(u.isRightFigureExist()){
      const id = this.figures.sEndBRight.id;
      const x = u.len/2-u.endSect.b/2
      fig.leaderSpec(`大样${id}`, vec(x, y), r, vec(x+fig.h, bot-2*fig.h))
    }
    if(u.isRightCantFigureExist()){
      const id = this.figures.sEndCantBRight.id;
      const x = u.len/2-u.endSect.b/2 - u.cantRight;
      fig.leaderSpec(`大样${id}`, vec(x, y), r, vec(x-fig.h, bot-2*fig.h))
    }
    // bar
    const pts = u.genBarCenters();
    const pt = pts[Math.floor(pts.length/2)];
    const id = this.figures.sBar.id;
    fig.leaderSpec(`大样${id}`, pt, 1.5*u.bar.w, pt.add(vec(3*fig.h, -5*fig.h)));
    return this;
  }
  buildDim(): this {
    const u = this.struct;
    const fig = this.figures.lInner;
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
      .dim(u.shell.hd + u.shell.r)
      .dim(u.shell.t + u.shell.hb)
      .dim(u.oBeam.w);

    const d = u.endHeight - u.shellHeight - u.oBeam.w;
    if (d > 0) dim.dim(d);
    dim.next().dim(u.endHeight);

    const pts = u.genBarCenters();
    const { w } = u.bar;

    dim.hTop(-u.len / 2, box.top + 2 * fig.textHeight).dim(u.waterStop.w);
    for (let i = 0; i < pts.length - 1; i++) {
      const l = pts[i + 1].x - pts[i].x;
      dim.dim(w).dim(l - w);
    }
    dim.dim(w).dim(u.waterStop.w);

    fig.push(dim.generate());
    return this;
  }
}
