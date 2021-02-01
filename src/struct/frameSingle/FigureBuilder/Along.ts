import { Line, Polyline, vec, Text, TextAlign } from "@/draw";
import { FigureBase } from "../Base";

export class AlongFigure extends FigureBase {
  initFigure(): this {
    const fig = this.figures.along;
    const { id, title } = this.figures.sectId.gen();
    fig
      .resetScale(1, 50)
      .setTitle(title)
      .setId(id)
      .displayScale()
      .centerAligned()
      .baseAligned()
      .keepTitlePos();
    this.figures.record(fig);
    return this;
  }
  buildPos(): this {
    const fig = this.figures.along;
    const t = this.struct;
    fig.pos.v.set(Math.max(0, t.h - t.hs), t.h - t.topBeam.h);
    return this;
  }
  buildOutline(): this {
    const t = this.struct;
    const fig = this.figures.along;
    fig.addOutline(
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
      fig.addOutline(
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

    fig.addOutline(
      new Line(vec(-2 * t.col.h, 0), vec(2 * t.col.h, 0)).greyLine(),
      new Line(
        vec(-2 * t.col.h, -t.found.h),
        vec(2 * t.col.h, -t.found.h)
      ).greyLine()
    );

    return this;
  }
  buildNote(): this {
    const fig = this.figures.along;
    const t = this.struct;
    const left = fig.outline.getBoundingBox().left;
    const right = fig.outline.getBoundingBox().right;
    fig.breakline(vec(left, 0), vec(left, -t.found.h));
    fig.breakline(vec(right, 0), vec(right, -t.found.h));
    this.drawSpaceNote();
    return this;
  }
  protected drawSpaceNote(): void {
    const fig = this.figures.along;
    const t = this.struct;
    const x = fig.getBoundingBox().left - fig.h;
    const lens = t.calcColStirSpace();
    let h = t.h;
    const spaceText = `间距${this.rebars.column.stir.space}`;
    const denseSpaceText = `间距${this.rebars.column.stir.denseSpace}`;
    for (let i = 0; i < lens.length; i++) {
      const l = lens[i];
      if (i % 2 === 0) {
        fig.push(
          new Text(
            denseSpaceText,
            vec(x, h - l / 2),
            fig.h,
            TextAlign.BottomCenter,
            90
          )
        );
      } else {
        fig.push(
          new Text(
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
  buildDim(): this {
    const fig = this.figures.along;
    const t = this.struct;
    const { right, top, left } = fig.getBoundingBox();
    const dim = fig.dimBuilder();
    dim.vRight(right + fig.h, t.h);
    dim.dim(t.corbel.hd).dim(t.corbel.hs).next();

    const n = t.n;
    if (n === 0) {
      dim.dim(t.topBeam.h).dim(t.h - t.topBeam.h);
    } else {
      dim.dim(t.topBeam.h).dim(t.hs - t.topBeam.h);
      for (let i = 1; i < n; i++) {
        dim.dim(t.beam.h).dim(t.hs - t.beam.h);
      }
      dim.dim(t.beam.h).dim(t.h - n * t.hs - t.beam.h);
    }
    dim.next().dim(t.h).dim(t.found.h);

    // draw space dim
    dim.vLeft(left, t.h);
    for (const l of t.calcColStirSpace()) {
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
}
