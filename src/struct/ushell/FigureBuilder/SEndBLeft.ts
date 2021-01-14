import { Line, Polyline, vec } from "@/draw";
import { Figure } from "@/struct/Figure";
import { FigureBase } from "./Base";

export class SEndBLeft extends FigureBase {
  initFigure(): this {
    if (this.isExist()) {
      const fig = this.getFigure();
      const { id, title } = this.figures.specId.gen();
      fig.reset(1, 25).setId(id).setTitle(title).displayScale();
      this.figures.record(fig);
    }
    return this;
  }
  buildOutline(): this {
    if (this.isExist()) {
      const fig = this.getFigure();
      const u = this.struct;
      const right = u.endSect.b + u.lenTrans + 1.25 * (u.shell.t + u.shell.hb);
      const h = u.endHeight - u.shell.r - u.shell.hd;
      fig.addOutline(
        new Polyline(0, -u.waterStop.h)
          .lineBy(u.waterStop.w, 0)
          .lineBy(0, u.waterStop.h)
          .lineTo(right, 0)
          .greyLine(),
        new Polyline(0, -u.waterStop.h)
          .lineBy(0, -(h - u.waterStop.h))
          .lineBy(u.endSect.b, 0)
          .lineBy(0, h - u.shell.t - u.shell.hb - u.oBeam.w)
          .lineBy(u.lenTrans, u.oBeam.w)
          .lineTo(right, -u.shell.t - u.shell.hb)
          .greyLine()
      );
      if (u.support.h > 0) {
        const y = -h + u.support.h;
        fig.addOutline(new Line(vec(0, y), vec(u.endSect.b, y)).greyLine());
      }
    }
    return this;
  }
  buildDim(): this {
    if (this.isExist()) {
      const fig = this.getFigure();
      const u = this.struct;
      const box = fig.getBoundingBox();

      const dim = fig.dimBuilder();

      dim
        .hBottom(0, box.bottom - 2 * fig.textHeight)
        .dim(u.endSect.b)
        .dim(u.lenTrans);

      dim
        .vRight(box.right + 2 * fig.textHeight, 0)
        .dim(u.shell.t + u.shell.hb)
        .dim(u.oBeam.w)
        .dim(u.endHeight - u.shellHeight - u.oBeam.w - u.support.h);

      if (u.support.h > 0) {
        dim.dim(u.support.h);
      }
      fig.push(dim.generate());
      this.postProcess();
    }
    return this;
  }
  protected isExist(): boolean {
    return this.struct.cantLeft === 0;
  }
  protected getFigure(): Figure {
    return this.figures.sEndBLeft;
  }
  protected postProcess(): void {
    // for right to mirror;
  }
}
