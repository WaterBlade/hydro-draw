import { Line, Polyline, Side, vec } from "@/draw";
import { Figure, FigureContent } from "@/struct/utils";
import { UShellRebar } from "../UShellRebar";
import { UShellStruct } from "../UShellStruct";
import { SEndWall } from "./SEndWall";

export class CEnd extends Figure {
  protected _figCant?: FigureContent;
  get figCant(): FigureContent{
    if(!this._figCant) throw Error('fig cant not init');
    return this._figCant;
  }
  set figCant(val: FigureContent){
    this._figCant = val;
  }
  initFigure(u: UShellStruct): void {
    const bothExist =u.cantCount === 1;
    if (u.cantCount < 2) {
      this.fig = new FigureContent();
      const title = bothExist ? "槽身端肋钢筋图（非悬挑侧）" : "槽身端肋钢筋图";
      this.fig
        .resetScale(1, 50)
        .setTitle(title)
        .displayScale()
        .centerAligned()
        .keepTitlePos();
      this.container.record(this.fig);
    }
    if (u.cantCount > 0) {
      this.figCant = new FigureContent();
      const title = bothExist ? "槽身端肋钢筋图（悬挑侧）" : "槽身端肋钢筋图";
      this.figCant
        .resetScale(1, 50)
        .setTitle(title)
        .displayScale()
        .centerAligned()
        .keepTitlePos();
      this.container.record(this.figCant);
    }
  }
  build(u: UShellStruct, rebars: UShellRebar, sWall: SEndWall): void {
    if (u.cantCount < 2) {
      const fig = this.fig;
      this.buildOutline(u, fig);
      this.buildRebar(u, rebars, fig);
      this.buildNote(u, sWall, fig);
      this.buildDim(u, fig);
    }
    if (u.cantCount > 0) {
      const fig = this.figCant;
      this.buildOutline(u, fig, true);
      this.buildRebar(u, rebars, fig, true);
      this.buildNote(u, sWall , fig, true);
      this.buildDim(u, fig);
    }
  }
  protected buildOutline(u: UShellStruct, fig: FigureContent, isCant = false): void {
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
  protected buildRebar(u: UShellStruct, rebars: UShellRebar, fig: FigureContent, isCant = false): void {
    this.drawBeamBot(u, rebars, fig);
    this.drawBeamMid(u, rebars, fig);
    this.drawBeamStir(u, rebars, fig, isCant);
    this.drawBeamTop(u, rebars, fig);
    this.drawCOuter(u, rebars, fig);
    this.drawTopBeam(u, rebars, fig, isCant);
    this.drawWallStir(u, rebars, fig, isCant);
    this.drawCInner(u, rebars, fig, isCant);
  }
  protected buildNote(u: UShellStruct, sWall: SEndWall, fig: FigureContent, isCant = false): void {
    let id;
    if (isCant) {
      id = u.isLeftCantFigureExist()
        ? sWall.leftFig.id
        : sWall.rightFig.id;
    } else {
      id = u.isLeftFigureExist()
        ? sWall.leftFig.id
        : sWall.rightFig.id;
    }
    fig.sectSymbol(
      id,
      vec(-u.shell.r - u.shell.t - u.oBeam.w - 0.5 * fig.h, fig.h),
      vec(-u.shell.r + 0.5 * fig.h, fig.h)
    );
  }
  protected buildDim(u: UShellStruct, fig: FigureContent): void {
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

  protected drawBeamBot(u: UShellStruct, rebars: UShellRebar, fig: FigureContent): void {
    const bar = rebars.end.bBot;
    fig.push(
      fig
        .planeRebar()
        .rebar(bar.shape(u))
        .spec(bar.spec)
        .leaderNote(
          vec(-u.shell.r / 4, u.shell.hd - u.endHeight - 2 * fig.textHeight),
          vec(0, 1),
          vec(-1, 0)
        )
        .generate()
    );
  }
  protected drawBeamMid(u: UShellStruct, rebars: UShellRebar, fig: FigureContent): void {
    const bar = rebars.end.bMid;
    fig.push(
      fig
        .planeRebar()
        .rebar(...bar.shape(u))
        .spec(bar.spec)
        .leaderNote(
          vec(u.shell.r / 4, u.shell.hd - u.endHeight - 2 * fig.textHeight),
          vec(0, 1),
          vec(1, 0)
        )
        .generate()
    );
  }
  protected drawBeamStir(u: UShellStruct, rebars: UShellRebar, fig: FigureContent, isCant: boolean): void {
    const bar = rebars.end.bStir;
    const spec = isCant ? bar.specCant : bar.spec;
    const midCount = rebars.end.bMid.singleCount;
    const as = rebars.info.as;
    const y0 = u.shell.hd - u.endHeight + u.support.h + as;
    const y1 = -u.shell.r - u.waterStop.h - as;
    const y = y0 + (0.5 * (y1 - y0)) / (midCount + 1);
    const lens = isCant ? bar.shapeCant(u) : bar.shape(u);
    fig.push(
      fig
        .planeRebar()
        .spec(spec, lens.length, bar.space)
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
  protected drawBeamTop(u: UShellStruct, rebars: UShellRebar, fig: FigureContent): void {
    const bar = rebars.end.bTop;
    fig.push(
      fig
        .planeRebar()
        .rebar(bar.shape(u))
        .spec(bar.spec)
        .leaderNote(
          vec(-u.shell.r / 4, -u.shell.r + 4 * fig.textHeight),
          vec(0, 1),
          vec(1, 0)
        )
        .generate()
    );
  }
  protected drawCOuter(u: UShellStruct, rebars: UShellRebar, fig: FigureContent): void {
    const bar = rebars.end.cOuter;
    const left = bar.shape(u);
    const right = left.mirrorByVAxis();
    fig.push(
      fig
        .planeRebar()
        .rebar(left)
        .spec(bar.spec)
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
        .spec(bar.spec)
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
  protected drawTopBeam(u: UShellStruct, rebars: UShellRebar, fig: FigureContent, isCant: boolean): void {
    const bar = rebars.end.topBeam;
    const spec = isCant ? bar.specCant : bar.spec;
    const left = isCant
      ? bar.shapeCant(u)
      : bar.shape(u);
    const right = left.mirrorByVAxis();
    const x = u.shell.r - u.iBeam.w - 1.5 * fig.textHeight;
    const y = u.shell.hd - u.iBeam.hd - 2 * fig.textHeight;
    fig.push(
      fig
        .planeRebar()
        .rebar(left)
        .spec(spec)
        .leaderNote(vec(-x, y), vec(-1, 1), vec(1, 0))
        .generate(),
      fig
        .planeRebar()
        .rebar(right)
        .spec(spec)
        .leaderNote(vec(x, y), vec(1, 1), vec(-1, 0))
        .generate()
    );
  }
  protected drawWallStir(u: UShellStruct, rebars: UShellRebar, fig: FigureContent, isCant: boolean): void {
    const bar = rebars.end.wStir;
    const spec = isCant ? bar.specCant : bar.spec;
    const lines = isCant ? bar.shapeCant(u) : bar.shape(u);
    fig.push(
      fig
        .planeRebar()
        .spec(spec, lines.length, bar.space)
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
        .spec(spec, lines.length, bar.space)
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
  protected drawCInner(u: UShellStruct, rebars: UShellRebar, fig: FigureContent, isCant = false): void {
    const bar = rebars.shell.cInner;
    const spec = isCant ? bar.specSub : bar.spec;
    const as = rebars.info.as;
    const gap = isCant ? 0 : u.waterStop.h;
    const space = isCant ? rebars.shell.cInner.space : 0;
    const path = bar.shape(u)
      .offset(as + gap, Side.Right)
      .removeStart()
      .removeEnd();
    const pt = vec(u.shell.r - 3 * fig.textHeight, u.shell.hd / 5);
    fig.push(
      fig
        .planeRebar()
        .spec(spec, 0, space)
        .rebar(path)
        .leaderNote(pt, vec(1, 0))
        .generate()
    );
  }
}
