import { Polyline, vec } from "@/draw";
import { Figure } from "@/struct/utils/Figure";
import { FigureBase } from "./Base";

export class SEndWLeft extends FigureBase {
  initFigure(): this {
    if (this.isExist()) {
      const fig = this.getFigure();
      const { id, title } = this.figures.sectId.gen();
      fig.reset(1, 25).setId(id).setTitle(title).displayScale();
      this.figures.record(fig);
    }
    return this;
  }
  buildOutline(): this {
    if (this.isExist()) {
      const fig = this.getFigure();
      const u = this.struct;
      const right = u.endSect.b + u.lenTrans + 1.25 * u.shell.t;
      const h = u.shell.t + u.oBeam.w;
      fig.addOutline(
        new Polyline(0, -u.waterStop.h)
          .lineBy(u.waterStop.w, 0)
          .lineBy(0, u.waterStop.h)
          .lineTo(right, 0)
          .greyLine(),
        new Polyline(0, -u.waterStop.h)
          .lineBy(0, -h + u.waterStop.h)
          .lineBy(u.endSect.b, 0)
          .lineBy(u.lenTrans, u.oBeam.w)
          .lineTo(right, -u.shell.t)
          .greyLine()
      );
    }
    return this;
  }
  buildNote(): this{
    if(this.isExist()){
      const u = this.struct;
      const fig = this.getFigure();
      const right = fig.outline.getBoundingBox().right;
      fig.breakline(vec(right, 0), vec(right, -u.shell.t))
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
        .dim(u.shell.t)
        .dim(u.oBeam.w);

      fig.push(dim.generate());

      this.postProcess();
    }
    return this;
  }
  protected isExist(): boolean {
    return this.struct.cantLeft === 0;
  }
  protected getFigure(): Figure {
    return this.figures.sEndWLeft;
  }
  protected postProcess(): void {;}
}
