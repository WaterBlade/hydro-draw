import { Line, Polyline, StrecthSide, vec } from "@/draw";
import { FigureConfig } from "@/struct/utils";
import { UShellSectFigure } from "./UShellFigure";

abstract class AbstractSEndWall extends UShellSectFigure {
  protected unitScale = 1;
  protected drawScale = 25;
  protected config = new FigureConfig();

  protected abstract isCant: boolean;
  protected abstract isMirror: boolean;
  protected abstract lenCant: number;

  draw(): void {
    this.drawOutline();

    this.drawEndCOuter();
    this.drawEndWStir();

    this.drawShellCInner();
    this.drawShellCInnerSub();
    this.drawShellCOuter();
    this.drawShellLInner();
    this.drawShellLOuter();
    this.drawTransDirect();

    this.drawNote();
    this.drawDim();

    if (this.isMirror) {
      this.fig.mirror();
    }
  }
  protected drawOutline(): void {
    const u = this.struct;
    const fig = this.fig;
    if (this.isCant) {
      const right = u.endSect.b + u.lenTrans + 1.25 * u.shell.t;
      fig.addOutline(
        new Polyline(-this.lenCant, -u.waterStop.h)
          .lineBy(u.waterStop.w, 0)
          .lineBy(0, u.waterStop.h)
          .lineTo(right, 0)
          .greyLine(),
        new Polyline(-this.lenCant, -u.waterStop.h)
          .lineBy(0, -u.shell.t + u.waterStop.h)
          .lineBy(this.lenCant - u.lenTrans, 0)
          .lineBy(u.lenTrans, -u.oBeam.w)
          .lineBy(u.endSect.b, 0)
          .lineBy(u.lenTrans, u.oBeam.w)
          .lineTo(right, -u.shell.t)
          .greyLine()
      );
    } else {
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
  }
  protected drawNote(): void {
    const u = this.struct;
    const fig = this.fig;
    const right = fig.outline.getBoundingBox().right;
    fig.push(fig.breakline(vec(right, 0), vec(right, -u.shell.t)));
  }
  protected drawDim(): void {
    const u = this.struct;
    const fig = this.fig;

    const box = fig.getBoundingBox();
    const dim = fig.dimBuilder();

    if (this.isCant) {
      dim
        .hBottom(-this.lenCant, box.bottom - 2 * fig.h)
        .dim(this.lenCant - u.lenTrans)
        .dim(u.lenTrans)
        .dim(u.endSect.b)
        .dim(u.lenTrans);

      dim
        .vRight(box.right + 2 * fig.h, 0)
        .dim(u.shell.t)
        .dim(u.oBeam.w);

      fig.push(dim.generate());
    } else {
      dim
        .hBottom(0, box.bottom - 2 * fig.h)
        .dim(u.endSect.b)
        .dim(u.lenTrans);

      dim
        .vRight(box.right + 2 * fig.h, 0)
        .dim(u.shell.t)
        .dim(u.oBeam.w);

      fig.push(dim.generate());
    }
  }
  protected drawEndCOuter(): void {
    const u = this.struct;
    const fig = this.fig;
    const rebars = this.rebars;
    const bar = rebars.end.cOuter;
    const as = rebars.as;
    const r = fig.r;
    const y = -u.shell.t - u.oBeam.w + as + r;
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
  protected drawEndWStir(): void {
    const u = this.struct;
    const fig = this.fig;
    const rebars = this.rebars;
    const bar = rebars.end.wStir;
    const spec = this.isCant ? rebars.end.wStirCant : rebars.end.wStir;
    const gap = this.isCant ? 0 : u.waterStop.h;
    const as = rebars.as;
    const w0 = u.endSect.b - 2 * as;
    const h0 = u.oBeam.w + u.shell.t - gap - 2 * as;
    let pos;
    if (this.isCant) {
      pos = vec(-u.lenTrans, -u.shell.t - u.oBeam.w + as + fig.h);
    } else {
      const y = -gap - as - h0 / 2;
      pos = vec(-2 * fig.h, y);
    }
    fig.push(
      fig
        .planeRebar()
        .rebar(
          new Polyline(as, -gap - as)
            .lineBy(w0, 0)
            .lineBy(0, -h0)
            .lineBy(-w0, 0)
            .lineBy(0, h0)
        )
        .spec(spec, 0, bar.space)
        .leaderNote(pos, vec(1, 0))
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
    const left = this.isCant
      ? fig.outline.getBoundingBox().left + u.waterStop.w + as + fig.r
      : u.endSect.b;
    const right = fig.outline.getBoundingBox().right;
    fig.push(
      fig
        .sparsePointRebar()
        .points(
          ...new Line(vec(left, -as + r), vec(right, -as + r))
            .divide(bar.denseSpace, StrecthSide.tail)
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
    const bar = rebars.shell.cInnerSub;
    const r = fig.r;
    const as = rebars.as;
    const y = -u.waterStop.h - as - r;
    const count = rebars.end.cOuter.singleCount;
    const rebar = fig.sparsePointRebar();
    const left = fig.outline.getBoundingBox().left;
    if (this.isCant) {
      rebar.points(vec(left + as + r, y)).spec(bar);
    } else {
      rebar
        .points(
          ...new Line(
            vec(as + r, y),
            vec(u.endSect.b - as - r, y)
          ).divideByCount(count - 1).points
        )
        .spec(bar);
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
    const y = -u.shell.t + as;
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
  protected drawShellLOuter(): void {
    const u = this.struct;
    const fig = this.fig;
    const rebars = this.rebars;
    const bar = rebars.shell.lOuter;
    const as = rebars.as;
    const left = fig.outline.getBoundingBox().left;
    const right = fig.outline.getBoundingBox().right;
    const y = -u.shell.t + as + fig.r;
    fig.push(
      fig
        .planeRebar()
        .rebar(new Line(vec(left + as, y), vec(right, y)))
        .spec(bar)
        .space(bar.space)
        .leaderNote(vec(u.endSect.b + 75, 4 * fig.h), vec(0, 1), vec(1, 0))
        .generate()
    );
  }
  protected drawTransDirect(): void {
    const u = this.struct;
    const fig = this.fig;
    const rebars = this.rebars;
    const as = rebars.as;
    const bar = rebars.trans.direct;
    const path = new Polyline(u.endSect.b - 1, -u.shell.t - u.oBeam.w)
      .lineBy(1, 0)
      .lineBy(
        u.lenTrans + u.shell.t * (u.lenTrans / u.oBeam.w),
        u.oBeam.w + u.shell.t
      )
      .lineBy(-1, 0)
      .offset(as)
      .removeStart()
      .removeEnd();

    const rebar = fig.planeRebar().rebar(path);
    if (this.isCant) {
      const left = path.mirrorByVAxis();
      left.move(vec(u.endSect.b, 0));
      rebar.rebar(left);
    }

    fig.push(
      rebar
        .spec(bar)
        .space(bar.space)
        .leaderNote(
          vec(u.endSect.b + u.lenTrans, -u.shell.t - u.oBeam.w / 2),
          vec(1, 0)
        )
        .generate()
    );
  }
}

export class SEndWallLeft extends AbstractSEndWall {
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

export class SEndWallRight extends AbstractSEndWall {
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
