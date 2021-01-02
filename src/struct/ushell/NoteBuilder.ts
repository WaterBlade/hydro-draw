import { DimensionBuilder } from "@/draw";
import { UShell } from "./UShell";
import { UShellFigure } from "./UShellFigure";

export class NoteBuilder {
  constructor(protected struct: UShell, protected figures: UShellFigure) {}
  build(): this {
    this.drawLOuter();
    this.drawLInner();
    this.drawCMid();
    this.drawCEnd();
    return this;
  }
  protected drawLOuter(): void {
    const u = this.struct;
    const fig = this.figures.lOuter;
    const box = fig.getBoundingBox();
    const dim = new DimensionBuilder(fig.unitScale, fig.drawScale);
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
    fig.title("槽身外侧钢筋图", true);
  }
  protected drawLInner(): void {
    const u = this.struct;
    const fig = this.figures.lInner;
    const box = fig.getBoundingBox();
    const dim = new DimensionBuilder(fig.unitScale, fig.drawScale);
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

    fig.push(dim.generate());
    fig.title("槽身纵剖钢筋图", true);
  }
  protected drawCMid(): void {
    const u = this.struct;
    const fig = this.figures.cMid;
    const dim = new DimensionBuilder(fig.unitScale, fig.drawScale);
    const box = fig.getBoundingBox();
    const transPt = u.transPt[0];
    // Top dim
    dim.hTop(-u.r - u.t - u.oBeam.w, box.top + 2 * fig.textHeight);
    if (u.oBeam.w > 0) dim.dim(u.oBeam.w);
    dim.dim(u.t);
    if (u.iBeam.w > 0) dim.dim(u.iBeam.w);
    dim.dim(2 * u.r - 2 * u.iBeam.w);
    if (u.iBeam.w > 0) dim.dim(u.iBeam.w);
    dim.dim(u.t);
    if (u.oBeam.w > 0) dim.dim(u.oBeam.w);
    dim.next().dim(2 * u.r + 2 * u.t + 2 * u.oBeam.w);
    // right dim
    dim.vRight(box.right + 2 * fig.textHeight, u.hd);
    if (u.iBeam.hd > 0) dim.dim(u.iBeam.hd);
    if (u.iBeam.hs > 0) dim.dim(u.iBeam.hs);
    dim
      .dim(u.hd - u.iBeam.hd - u.iBeam.hs)
      .dim(u.r)
      .dim(u.t + u.butt.h)
      .next();
    if (u.oBeam.hd > 0) dim.dim(u.oBeam.hd);
    if (u.oBeam.hs > 0) dim.dim(u.oBeam.hs);
    dim
      .dim(u.hd - u.oBeam.hd - u.oBeam.hs)
      .dim(Math.abs(transPt.y))
      .dim(u.r + u.t + u.butt.h - Math.abs(transPt.y))
      .next()
      .dim(u.hd + u.r + u.t + u.butt.h);
    // bottom
    dim.hBottom(-u.r - u.t - u.oBeam.w, box.bottom - 2 * fig.textHeight);
    if (u.oBeam.w > 0) dim.dim(u.oBeam.w);
    dim
      .dim(u.r + u.t - Math.abs(transPt.x))
      .dim(Math.abs(transPt.x) - u.butt.w / 2)
      .dim(u.butt.w)
      .dim(Math.abs(transPt.x) - u.butt.w / 2)
      .dim(u.r + u.t - Math.abs(transPt.x));
    if (u.oBeam.w > 0) dim.dim(u.oBeam.w);

    fig.push(dim.generate());
    fig.title("槽身跨中钢筋图", true);
  }
  protected drawCEnd(): void {
    const u = this.struct;
    const fig = this.figures.cEnd;
    const box = fig.getBoundingBox();
    const dim = new DimensionBuilder(fig.unitScale, fig.drawScale);
    dim
      .hTop(-u.r - u.t - u.oBeam.w, box.top + 2 * fig.textHeight)
      .dim(u.oBeam.w + u.t);
    if (u.iBeam.w > 0) dim.dim(u.iBeam.w);
    dim.dim(2 * u.r - 2 * u.iBeam.w);
    if (u.iBeam.w > 0) dim.dim(u.iBeam.w);
    dim
      .dim(u.oBeam.w + u.t)
      .next()
      .dim(2 * u.oBeam.w + 2 * u.t + 2 * u.r);

    dim.vRight(box.right + 2 * fig.textHeight, u.hd);
    if (u.iBeam.hd > 0) dim.dim(u.iBeam.hd);
    if (u.iBeam.hs > 0) dim.dim(u.iBeam.hs);
    dim
      .dim(u.hd - u.iBeam.hd - u.iBeam.hs)
      .dim(u.r)
      .dim(u.endSect.hd + u.endSect.hs - u.hd - u.r - u.support.h);
    if (u.support.h > 0) dim.dim(u.support.h);
    dim
      .next()
      .dim(u.endSect.hd)
      .dim(u.endSect.hs)
      .next()
      .dim(u.endSect.hd + u.endSect.hs);

    dim
      .hBottom(-u.r - u.t - u.oBeam.w, box.bottom - 2 * fig.textHeight)
      .dim(u.endSect.w);
    if (u.support.h > 0) {
      dim.dim(u.support.w).dim(u.support.h);
    }
    const l =
      2 * u.oBeam.w +
      2 * u.r +
      2 * u.t -
      2 * u.endSect.w -
      2 * u.support.w -
      2 * u.support.h;
    dim.dim(l);
    if (u.support.h > 0) {
      dim.dim(u.support.h).dim(u.support.w);
    }
    dim.dim(u.endSect.w);

    fig.push(dim.generate());
    fig.title("槽身端肋钢筋图", true);
  }
}
