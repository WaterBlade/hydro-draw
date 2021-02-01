import { Polyline, vec } from "@/draw";
import { Figure } from "@/struct/utils";
import { RebarTrans } from "./RebarTrans";
import { ReBarEnd } from "./RebarEnd";
import { RebarShell } from "./RebarShell";
import { UShellFigureContext } from "../../UShell";

export class SEndWall extends UShellFigureContext {
  protected end = new ReBarEnd(this.context, this.figures);
  protected shell = new RebarShell(this.context, this.figures);
  protected trans = new RebarTrans(this.context, this.figures);
  initFigure(): void {
    if (this.struct.isLeftFigureExist()) {
      const fig = this.figures.sEndWLeft;
      const { id, title } = this.figures.sectId.gen();
      fig.resetScale(1, 25).setId(id).setTitle(title).displayScale();
      this.figures.record(fig);
    }
    if (this.struct.isRightFigureExist()) {
      const fig = this.figures.sEndWRight;
      const { id, title } = this.figures.sectId.gen();
      fig.resetScale(1, 25).setId(id).setTitle(title).displayScale();
      this.figures.record(fig);
    }
    if (this.struct.isLeftCantFigureExist()) {
      const fig = this.figures.sEndCantWLeft;
      const { id, title } = this.figures.sectId.gen();
      fig.resetScale(1, 25).setId(id).setTitle(title).displayScale();
      this.figures.record(fig);
    }
    if (this.struct.isRightCantFigureExist()) {
      const fig = this.figures.sEndCantWRight;
      const { id, title } = this.figures.sectId.gen();
      fig.resetScale(1, 25).setId(id).setTitle(title).displayScale();
      this.figures.record(fig);
    }
  }
  build(): void {
    if (this.struct.isLeftFigureExist()) {
      const fig = this.figures.sEndWLeft;
      this.buildOutline(fig);
      this.buildRebar(fig);
      this.buildNote(fig);
      this.buildDim(fig);
    }
    if (this.struct.isRightFigureExist()) {
      const fig = this.figures.sEndWRight;
      this.buildOutline(fig);
      this.buildRebar(fig);
      this.buildNote(fig);
      this.buildDim(fig);
      fig.mirror();
    }
    if (this.struct.isLeftCantFigureExist()) {
      const fig = this.figures.sEndCantWLeft;
      const len = this.struct.cantLeft;
      this.buildOutlineCant(fig, len);
      this.buildRebar(fig, true);
      this.buildNote(fig);
      this.buildDimCant(fig, len);
    }
    if (this.struct.isRightCantFigureExist()) {
      const fig = this.figures.sEndCantWRight;
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
  protected buildOutlineCant(fig: Figure, lenCant: number): void {
    const u = this.struct;
    const right = u.endSect.b + u.lenTrans + 1.25 * u.shell.t;
    fig.addOutline(
      new Polyline(-lenCant, -u.waterStop.h)
        .lineBy(u.waterStop.w, 0)
        .lineBy(0, u.waterStop.h)
        .lineTo(right, 0)
        .greyLine(),
      new Polyline(-lenCant, -u.waterStop.h)
        .lineBy(0, -u.shell.t + u.waterStop.h)
        .lineBy(lenCant - u.lenTrans, 0)
        .lineBy(u.lenTrans, -u.oBeam.w)
        .lineBy(u.endSect.b, 0)
        .lineBy(u.lenTrans, u.oBeam.w)
        .lineTo(right, -u.shell.t)
        .greyLine()
    );
  }
  protected buildRebar(fig: Figure, isCant = false): void {
    this.end.build(fig, isCant);
    this.shell.build(fig, isCant);
    this.trans.build(fig, isCant);
  }
  protected buildNote(fig: Figure): void {
    const u = this.struct;
    const right = fig.outline.getBoundingBox().right;
    fig.breakline(vec(right, 0), vec(right, -u.shell.t));
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
      .dim(u.shell.t)
      .dim(u.oBeam.w);

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
      .dim(u.shell.t)
      .dim(u.oBeam.w);

    fig.push(dim.generate());
  }
}
