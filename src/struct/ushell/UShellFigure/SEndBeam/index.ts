import { Line, Polyline, vec } from "@/draw";
import { Figure } from "@/struct/utils";
import { FigureContent } from "@/struct/utils/FigureContent";
import { UShellRebar } from "../../UShellRebar";
import { UShellStruct } from "../../UShellStruct";
import { RebarEnd } from "./RebarEnd";
import { RebarShell } from "./RebarShell";
import { RebarTrans } from "./RebarTrans";

export class SEndBeam extends Figure {
  protected end = new RebarEnd();
  protected shell = new RebarShell();
  protected trans = new RebarTrans();
  protected _leftFig?: FigureContent;
  get leftFig(): FigureContent {
    if (!this._leftFig) throw Error("left fig not init");
    return this._leftFig;
  }
  set leftFig(val: FigureContent) {
    this._leftFig = val;
  }
  protected _rightFig?: FigureContent;
  get rightFig(): FigureContent {
    if (!this._rightFig) throw Error("right fig not init");
    return this._rightFig;
  }
  set rightFig(val: FigureContent) {
    this._rightFig = val;
  }
  initFigure(u: UShellStruct): void {
    if (u.isLeftFigureExist() || u.isLeftCantFigureExist()) {
      this.leftFig = new FigureContent();
      const { id, title } = this.container.specId;
      this.leftFig.resetScale(1, 25).setId(id).setTitle(title).displayScale();
      this.container.record(this.leftFig);
    }
    if (u.isRightFigureExist() || u.isRightCantFigureExist()) {
      this.rightFig = new FigureContent();
      const { id, title } = this.container.specId;
      this.rightFig.resetScale(1, 25).setId(id).setTitle(title).displayScale();
      this.container.record(this.rightFig);
    }
  }
  build(u: UShellStruct, rebars: UShellRebar): void {
    if (u.isLeftFigureExist()) {
      const fig = this.leftFig;
      this.buildOutline(u, fig);
      this.buildRebar(u, rebars, fig);
      this.buildNote(u, fig);
      this.buildDim(u, fig);
    }
    if (u.isRightFigureExist()) {
      const fig = this.rightFig;
      this.buildOutline(u, fig);
      this.buildRebar(u, rebars, fig);
      this.buildNote(u, fig);
      this.buildDim(u, fig);
      fig.mirror();
    }
    if (u.isLeftCantFigureExist()) {
      const fig = this.leftFig;
      const len = u.cantLeft;
      this.buildOutlineCant(u, fig, len);
      this.buildRebar(u, rebars, fig, true);
      this.buildNote(u, fig);
      this.buildDimCant(u, fig, len);
    }
    if (u.isRightCantFigureExist()) {
      const fig = this.rightFig;
      const len = u.cantRight;
      this.buildOutlineCant(u, fig, len);
      this.buildRebar(u, rebars, fig, true);
      this.buildNote(u, fig);
      this.buildDimCant(u, fig, len);
      fig.mirror();
    }
  }
  protected buildOutline(u: UShellStruct, fig: FigureContent): void {
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
  protected buildOutlineCant(
    u: UShellStruct,
    fig: FigureContent,
    lenCant: number
  ): void {
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
  protected buildRebar(
    u: UShellStruct,
    rebars: UShellRebar,
    fig: FigureContent,
    isCant = false
  ): void {
    this.end.build(u, rebars, fig, isCant);
    this.shell.build(u, rebars, fig, isCant);
    this.trans.build(u, rebars, fig, isCant);
  }
  protected buildNote(u: UShellStruct, fig: FigureContent): void {
    const right = fig.outline.getBoundingBox().right;
    fig.breakline(vec(right, 0), vec(right, -u.shell.tb));
  }
  protected buildDim(u: UShellStruct, fig: FigureContent): void {
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
  protected buildDimCant(
    u: UShellStruct,
    fig: FigureContent,
    lenCant: number
  ): void {
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
