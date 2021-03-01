import { Line, Polyline, vec, Text, TextAlign } from "@/draw";
import { ColumnViewAlong, TopBeamViewAlong } from "@/struct/component";
import { Figure, FigureContent } from "@/struct/utils";
import { FrameSingleRebar } from "../FrameRebar";
import { FrameSingleStruct } from "../FrameStruct";

export class FrameAlong extends Figure {
  initFigure(): void {
    this.fig = new FigureContent();
    const { id, title } = this.container.sectId;
    this.fig
      .resetScale(1, 50)
      .setTitle(title)
      .setId(id)
      .displayScale()
      .centerAligned()
      .baseAligned()
      .keepTitlePos();
    this.container.record(this.fig);
  }
  build(t: FrameSingleStruct, rebars: FrameSingleRebar): void {
    this.buildOutline(t);
    this.buildRebar(t, rebars);
    this.buildNote(t, rebars);
    this.buildDim(t);
  }
  protected buildOutline(t: FrameSingleStruct): void {
    this.fig.addOutline(
      new Polyline(-t.col.h / 2, 0)
        .lineBy(0, t.h - t.topBeam.h)
        .lineBy(-t.topBeam.ws, t.topBeam.hs)
        .lineBy(0, t.topBeam.hd)
        .lineBy(t.topBeam.ws * 2 + t.col.h, 0)
        .lineBy(0, -t.topBeam.hd)
        .lineBy(-t.topBeam.ws, -t.topBeam.hs)
        .lineBy(0, -t.h + t.topBeam.h)
        .greyLine(),
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
  protected buildNote(t: FrameSingleStruct, rebars: FrameSingleRebar): void {
    const fig = this.fig;
    const left = fig.outline.getBoundingBox().left;
    const right = fig.outline.getBoundingBox().right;
    fig.breakline(vec(left, 0), vec(left, -t.found.h));
    fig.breakline(vec(right, 0), vec(right, -t.found.h));
    this.drawSpaceNote(t, rebars);
  }
  protected drawSpaceNote(
    t: FrameSingleStruct,
    rebars: FrameSingleRebar
  ): void {
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
  protected buildDim(t: FrameSingleStruct): this {
    const fig = this.fig;
    const { right, left, top } = fig.getBoundingBox();
    const dim = fig.dimBuilder();
    dim.vRight(right + fig.h, t.h);

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

    dim.hTop(-t.topBeam.w/2, top+fig.h)
      .dim(t.topBeam.ws).dim(t.topBeam.wb).dim(t.topBeam.ws)
      .next().dim(t.topBeam.w);

    // draw space dim
    dim.vLeft(left, t.h);
    console.log(t.col.partition());
    for (const l of t.col.partition()) {
      dim.dim(l);
    }

    fig.push(dim.generate());
    return this;
  }
  protected colGen = new ColumnViewAlong();
  protected topGen = new TopBeamViewAlong();
  protected buildRebar(t: FrameSingleStruct, rebars: FrameSingleRebar): void {
    const fig = this.fig;
    fig.push(this.colGen.generate(fig, t.col, rebars.col));
    const top = this.topGen.generate(fig, t.topBeam, rebars.topBeam);
    top.move(vec(0, t.h - t.topBeam.h/2));
    fig.push(top);
  }
}
