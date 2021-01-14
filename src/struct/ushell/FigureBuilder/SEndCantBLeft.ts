import { Line, Polyline, vec } from "@/draw";
import { Figure } from "@/struct/utils/Figure";
import { FigureBase } from "./Base";

export class SEndCantBLeft extends FigureBase {
  protected isExist(): boolean {
    return this.struct.cantLeft !== 0;
  }
  protected getFigure(): Figure {
    return this.figures.sEndCantBLeft;
  }
  protected getLenCant(): number {
    return this.struct.cantLeft;
  }
  protected postProcess(): void {
    // for right to change
  }
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
      const u = this.struct;
      const fig = this.getFigure();
      const lenCant = this.getLenCant();
      const left = -lenCant;
      const right = u.endSect.b + u.lenTrans + 1.25 * (u.shell.t + u.shell.hb);
      const h = u.endHeight - u.shell.r - u.shell.hd;
      fig.addOutline(
        new Polyline(left, -u.waterStop.h)
          .lineBy(u.waterStop.w, 0)
          .lineBy(0, u.waterStop.h)
          .lineTo(right, 0)
          .greyLine(),
        new Polyline(left, -u.waterStop.h)
          .lineBy(0, -(u.shell.tb - u.waterStop.h))
          .lineBy(lenCant - u.lenTrans, 0)
          .lineBy(u.lenTrans, -u.oBeam.w)
          .lineBy(0, -h + u.shell.tb + u.oBeam.w)
          .lineBy(u.endSect.b, 0)
          .lineBy(0, h - u.shell.tb - u.oBeam.w)
          .lineBy(u.lenTrans, u.oBeam.w)
          .lineTo(right, -u.shell.tb)
          .greyLine()
      );
      if (u.support.h > 0) {
        const y = -h + u.support.h;
        fig.addOutline(new Line(vec(0, y), vec(u.endSect.b, y)).greyLine());
      }
    }
    return this;
  }
  buildNote(): this{
    if(this.isExist()){
      const u = this.struct;
      const fig = this.getFigure();
      const right = fig.outline.getBoundingBox().right;
      fig.breakline(vec(right, 0), vec(right, -u.shell.tb))

    }
    return this;
  }
  buildDim(): this {
    if (this.isExist()) {
      const u = this.struct;
      const fig = this.getFigure();
      const lenCant = this.getLenCant();
      const box = fig.getBoundingBox();

      const dim = fig.dimBuilder();

      dim
        .hBottom(-lenCant, box.bottom - 2 * fig.textHeight)
        .dim(lenCant - u.lenTrans)
        .dim(u.lenTrans)
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
}
