import { Line, Polyline, Side, vec } from "@/draw";
import { Figure } from "@/struct/utils/Figure";
import { UShellFigureContext } from "../UShell";

export class CEnd extends UShellFigureContext {
  initFigure(): this {
    const bothExist =
      this.struct.isEndFigureExist() && this.struct.isEndCantFigureExist();
    if (this.struct.isEndFigureExist()) {
      const fig = this.figures.cEnd;
      const title = bothExist ? "槽身端肋钢筋图（非悬挑侧）" : "槽身端肋钢筋图";
      fig
        .resetScale(1, 50)
        .setTitle(title)
        .displayScale()
        .centerAligned()
        .keepTitlePos();
      this.figures.record(fig);
    }
    if (this.struct.isEndCantFigureExist()) {
      const fig = this.figures.cEndCant;
      const title = bothExist ? "槽身端肋钢筋图（悬挑侧）" : "槽身端肋钢筋图";
      fig
        .resetScale(1, 50)
        .setTitle(title)
        .displayScale()
        .centerAligned()
        .keepTitlePos();
      this.figures.record(fig);
    }
    return this;
  }
  build(): void {
    if (this.struct.isEndFigureExist()) {
      const fig = this.figures.cEnd;
      this.buildOutline(fig);
      this.buildRebar(fig);
      this.buildNote(fig);
      this.buildDim(fig);
    }
    if (this.struct.isEndCantFigureExist()) {
      const fig = this.figures.cEndCant;
      this.buildOutline(fig, true);
      this.buildRebar(fig, true);
      this.buildNote(fig, true);
      this.buildDim(fig);
    }
  }
  protected buildOutline(fig: Figure, isCant = false): void {
    const u = this.struct;
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

    if (!isCant) {
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
  protected buildRebar(fig: Figure, isCant = false): void {
    this.drawBeamBot(fig);
    this.drawBeamMid(fig);
    this.drawBeamStir(fig, isCant);
    this.drawBeamTop(fig);
    this.drawCOuter(fig);
    this.drawTopBeam(fig, isCant);
    this.drawWallStir(fig, isCant);
    this.drawCInner(fig, isCant);
  }
  protected buildNote(fig: Figure, isCant = false): void {
    const u = this.struct;
    let id;
    if (isCant) {
      id = u.isLeftCantFigureExist()
        ? this.figures.sEndCantWLeft.id
        : this.figures.sEndCantWRight.id;
    } else {
      id = u.isLeftFigureExist()
        ? this.figures.sEndWLeft.id
        : this.figures.sEndWRight.id;
    }
    fig.sectSymbol(
      id,
      vec(-u.shell.r - u.shell.t - u.oBeam.w - 0.5 * fig.h, fig.h),
      vec(-u.shell.r + 0.5 * fig.h, fig.h)
    );
  }
  protected buildDim(fig: Figure): void {
    const u = this.struct;
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
      .dim(u.endSect.hd + u.endSect.hs - u.shell.hd - u.shell.r - u.support.h);
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

  protected drawBeamBot(fig: Figure): void {
    const u = this.struct;
    const bar = this.rebars.end.bBot;
    fig.push(
      fig
        .planeRebar()
        .rebar(this.shape.end.bBot())
        .spec(bar)
        .leaderNote(
          vec(-u.shell.r / 4, u.shell.hd - u.endHeight - 2 * fig.textHeight),
          vec(0, 1),
          vec(-1, 0)
        )
        .generate()
    );
  }
  protected drawBeamMid(fig: Figure): void {
    const u = this.struct;
    const bar = this.rebars.end.bMid;
    fig.push(
      fig
        .planeRebar()
        .rebar(...this.shape.end.bMid())
        .spec(bar)
        .leaderNote(
          vec(u.shell.r / 4, u.shell.hd - u.endHeight - 2 * fig.textHeight),
          vec(0, 1),
          vec(1, 0)
        )
        .generate()
    );
  }
  protected drawBeamStir(fig: Figure, isCant: boolean): void {
    const u = this.struct;
    const bar = isCant ? this.rebars.end.bStirCant : this.rebars.end.bStir;
    const midCount = this.rebars.end.bMid.singleCount;
    const as = this.rebars.as;
    const y0 = u.shell.hd - u.endHeight + u.support.h + as;
    const y1 = -u.shell.r - u.waterStop.h - as;
    const y = y0 + (0.5 * (y1 - y0)) / (midCount + 1);
    const lens = isCant ? this.shape.end.bStirCant() : this.shape.end.bStir();
    fig.push(
      fig
        .planeRebar()
        .spec(bar, lens.length, bar.space)
        .rebar(...lens)
        .leaderNote(
          vec(
            -u.shell.r -
              u.shell.t -
              u.oBeam.w +
              u.endSect.w -
              2 * fig.textHeight,
            y
          ),
          vec(1, 0)
        )
        .generate()
    );
  }
  protected drawBeamTop(fig: Figure): void {
    const u = this.struct;
    const bar = this.rebars.end.bTop;
    fig.push(
      fig
        .planeRebar()
        .rebar(this.shape.end.bTop())
        .spec(bar)
        .leaderNote(
          vec(-u.shell.r / 4, -u.shell.r + 4 * fig.textHeight),
          vec(0, 1),
          vec(1, 0)
        )
        .generate()
    );
  }
  protected drawCOuter(fig: Figure): void {
    const u = this.struct;
    const bar = this.rebars.end.cOuter;
    const left = this.shape.end.cOuter();
    const right = left.mirrorByVAxis();
    fig.push(
      fig
        .planeRebar()
        .rebar(left)
        .spec(bar)
        .leaderNote(
          vec(
            -u.shell.r - u.shell.t - u.oBeam.w - 2 * fig.textHeight,
            u.shell.hd / 2
          ),
          vec(1, 0)
        )
        .generate(),
      fig
        .planeRebar()
        .rebar(right)
        .spec(bar)
        .leaderNote(
          vec(
            u.shell.r + u.shell.t + u.oBeam.w + 2 * fig.textHeight,
            u.shell.hd / 2
          ),
          vec(1, 0)
        )
        .generate()
    );
  }
  protected drawTopBeam(fig: Figure, isCant: boolean): void {
    const u = this.struct;
    const bar = isCant ? this.rebars.end.topBeamCant : this.rebars.end.topBeam;
    const left = isCant
      ? this.shape.end.topBeamCant()
      : this.shape.end.topBeam();
    const right = left.mirrorByVAxis();
    const x = u.shell.r - u.iBeam.w - 1.5 * fig.textHeight;
    const y = u.shell.hd - u.iBeam.hd - 2 * fig.textHeight;
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
  protected drawWallStir(fig: Figure, isCant: boolean): void {
    const u = this.struct;
    const bar = isCant ? this.rebars.end.wStirCant : this.rebars.end.wStir;
    const lines = isCant ? this.shape.end.wStirCant() : this.shape.end.wStir();
    fig.push(
      fig
        .planeRebar()
        .spec(bar, lines.length, bar.space)
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
            .lineBy(0, u.endSect.hd + 3 * fig.textHeight)
        )
        .note(vec(1, 0))
        .generate(),
      fig
        .planeRebar()
        .spec(bar, lines.length, bar.space)
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
            .lineBy(0, u.endSect.hd + 3 * fig.textHeight)
        )
        .note(vec(-1, 0))
        .generate()
    );
  }
  protected drawCInner(fig: Figure, isCant = false): void {
    const u = this.struct;
    const bar = isCant ? this.rebars.shell.cInner : this.rebars.shell.cInnerSub;
    const as = this.rebars.as;
    const gap = isCant ? 0 : u.waterStop.h;
    const space = isCant ? this.rebars.shell.cInner.space : 0;
    const path = this.shape.shell
      .cInner()
      .offset(as + gap, Side.Right)
      .removeStart()
      .removeEnd();
    const pt = vec(u.shell.r - 3 * fig.textHeight, u.shell.hd / 5);
    fig.push(
      fig
        .planeRebar()
        .spec(bar, 0, space)
        .rebar(path)
        .leaderNote(pt, vec(1, 0))
        .generate()
    );
  }
}
