import { Line, Polyline, Side, vec } from "@/draw";
import { FigureConfig } from "@/struct/utils";
import { UShellBasicFigure } from "./UShellFigure";

abstract class UniformCEnd extends UShellBasicFigure {
  protected unitScale = 1;
  protected drawScale = 50;
  protected config = new FigureConfig(true, true);

  protected abstract isCant: boolean;
  protected get title(): string {
    const u = this.struct;
    const bothExist = u.cantCount === 1;
    if (bothExist) {
      return this.isCant
        ? "槽身端肋钢筋图（悬挑侧）"
        : "槽身端肋钢筋图（非悬挑侧）";
    } else {
      return "槽身端肋钢筋图";
    }
  }
  draw(): void {
    this.drawOutline();

    this.drawBeamBot();
    this.drawBeamMid();
    this.drawBeamStir();
    this.drawBeamTop();
    this.drawCOuter();
    this.drawTopBeam();
    this.drawWallStir();
    this.drawCInner();

    this.drawNote();
    this.drawDim();
  }
  protected drawOutline(): void {
    const u = this.struct;
    const fig = this.fig;
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

    if (!this.isCant) {
      const gap = u.waterStop.h;
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
  protected drawNote(): void {
    const u = this.struct;
    const fig = this.fig;
    let id;
    if (this.isCant) {
      id =
        u.cantLeft > 0
          ? this.figures.sEndWallLeft.id
          : this.figures.sEndWallRight.id;
    } else {
      id =
        u.cantLeft === 0
          ? this.figures.sEndWallLeft.id
          : this.figures.sEndWallRight.id;
    }
    fig.push(
      fig.sectSymbol(
        id,
        vec(-u.shell.r - u.shell.t - u.oBeam.w - 0.5 * fig.h, fig.h),
        vec(-u.shell.r + 0.5 * fig.h, fig.h)
      )
    );
  }
  protected drawDim(): void {
    const u = this.struct;
    const fig = this.fig;
    const box = fig.getBoundingBox();
    const dim = fig.dimBuilder();
    dim
      .hTop(-u.shell.r - u.shell.t - u.oBeam.w, box.top + 2 * fig.h)
      .dim(u.oBeam.w + u.shell.t);
    if (u.iBeam.w > 0) dim.dim(u.iBeam.w);
    dim.dim(2 * u.shell.r - 2 * u.iBeam.w);
    if (u.iBeam.w > 0) dim.dim(u.iBeam.w);
    dim
      .dim(u.oBeam.w + u.shell.t)
      .next()
      .dim(2 * u.oBeam.w + 2 * u.shell.t + 2 * u.shell.r);

    dim.vRight(box.right + 2 * fig.h, u.shell.hd);
    if (u.iBeam.hd > 0) dim.dim(u.iBeam.hd);
    if (u.iBeam.hs > 0) dim.dim(u.iBeam.hs);
    dim
      .dim(u.shell.hd - u.iBeam.hd - u.iBeam.hs)
      .dim(u.shell.r)
      .dim(u.endSect.hd + u.endSect.hs - u.shell.hd - u.shell.r - u.support.h);
    if (u.support.h > 0) dim.dim(u.support.h);
    dim
      .next()
      .dim(u.endSect.hd)
      .dim(u.endSect.hs)
      .next()
      .dim(u.endSect.hd + u.endSect.hs);

    dim
      .hBottom(-u.shell.r - u.shell.t - u.oBeam.w, box.bottom - 2 * fig.h)
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

  protected drawBeamBot(): void {
    const u = this.struct;
    const fig = this.fig;
    const rebars = this.rebars;
    const bar = rebars.end.bBot;
    fig.push(
      fig
        .planeRebar()
        .rebar(bar.shape())
        .spec(bar)
        .leaderNote(
          vec(-u.shell.r / 4, u.shell.hd - u.endHeight - 2 * fig.h),
          vec(0, 1),
          vec(-1, 0)
        )
        .generate()
    );
  }
  protected drawBeamMid(): void {
    const u = this.struct;
    const fig = this.fig;
    const rebars = this.rebars;
    const bar = rebars.end.bMid;
    fig.push(
      fig
        .planeRebar()
        .rebar(...bar.shape())
        .spec(bar)
        .leaderNote(
          vec(u.shell.r / 4, u.shell.hd - u.endHeight - 2 * fig.h),
          vec(0, 1),
          vec(1, 0)
        )
        .generate()
    );
  }
  protected drawBeamStir(): void {
    const u = this.struct;
    const fig = this.fig;
    const rebars = this.rebars;
    const bar = this.isCant ? rebars.end.bStir : rebars.end.bStirCant;
    const midCount = rebars.end.bMid.singleCount;
    const as = rebars.as;
    const y0 = u.shell.hd - u.endHeight + u.support.h + as;
    const y1 = -u.shell.r - u.waterStop.h - as;
    const y = y0 + (0.5 * (y1 - y0)) / (midCount + 1);
    const lens = bar.shape();
    fig.push(
      fig
        .planeRebar()
        .spec(bar)
        .count(lens.length)
        .space(bar.space)
        .rebar(...lens)
        .leaderNote(
          vec(-u.shell.r - u.shell.t - u.oBeam.w + u.endSect.w - 2 * fig.h, y),
          vec(1, 0)
        )
        .generate()
    );
  }
  protected drawBeamTop(): void {
    const u = this.struct;
    const fig = this.fig;
    const rebars = this.rebars;
    const bar = rebars.end.bTop;
    fig.push(
      fig
        .planeRebar()
        .rebar(bar.shape())
        .spec(bar)
        .leaderNote(
          vec(-u.shell.r / 4, -u.shell.r + 4 * fig.h),
          vec(0, 1),
          vec(1, 0)
        )
        .generate()
    );
  }
  protected drawCOuter(): void {
    const u = this.struct;
    const fig = this.fig;
    const rebars = this.rebars;
    const bar = rebars.end.cOuter;
    const left = bar.shape();
    const right = left.mirrorByVAxis();
    fig.push(
      fig
        .planeRebar()
        .rebar(left)
        .spec(bar)
        .leaderNote(
          vec(-u.shell.r - u.shell.t - u.oBeam.w - 2 * fig.h, u.shell.hd / 2),
          vec(1, 0)
        )
        .generate(),
      fig
        .planeRebar()
        .rebar(right)
        .spec(bar)
        .leaderNote(
          vec(u.shell.r + u.shell.t + u.oBeam.w + 2 * fig.h, u.shell.hd / 2),
          vec(1, 0)
        )
        .generate()
    );
  }
  protected drawTopBeam(): void {
    const u = this.struct;
    const fig = this.fig;
    const rebars = this.rebars;
    if (u.iBeam.w > 0) {
      const bar = this.isCant ? rebars.end.topBeam : rebars.end.topBeamCant;
      const left = bar.shape();
      const right = left.mirrorByVAxis();
      const x = u.shell.r - u.iBeam.w - 1.5 * fig.h;
      const y = u.shell.hd - u.iBeam.hd - 2 * fig.h;
      fig.push(
        fig
          .planeRebar()
          .rebar(left)
          .spec(bar)
          .leaderNote(vec(-x, y), vec(-1, 1), vec(1, 0))
          .generate(),
        fig
          .planeRebar()
          .rebar(right)
          .spec(bar)
          .leaderNote(vec(x, y), vec(1, 1), vec(-1, 0))
          .generate()
      );
    }
  }
  protected drawWallStir(): void {
    const u = this.struct;
    const fig = this.fig;
    const rebars = this.rebars;
    const bar = this.isCant ? rebars.end.wStirCant : rebars.end.wStir;
    const lines = bar.shape();
    fig.push(
      fig
        .planeRebar()
        .spec(bar)
        .count(lines.length)
        .space(bar.space)
        .rebar(...lines.reverse())
        .cross(
          new Polyline(
            -u.shell.r -
              u.shell.t -
              u.oBeam.w +
              u.endSect.w +
              Math.max(u.support.w / 2, 200),
            u.shell.hd - u.endHeight
          )
            .lineBy(-u.endSect.w, u.endSect.hs)
            .lineBy(0, u.endSect.hd + 3 * fig.h)
        )
        .note(vec(1, 0))
        .generate(),
      fig
        .planeRebar()
        .spec(bar)
        .count(lines.length)
        .space(bar.space)
        .rebar(...lines.map((l) => l.mirrorByVAxis()))
        .cross(
          new Polyline(
            u.shell.r +
              u.shell.t +
              u.oBeam.w -
              u.endSect.w -
              Math.max(u.support.w / 2, 200),
            u.shell.hd - u.endHeight
          )
            .lineBy(u.endSect.w, u.endSect.hs)
            .lineBy(0, u.endSect.hd + 3 * fig.h)
        )
        .note(vec(-1, 0))
        .generate()
    );
  }
  protected drawCInner(): void {
    const u = this.struct;
    const fig = this.fig;
    const rebars = this.rebars;
    const bar = this.isCant ? rebars.shell.cInner : rebars.shell.cInnerSub;
    const space = this.isCant ? rebars.shell.cInner.space : 0;
    const path = bar.shape();
    const pt = vec(u.shell.r - 3 * fig.h, u.shell.hd / 5);
    fig.push(
      fig
        .planeRebar()
        .spec(bar)
        .space(space)
        .rebar(path)
        .leaderNote(pt, vec(1, 0))
        .generate()
    );
  }
}

export class CEnd extends UniformCEnd {
  protected isCant = false;
  isExist(): boolean {
    return this.struct.cantCount < 2;
  }
}

export class CEndCant extends UniformCEnd {
  protected isCant = true;
  isExist(): boolean {
    return this.struct.cantCount > 0;
  }
}
