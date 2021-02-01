import { Line, Polyline, Text, TextAlign, vec } from "@/draw";
import { FigureBase } from "../Base";

export class CrossFigure extends FigureBase {
  initFigure(): this {
    const fig = this.figures.cross;
    fig
      .resetScale(1, 50)
      .setTitle("垂直水流向立面钢筋图")
      .displayScale()
      .centerAligned()
      .baseAligned()
      .keepTitlePos();
    this.figures.record(fig);
    return this;
  }
  buildPos(): this {
    const fig = this.figures.cross;
    const t = this.struct;
    fig.pos.v.set(Math.max(0, t.h - t.hs), t.h - t.topBeam.h);
    return this;
  }
  buildOutline(): this {
    const t = this.struct;
    const fig = this.figures.cross;
    fig.addOutline(
      new Polyline(-t.w / 2, 0)
        .lineBy(0, t.h)
        .lineBy(t.w, 0)
        .lineBy(0, -t.h)
        .greyLine(),
      new Polyline(-t.w / 2 + t.col.w, 0)
        .lineBy(0, t.h - t.topBeam.h - t.topBeam.ha)
        .lineBy(t.topBeam.ha, t.topBeam.ha)
        .lineBy(t.hs - t.col.w - 2 * t.topBeam.ha, 0)
        .lineBy(t.topBeam.ha, -t.topBeam.ha)
        .lineBy(0, -t.h + t.topBeam.h + t.topBeam.ha)
        .greyLine()
    );

    const w = t.hs - t.col.w;
    const x0 = -w / 2;
    const ha = t.beam.ha;

    for (let i = 1; i < t.n + 1; i++) {
      const y0 = t.h - i * t.vs;
      const y1 = y0 - t.beam.h;
      fig.addOutline(
        new Polyline(x0, y0 + ha)
          .lineBy(ha, -ha)
          .lineBy(w - 2 * ha, 0)
          .lineBy(ha, ha)
          .greyLine(),
        new Polyline(x0, y1 - ha)
          .lineBy(ha, ha)
          .lineBy(w - 2 * ha, 0)
          .lineBy(ha, -ha)
          .greyLine()
      );
    }

    fig.addOutline(
      new Line(
        vec(-t.w / 2 - t.col.w, 0),
        vec(t.w / 2 + t.col.w, 0)
      ).greyLine(),
      new Line(
        vec(-t.w / 2 - t.col.w, -t.found.h),
        vec(t.w / 2 + t.col.w, -t.found.h)
      ).greyLine()
    );

    return this;
  }
  buildNote(): this {
    const fig = this.figures.cross;
    const t = this.struct;
    const { left, right } = fig.outline.getBoundingBox();
    fig.breakline(vec(left, 0), vec(left, -t.found.h));
    fig.breakline(vec(right, 0), vec(right, -t.found.h));
    const { top, bottom } = fig.getBoundingBox();
    fig.sectSymbol(
      this.figures.along.id,
      vec(-t.w / 2, bottom - fig.h),
      vec(-t.w / 2, top + fig.h)
    );

    fig.sectSymbol(
      this.figures.sTop.id,
      vec(0, t.h - t.topBeam.h - 3 * fig.h),
      vec(0, top + fig.h)
    );
    if (t.n > 0) {
      const y = t.h - t.hs - t.beam.h;
      fig.sectSymbol(
        this.figures.sBeam.id,
        vec(0, y - 2 * fig.h),
        vec(0, y + t.beam.h + 2 * fig.h)
      );
    }
    const space = fig.pos.v.findR(2.5 * fig.h);
    if (space) {
      const y = space.mid;
      fig.sectSymbol(
        this.figures.sCol.id,
        vec(-t.w / 2 - fig.h, y),
        vec(-t.w / 2 + t.col.w + fig.h, y)
      );
    }

    this.drawSpaceNote();

    return this;
  }
  protected drawSpaceNote(): void {
    const fig = this.figures.cross;
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
    const fig = this.figures.cross;
    const t = this.struct;
    const { right, top, left } = fig.getBoundingBox();
    const dim = fig.dimBuilder();
    dim.vRight(right + fig.h, t.h);

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
      .hTop(-t.w / 2, top + fig.h)
      .dim(t.col.w)
      .dim(t.hs - t.col.w)
      .dim(t.col.w)
      .next()
      .dim(t.w);
    fig.push(dim.generate());
    return this;
  }
}
