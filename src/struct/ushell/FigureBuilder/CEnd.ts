import { Line, Polyline, Side, vec } from "@/draw";
import { Figure } from "@/struct/Figure";
import { FigureBase } from "./Base";

export class CEnd extends FigureBase {
  protected isExist(): boolean {
    return this.struct.hasUnCant();
  }
  protected getFigure(): Figure {
    return this.figures.cEnd;
  }
  protected getTitle(): string {
    if (this.struct.hasOneCant()) {
      return "槽身端肋钢筋图（非悬挑侧）";
    } else {
      return "槽身端肋钢筋图";
    }
  }
  protected getInnerGap(): number {
    return this.struct.waterStop.h;
  }
  initFigure(): this {
    if (this.isExist()) {
      const fig = this.getFigure();
      fig
        .reset(1, 50)
        .setTitle(this.getTitle())
        .displayScale()
        .centerAligned()
        .keepTitlePos();
      this.figures.record(fig);
    }
    return this;
  }
  buildOutline(): this {
    if (this.isExist()) {
      const u = this.struct;
      const fig = this.getFigure();
      const path = new Polyline(
        -u.shell.r - u.shell.t - u.oBeam.w,
        u.shell.hd
      ).lineBy(u.beamWidth, 0);
      if (u.iBeam.w > 0) {
        path.lineBy(0, -u.iBeam.hd).lineBy(-u.iBeam.w, -u.iBeam.hs);
      }
      path.lineTo(-u.shell.r, 0).arcTo(u.shell.r, 0, 180);
      if (u.iBeam.w > 0) {
        path
          .lineBy(0, u.shell.hd - u.iBeam.hd - u.iBeam.hs)
          .lineBy(-u.iBeam.w, u.iBeam.hs)
          .lineBy(0, u.iBeam.hd);
      } else {
        path.lineBy(0, u.shell.hd);
      }
      path
        .lineBy(u.beamWidth, 0)
        .lineBy(0, -u.endSect.hd)
        .lineBy(-u.endSect.w, -u.endSect.hs);
      if (u.support.w > 0) {
        path.lineBy(-u.support.w, 0).lineBy(-u.support.h, u.support.h);
      }
      const l =
        2 * u.oBeam.w +
        2 * u.shell.r +
        2 * u.shell.t -
        2 * u.endSect.w -
        2 * u.support.w -
        2 * u.support.h;
      path.lineBy(-l, 0);
      if (u.support.w > 0) {
        path.lineBy(-u.support.h, -u.support.h).lineBy(-u.support.w, 0);
      }
      path.lineBy(-u.endSect.w, u.endSect.hs).lineBy(0, u.endSect.hd);

      fig.addOutline(
        path.greyLine(),
        new Line(
          vec(-u.shell.r + u.iBeam.w, u.shell.hd),
          vec(u.shell.r - u.iBeam.w, u.shell.hd)
        ).greyLine(),
        new Line(
          vec(-u.shell.r + u.iBeam.w, u.shell.hd - u.bar.h),
          vec(u.shell.r - u.iBeam.w, u.shell.hd - u.bar.h)
        ).greyLine()
      );

      const gap = this.getInnerGap();
      if (gap > 0) {
        const inner = new Polyline(-u.shell.r + u.iBeam.w, u.shell.hd);
        if (u.iBeam.w > 0) {
          inner.lineBy(0, -u.iBeam.hd).lineBy(-u.iBeam.w, -u.iBeam.hs);
        }
        inner
          .lineTo(-u.shell.r, 0)
          .arcTo(u.shell.r, 0, 180)
          .lineBy(0, u.shell.hd - u.iBeam.hs - u.iBeam.hd);
        if (u.iBeam.w > 0) {
          inner.lineBy(-u.iBeam.w, u.iBeam.hs).lineBy(0, u.iBeam.hd);
        }

        fig.addOutline(inner.offset(gap, Side.Right).greyLine());
      }
    }
    return this;
  }
  buildDim(): this {
    if (this.isExist()) {
      const u = this.struct;
      const fig = this.getFigure();
      const box = fig.getBoundingBox();
      const dim = fig.dimBuilder();
      dim
        .hTop(-u.shell.r - u.shell.t - u.oBeam.w, box.top + 2 * fig.textHeight)
        .dim(u.oBeam.w + u.shell.t);
      if (u.iBeam.w > 0) dim.dim(u.iBeam.w);
      dim.dim(2 * u.shell.r - 2 * u.iBeam.w);
      if (u.iBeam.w > 0) dim.dim(u.iBeam.w);
      dim
        .dim(u.oBeam.w + u.shell.t)
        .next()
        .dim(2 * u.oBeam.w + 2 * u.shell.t + 2 * u.shell.r);

      dim.vRight(box.right + 2 * fig.textHeight, u.shell.hd);
      if (u.iBeam.hd > 0) dim.dim(u.iBeam.hd);
      if (u.iBeam.hs > 0) dim.dim(u.iBeam.hs);
      dim
        .dim(u.shell.hd - u.iBeam.hd - u.iBeam.hs)
        .dim(u.shell.r)
        .dim(
          u.endSect.hd + u.endSect.hs - u.shell.hd - u.shell.r - u.support.h
        );
      if (u.support.h > 0) dim.dim(u.support.h);
      dim
        .next()
        .dim(u.endSect.hd)
        .dim(u.endSect.hs)
        .next()
        .dim(u.endSect.hd + u.endSect.hs);

      dim
        .hBottom(
          -u.shell.r - u.shell.t - u.oBeam.w,
          box.bottom - 2 * fig.textHeight
        )
        .dim(u.endSect.w);
      if (u.support.h > 0) {
        dim.dim(u.support.w).dim(u.support.h);
      }
      const l =
        2 * u.oBeam.w +
        2 * u.shell.r +
        2 * u.shell.t -
        2 * u.endSect.w -
        2 * u.support.w -
        2 * u.support.h;
      dim.dim(l);
      if (u.support.h > 0) {
        dim.dim(u.support.h).dim(u.support.w);
      }
      dim.dim(u.endSect.w);

      fig.push(dim.generate());
    }
    return this;
  }
}
