import { Line, Polyline, vec, TextDraw, TextAlign } from "@/draw";
import { ColumnViewAlong } from "@/struct/component";
import { SectFigure, FigureConfig } from "@/struct/utils";
import { FrameSingleRebar } from "../FrameRebar";
import { FrameSingleStruct } from "../FrameStruct";

export class FrameAlong extends SectFigure {
  constructor(
    protected struct: FrameSingleStruct,
    protected rebars: FrameSingleRebar
  ) {
    super();
  }
  protected unitScale = 1;
  protected drawScale = 50;
  protected config = new FigureConfig(true, true, true);
  draw(): void {
    this.buildOutline();
    this.buildRebar();
    this.buildNote();
    this.buildDim();
  }
  protected buildOutline(): void {
    const t = this.struct;
    this.fig.addOutline(
      new Polyline(-t.col.h / 2, 0)
        .lineBy(0, t.h - t.corbel.h)
        .lineBy(-t.corbel.w, t.corbel.hs)
        .lineBy(0, t.corbel.hd)
        .lineBy(t.corbel.w * 2 + t.col.h, 0)
        .lineBy(0, -t.corbel.hd)
        .lineBy(-t.corbel.w, -t.corbel.hs)
        .lineBy(0, -t.h + t.corbel.h)
        .greyLine(),
      new Polyline(-t.topBeam.w / 2, t.h)
        .lineBy(t.topBeam.w, 0)
        .lineBy(0, -t.topBeam.h - t.topBeam.ha)
        .lineBy(-t.topBeam.w, 0)
        .lineBy(0, t.topBeam.h + t.topBeam.ha)
        .dashedLine(),
      new Line(
        vec(-t.topBeam.w / 2, t.h - t.topBeam.h),
        vec(t.topBeam.w / 2, t.h - t.topBeam.h)
      ).dashedLine()
    );

    const ha = t.beam.ha;
    const w = t.beam.w;
    const h = t.beam.h;
    const x0 = -w / 2;
    const x1 = w / 2;

    for (let i = 1; i < t.n + 1; i++) {
      const y0 = t.h - i * t.vs;
      const y1 = y0 - h;
      this.fig.addOutline(
        new Polyline(x0, y0 + ha)
          .lineBy(w, 0)
          .lineBy(0, -h - 2 * ha)
          .lineBy(-w, 0)
          .lineBy(0, h + 2 * ha)
          .dashedLine(),
        new Line(vec(x0, y0), vec(x1, y0)).dashedLine(),
        new Line(vec(x0, y1), vec(x1, y1)).dashedLine()
      );
    }

    this.fig.addOutline(
      new Line(vec(-2 * t.col.h, 0), vec(2 * t.col.h, 0)).greyLine(),
      new Line(
        vec(-2 * t.col.h, -t.found.h),
        vec(2 * t.col.h, -t.found.h)
      ).greyLine()
    );
  }
  protected buildNote(): void {
    const t = this.struct;
    const fig = this.fig;
    const left = fig.outline.getBoundingBox().left;
    const right = fig.outline.getBoundingBox().right;
    fig.push(fig.breakline(vec(left, 0), vec(left, -t.found.h)));
    fig.push(fig.breakline(vec(right, 0), vec(right, -t.found.h)));
    this.drawSpaceNote();
  }
  protected drawSpaceNote(): void {
    const t = this.struct;
    const rebars = this.rebars;
    const fig = this.fig;
    const x = fig.getBoundingBox().left - fig.h;
    const lens = t.col.partition();
    let h = t.h;
    const spaceText = `间距${rebars.col.stir.space}`;
    const denseSpaceText = `间距${rebars.col.stir.denseSpace}`;
    for (let i = 0; i < lens.length; i++) {
      const l = lens[i];
      if (i % 2 === 0) {
        fig.push(
          new TextDraw(
            denseSpaceText,
            vec(x, h - l / 2),
            fig.h,
            TextAlign.BottomCenter,
            90
          )
        );
      } else {
        fig.push(
          new TextDraw(
            spaceText,
            vec(x, h - l / 2),
            fig.h,
            TextAlign.BottomCenter,
            90
          )
        );
      }
      h -= l;
    }
  }
  protected buildDim(): this {
    const t = this.struct;
    const fig = this.fig;
    const { right, top, left } = fig.getBoundingBox();
    const dim = fig.dimBuilder();
    dim.vRight(right + fig.h, t.h);
    dim.dim(t.corbel.hd).dim(t.corbel.hs).next();

    const n = t.n;
    if (n === 0) {
      dim.dim(t.topBeam.h).dim(t.h - t.topBeam.h);
    } else {
      dim.dim(t.topBeam.h).dim(t.vs - t.topBeam.h);
      for (let i = 1; i < n; i++) {
        dim.dim(t.beam.h).dim(t.vs - t.beam.h);
      }
      dim.dim(t.beam.h).dim(t.h - n * t.vs - t.beam.h);
    }
    dim.next().dim(t.h).dim(t.found.h);

    // draw space dim
    dim.vLeft(left, t.h);
    for (const l of t.col.partition()) {
      dim.dim(l);
    }

    dim
      .hTop(-t.corbel.w - t.col.h / 2, top + fig.h)
      .dim(t.corbel.w)
      .dim(t.col.h)
      .dim(t.corbel.w)
      .next()
      .dim(t.corbel.w * 2 + t.col.h);
    fig.push(dim.generate());
    return this;
  }
  protected colGen = new ColumnViewAlong(
    this.fig,
    this.struct.col,
    this.rebars.col
  );
  protected buildRebar(): void {
    const fig = this.fig;
    fig.push(this.colGen.generate());
    this.buildCorbelMain();
    this.buildCorbelHStir();
    this.buildCorbelVStir();
  }
  protected buildCorbelMain(): void {
    const t = this.struct;
    const rebars = this.rebars;
    const fig = this.fig;
    const bar = rebars.corbel.main;
    fig.push(
      fig
        .planeRebar()
        .rebar(bar.shape())
        .spec(bar)
        .count(bar.singleCount)
        .leaderNote(
          vec(t.col.h / 2 + t.corbel.w, t.h - t.corbel.h - t.corbel.w / 2),
          vec(-1, 1),
          vec(1, 0)
        )
        .generate()
    );
  }
  protected buildCorbelHStir(): void {
    const t = this.struct;
    const rebars = this.rebars;
    const bar = rebars.corbel.hStir;
    const fig = this.fig;
    const lens = bar.shape();
    fig.push(
      fig
        .planeRebar()
        .rebar(...lens)
        .spec(bar)
        .count(lens.length)
        .space(bar.space)
        .leaderNote(
          vec(t.col.h / 2, t.h + 2 * fig.h),
          vec(0, 1),
          vec(1, 0)
        )
        .generate()
    );
  }
  protected buildCorbelVStir(): void {
    const t = this.struct;
    const rebars = this.rebars;
    const bar = rebars.corbel.vStir;
    const fig = this.fig;
    const as = rebars.as;
    const left = bar.shape();
    const right = left.map((l) => l.mirrorByVAxis());
    fig.push(
      fig
        .planeRebar()
        .rebar(...left, ...right)
        .spec(bar)
        .count(left.length + right.length)
        .leaderNote(
          vec(
            -t.col.h / 2 - t.corbel.w - fig.h,
            t.h - as - rebars.corbel.hStir.space / 2
          ),
          vec(1, 0)
        )
        .generate()
    );
  }
}
