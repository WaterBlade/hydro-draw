import { last, Line, Polyline, StrecthSide, vec } from "@/draw";
import { FigureConfig } from "@/struct/utils";
import { UShellSpecFigure } from "./UShellFigure";

abstract class AbstractEndBeam extends UShellSpecFigure {
  protected unitScale = 1;
  protected drawScale = 25;
  protected config = new FigureConfig();

  protected abstract isMirror: boolean;
  protected abstract isCant: boolean;
  protected abstract lenCant: number;

  draw(): void {
    this.drawOutline();

    this.drawEndBeamBot();
    this.drawEndBeamMid();
    this.drawEndBeamStir();
    this.drawEndBeamTop();

    this.drawShellCInner();
    this.drawShellCInnerSub();
    this.drawShellCOuter();
    this.drawShellLInner();
    this.drawShellMain();

    this.drawTransArc();

    this.drawNote();
    this.drawDim();
    if (this.isMirror) {
      this.fig.mirror();
    }
  }
  protected drawOutline(): void {
    if (this.isCant) {
      this.drawOutlineCant();
    } else {
      this.drawOutlineNorm();
    }
  }
  protected drawOutlineNorm(): void {
    const u = this.struct;
    const fig = this.fig;
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
  protected drawOutlineCant(): void {
    const u = this.struct;
    const fig = this.fig;
    const left = -this.lenCant;
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
        .lineBy(this.lenCant - u.lenTrans, 0)
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
  protected drawNote(): void {
    const u = this.struct;
    const fig = this.fig;
    const right = fig.outline.getBoundingBox().right;
    fig.push(fig.breakline(vec(right, 0), vec(right, -u.shell.tb)));
  }
  protected drawDim(): void {
    if (this.isCant) {
      this.drawDimCant();
    } else {
      this.drawDimNorm();
    }
  }
  protected drawDimNorm(): void {
    const u = this.struct;
    const fig = this.fig;
    const box = fig.getBoundingBox();

    const dim = fig.dimBuilder();

    dim
      .hBottom(0, box.bottom - 2 * fig.h)
      .dim(u.endSect.b)
      .dim(u.lenTrans);

    dim
      .vRight(box.right + 2 * fig.h, 0)
      .dim(u.shell.t + u.shell.hb)
      .dim(u.oBeam.w)
      .dim(u.endHeight - u.shellHeight - u.oBeam.w - u.support.h);

    if (u.support.h > 0) {
      dim.dim(u.support.h);
    }
    fig.push(dim.generate());
  }
  protected drawDimCant(): void {
    const u = this.struct;
    const fig = this.fig;
    const box = fig.getBoundingBox();

    const dim = fig.dimBuilder();

    dim
      .hBottom(-this.lenCant, box.bottom - 2 * fig.h)
      .dim(this.lenCant - u.lenTrans)
      .dim(u.lenTrans)
      .dim(u.endSect.b)
      .dim(u.lenTrans);

    dim
      .vRight(box.right + 2 * fig.h, 0)
      .dim(u.shell.t + u.shell.hb)
      .dim(u.oBeam.w)
      .dim(u.endHeight - u.shellHeight - u.oBeam.w - u.support.h);

    if (u.support.h > 0) {
      dim.dim(u.support.h);
    }
    fig.push(dim.generate());
  }

  protected drawEndBeamBot(): void {
    const u = this.struct;
    const fig = this.fig;
    const rebars = this.rebars;
    const bar = rebars.end.bBot;
    const as = rebars.as;
    const r = fig.r;
    const y = -u.endHeight + u.shell.r + u.shell.hd + u.support.h + as + r;
    fig.push(
      fig
        .sparsePointRebar()
        .points(
          ...new Line(
            vec(as + r, y),
            vec(u.endSect.b - as - r, y)
          ).divideByCount(bar.singleCount - 1).points
        )
        .spec(bar)
        .count(bar.singleCount)
        .parallelLeader(
          vec(-2 * fig.h, y - 2 * fig.h - u.support.h),
          vec(-1, 0)
        )
        .generate()
    );
  }
  protected drawEndBeamMid(): void {
    const u = this.struct;
    const fig = this.fig;
    const rebars = this.rebars;
    const bar = rebars.end.bMid;
    const as = rebars.as;
    const r = fig.r;
    const x0 = as + r;
    const x1 = u.endSect.b - as - r;
    const y0 = -u.waterStop.h - as - r;
    const y1 = u.shell.hd + u.shell.r - u.endHeight + u.support.h + as + r;
    const pts0 = new Line(vec(x0, y0), vec(x0, y1))
      .divideByCount(bar.singleCount + 1)
      .removeStartPt()
      .removeEndPt().points;
    const pts1 = new Line(vec(x1, y0), vec(x1, y1))
      .divideByCount(bar.singleCount + 1)
      .removeStartPt()
      .removeEndPt().points;
    const y2 = (last(pts0).y + y1) / 2;
    fig.push(
      fig
        .sparsePointRebar()
        .points(...pts0, ...pts1)
        .spec(bar)
        .count(2 * bar.singleCount)
        .jointLeader(vec(u.endSect.b / 2, y2), vec(-2 * fig.h, y2))
        .generate()
    );
  }
  protected drawEndBeamStir(): void {
    const u = this.struct;
    const fig = this.fig;
    const rebars = this.rebars;
    const bar = rebars.end.bStir;
    const spec = this.isCant ? rebars.end.bStirCant : rebars.end.bStir;
    const gap = this.isCant ? 0 : u.waterStop.h;
    const as = rebars.as;
    const w = u.endSect.b - 2 * as;
    const h = u.endHeight - u.shell.hd - u.shell.r - u.support.h - 2 * as - gap;

    let pos;
    if (this.isCant) {
      pos = vec(-u.lenTrans, -u.shell.tb - 3 * fig.h);
    } else {
      const y = h / 2;
      pos = vec(-2 * fig.h, -gap - as - fig.r - y);
    }
    fig.push(
      fig
        .planeRebar()
        .rebar(
          new Polyline(as, -gap - as)
            .lineBy(w, 0)
            .lineBy(0, -h)
            .lineBy(-w, 0)
            .lineBy(0, h)
        )
        .spec(spec).space(bar.space)
        .leaderNote(pos, vec(1, 0))
        .generate()
    );
  }
  protected drawEndBeamTop(): void {
    const u = this.struct;
    const fig = this.fig;
    const rebars = this.rebars;
    const bar = rebars.end.bTop;
    const as = rebars.as;
    const r = fig.r;
    const gap = this.isCant ? 0 : u.waterStop.h;
    const y = -gap - as - r;
    fig.push(
      fig
        .sparsePointRebar()
        .points(
          ...new Line(
            vec(as + r, y),
            vec(u.endSect.b - as - r, y)
          ).divideByCount(bar.singleCount - 1).points
        )
        .spec(bar).count(bar.singleCount)
        .parallelLeader(vec(-2 * fig.h, y - 2 * fig.h), vec(-1, 0))
        .generate()
    );
  }

  protected drawShellCInner(): void {
    const u = this.struct;
    const fig = this.fig;
    const rebars = this.rebars;
    const bar = rebars.shell.cInner;
    const r = fig.r;
    const as = rebars.as;
    const right = fig.outline.getBoundingBox().right;
    const left = this.isCant
      ? fig.outline.getBoundingBox().left + u.waterStop.w + as + fig.r
      : u.endSect.b;
    fig.push(
      fig
        .sparsePointRebar()
        .points(
          ...new Line(vec(left, -as + r), vec(right, -as + r))
            .divide(bar.denseSpace, StrecthSide.tail)
            .removeStartPt()
            .removeEndPt().points
        )
        .spec(bar)
        .space(bar.denseSpace)
        .parallelLeader(vec(right + fig.h, 2 * fig.h), vec(1, 0))
        .generate()
    );
  }
  protected drawShellCInnerSub(): void {
    const u = this.struct;
    const fig = this.fig;
    const rebars = this.rebars;
    const bar = rebars.shell.cInner;
    const r = fig.r;
    const as = rebars.as;
    const y = -u.waterStop.h - as + r;
    const count = rebars.end.cOuter.singleCount;
    const rebar = fig.sparsePointRebar();
    const left = fig.outline.getBoundingBox().left;
    if (this.isCant) {
      rebar.points(vec(left + as + r, y)).spec(bar);
    } else {
      rebar
        .points(
          ...new Line(
            vec(left + as + r, y),
            vec(u.endSect.b - as - r, y)
          ).divideByCount(count - 1).points
        )
        .spec(bar)
        .count(count);
    }
    fig.push(
      rebar
        .parallelLeader(
          vec(left - 2 * fig.h, y + 2 * fig.h + u.waterStop.h),
          vec(-1, 0)
        )
        .generate()
    );
  }
  protected drawShellCOuter(): void {
    const u = this.struct;
    const fig = this.fig;
    const rebars = this.rebars;
    const bar = rebars.shell.cOuter;
    const as = rebars.as;
    const right = fig.outline.getBoundingBox().right;
    const y = -u.shell.t - u.shell.hb + as;
    const rebar = fig
      .sparsePointRebar(30)
      .points(
        ...new Line(vec(u.endSect.b, y), vec(right, y))
          .divide(bar.denseSpace, StrecthSide.tail)
          .removeStartPt()
          .removeEndPt().points
      );
    if (this.isCant) {
      const left = fig.outline.getBoundingBox().left;
      rebar.points(
        ...new Line(vec(left + as, y), vec(0, y))
          .divide(bar.denseSpace, StrecthSide.tail)
          .removeEndPt().points
      );
    }
    fig.push(
      rebar
        .spec(bar)
        .space(bar.denseSpace)
        .parallelLeader(vec(right + fig.h, y - 2 * fig.h), vec(1, 0))
        .generate()
    );
  }
  protected drawShellLInner(): void {
    const u = this.struct;
    const fig = this.fig;
    const rebars = this.rebars;
    const bar = rebars.shell.lInner;
    const as = rebars.as;
    const y = -as;
    const left = fig.outline.getBoundingBox().left;
    const right = fig.outline.getBoundingBox().right;
    fig.push(
      fig
        .planeRebar()
        .rebar(new Line(vec(left + u.waterStop.w + as, y), vec(right, y)))
        .spec(bar)
        .space(bar.space)
        .leaderNote(vec(u.endSect.b + 25, 4 * fig.h), vec(0, 1), vec(-1, 0))
        .generate()
    );
  }
  protected drawShellMain(): void {
    const u = this.struct;
    const fig = this.fig;
    const rebars = this.rebars;
    const bar = rebars.shell.main;
    const as = rebars.as;
    const left = fig.outline.getBoundingBox().left;
    const right = fig.outline.getBoundingBox().right;
    const y = -u.shell.t - u.shell.hb + as + fig.r;
    fig.push(
      fig
        .planeRebar()
        .rebar(new Line(vec(left + as, y), vec(right, y)))
        .spec(bar)
        .leaderNote(vec(u.endSect.b + 75, 4 * fig.h), vec(0, 1), vec(1, 0))
        .generate()
    );
  }

  protected drawTransArc(): void {
    const u = this.struct;
    const fig = this.fig;
    const rebars = this.rebars;
    const bar = rebars.trans.arc;
    const y0 = u.shell.hd + u.shell.r - u.endHeight + u.support.h;
    const p = bar.shapeEnd();
    const rebar = fig.planeRebar().rebar(p);
    if (this.isCant) {
      const left = p.mirrorByVAxis();
      left.move(vec(u.endSect.b, 0));
      rebar.rebar(left);
    }
    fig.push(
      rebar
        .spec(bar)
        .leaderNote(
          vec(u.endSect.b + u.lenTrans, (-u.shell.t - u.shell.hb + y0) / 2),
          vec(1, 0)
        )
        .generate()
    );
  }
}

export class SEndBeamLeft extends AbstractEndBeam {
  protected get isCant(): boolean {
    return this.struct.cantLeft > 0;
  }
  protected isMirror = false;
  protected get lenCant(): number {
    return this.struct.cantLeft;
  }
  isExist(): boolean {
    return (
      this.struct.isLeftFigureExist() || this.struct.isLeftCantFigureExist()
    );
  }
}

export class SEndBeamRight extends AbstractEndBeam {
  protected get isCant(): boolean {
    return this.struct.cantRight > 0;
  }
  protected isMirror = true;
  protected get lenCant(): number {
    return this.struct.cantRight;
  }
  isExist(): boolean {
    return (
      this.struct.isRightFigureExist() || this.struct.isRightCantFigureExist()
    );
  }
}
