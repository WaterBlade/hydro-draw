import { Line, Polyline, vec } from "@/draw";
import { Figure } from "@/struct/utils/Figure";
import { UShellFigureContext } from "../../UShell";
import { RebarEnd } from "./RebarEnd";
import { RebarShell } from "./RebarShell";
import { RebarTrans } from "./RebarTrans";

export class SEndBeam extends UShellFigureContext {
  end = new RebarEnd(this.context, this.figures);
  shell = new RebarShell(this.context, this.figures);
  trans = new RebarTrans(this.context, this.figures);
  initFigure(): this {
    const u = this.struct;
    if (u.isLeftFigureExist()) {
      const fig = this.figures.sEndBLeft;
      const { id, title } = this.figures.specId.gen();
      fig.resetScale(1, 25).setId(id).setTitle(title).displayScale();
      this.figures.record(fig);
    }
    if (u.isRightFigureExist()) {
      const fig = this.figures.sEndBRight;
      const { id, title } = this.figures.specId.gen();
      fig.resetScale(1, 25).setId(id).setTitle(title).displayScale();
      this.figures.record(fig);
    }
    if (u.isLeftCantFigureExist()) {
      const fig = this.figures.sEndCantBLeft;
      const { id, title } = this.figures.specId.gen();
      fig.resetScale(1, 25).setId(id).setTitle(title).displayScale();
      this.figures.record(fig);
    }
    if (u.isRightCantFigureExist()) {
      const fig = this.figures.sEndCantBRight;
      const { id, title } = this.figures.specId.gen();
      fig.resetScale(1, 25).setId(id).setTitle(title).displayScale();
      this.figures.record(fig);
    }
    return this;
  }
  build(): void {
    if (this.struct.isLeftFigureExist()) {
      const fig = this.figures.sEndBLeft;
      this.buildOutline(fig);
      this.buildRebar(fig);
      this.buildNote(fig);
      this.buildDim(fig);
    }
    if (this.struct.isRightFigureExist()) {
      const fig = this.figures.sEndBRight;
      this.buildOutline(fig);
      this.buildRebar(fig);
      this.buildNote(fig);
      this.buildDim(fig);
      fig.mirror();
    }
    if (this.struct.isLeftCantFigureExist()) {
      const fig = this.figures.sEndCantBLeft;
      const len = this.struct.cantLeft;
      this.buildOutlineCant(fig, len);
      this.buildRebar(fig, true);
      this.buildNote(fig);
      this.buildDimCant(fig, len);
    }
    if (this.struct.isRightCantFigureExist()) {
      const fig = this.figures.sEndCantBRight;
      const len = this.struct.cantRight;
      this.buildOutlineCant(fig, len);
      this.buildRebar(fig, true);
      this.buildNote(fig);
      this.buildDimCant(fig, len);
      fig.mirror();
    }
  }
  protected buildOutline(fig: Figure): void {
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
  protected buildOutlineCant(fig: Figure, lenCant: number): void {
    const u = this.struct;
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
  protected buildRebar(fig: Figure, isCant = false): void {
    this.end.build(fig, isCant);
    this.shell.build(fig, isCant);
    this.trans.build(fig, isCant);
  }
  protected buildNote(fig: Figure): void {
    const u = this.struct;
    const right = fig.outline.getBoundingBox().right;
    fig.breakline(vec(right, 0), vec(right, -u.shell.tb));
  }
  protected buildDim(fig: Figure): void {
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
  }
  protected buildDimCant(fig: Figure, lenCant: number): void {
    const u = this.struct;
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
  }
}
