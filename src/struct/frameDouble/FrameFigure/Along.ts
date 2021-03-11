import { Line, Polyline, TextDraw, TextAlign, vec } from "@/draw";
import { BeamView, ColumnViewAlong } from "@/struct/component";
import { SectFigure, FigureConfig } from "@/struct/utils";
import { FrameDoubleFigure } from "./FrameFigure";
import { FrameDoubleRebar } from "../FrameRebar";
import { FrameDoubleStruct } from "../FrameStruct";

export class FrameAlong extends SectFigure {
  protected unitScale = 1;
  protected drawScale = 50;
  protected config = new FigureConfig(true, true, true);
  constructor(
    protected struct: FrameDoubleStruct,
    protected rebars: FrameDoubleRebar,
    protected figures: FrameDoubleFigure
  ) {
    super();
  }
  draw(): void {
    this.buildOutline();
    this.buildRebar();
    this.buildNote();
    this.buildDim();
  }
  protected buildOutline(): void {
    const t = this.struct;
    this.fig.addOutline(
      new Polyline(-t.wAlong / 2, 0)
        .lineBy(0, t.h)
        .lineBy(t.wAlong, 0)
        .lineBy(0, -t.h)
        .greyLine(),
      new Polyline(-t.wAlong / 2 + t.col.h, 0)
        .lineBy(0, t.h - t.topAlong.h - t.topAlong.ha)
        .lineBy(t.topAlong.ha, t.topAlong.ha)
        .lineBy(t.hsAlong - t.col.h - 2 * t.topAlong.ha, 0)
        .lineBy(t.topAlong.ha, -t.topAlong.ha)
        .lineBy(0, -t.h + t.topAlong.h + t.topAlong.ha)
        .greyLine()
    );

    const w = t.hsAlong - t.col.h;
    const x0 = -w / 2;
    const ha = t.beamAlong.ha;

    for (let i = 1; i < t.n + 1; i++) {
      const y0 = t.h - i * t.vs;
      const y1 = y0 - t.beamAlong.h;
      this.fig.addOutline(
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

    this.fig.addOutline(
      new Line(
        vec(-t.wAlong / 2 - t.col.h, 0),
        vec(t.wAlong / 2 + t.col.h, 0)
      ).greyLine(),
      new Line(
        vec(-t.wAlong / 2 - t.col.h, -t.found.h),
        vec(t.wAlong / 2 + t.col.h, -t.found.h)
      ).greyLine()
    );
  }
  protected buildNote(): void {
    const t = this.struct;
    const { sTopAlong, sBeamAlong, sCol } = this.figures;
    const fig = this.fig;
    const { left, right } = fig.outline.getBoundingBox();
    fig.push(fig.breakline(vec(left, 0), vec(left, -t.found.h)));
    fig.push(fig.breakline(vec(right, 0), vec(right, -t.found.h)));
    const { top } = fig.getBoundingBox();

    fig.push(
      fig.sectSymbol(
        sTopAlong.id,
        vec(0, t.h - t.topAlong.h - 3 * fig.h),
        vec(0, top + fig.h)
      )
    );
    if (t.n > 0) {
      const y = t.h - t.vs - t.beamAlong.h;
      fig.push(
        fig.sectSymbol(
          sBeamAlong.id,
          vec(0, y - 2 * fig.h),
          vec(0, y + t.beamAlong.h + 2 * fig.h)
        )
      );
    }
    const y = t.h - 6 * fig.h;
    fig.push(
      fig.sectSymbol(
        sCol.id,
        vec(-t.wAlong / 2 - fig.h, y),
        vec(-t.wAlong / 2 + t.col.w + fig.h, y)
      )
    );

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
  protected buildDim(): void {
    const t = this.struct;
    const fig = this.fig;
    const { right, top, left } = fig.getBoundingBox();
    const dim = fig.dimBuilder();
    dim.vRight(right + fig.h, t.h);

    const n = t.n;
    if (n === 0) {
      dim.dim(t.topAlong.h).dim(t.h - t.topAlong.h);
    } else {
      dim.dim(t.topAlong.h).dim(t.hsAlong - t.topAlong.h);
      for (let i = 1; i < n; i++) {
        dim.dim(t.beamAlong.h).dim(t.hsAlong - t.beamAlong.h);
      }
      dim.dim(t.beamAlong.h).dim(t.h - n * t.hsAlong - t.beamAlong.h);
    }
    dim.next().dim(t.h).dim(t.found.h);

    // draw space dim
    dim.vLeft(left, t.h);
    for (const l of t.col.partition()) {
      dim.dim(l);
    }

    dim
      .hTop(-t.wAlong / 2, top + fig.h)
      .dim(t.col.h)
      .dim(t.hsAlong - t.col.h)
      .dim(t.col.h)
      .next()
      .dim(t.wAlong);
    fig.push(dim.generate());
  }
  protected colGen = new ColumnViewAlong(
    this.fig,
    this.struct.col,
    this.rebars.col
  );
  protected beamGen = new BeamView(
    this.fig,
    this.struct.beamAlong,
    this.rebars.beamAlong
  );
  protected topBeamGen = new BeamView(
    this.fig,
    this.struct.topAlong,
    this.rebars.topAlong
  );
  protected buildRebar(): void {
    const t = this.struct;
    const fig = this.fig;
    // col
    const left = this.colGen.generate();
    left.move(vec(-t.hsAlong / 2, 0));
    const right = left.mirrorByVAxis();
    fig.push(left, right);
    // topAlong
    const topAlong = this.topBeamGen.generate();
    topAlong.move(vec(0, t.h - t.topAlong.h / 2));
    fig.push(topAlong);
    // beam
    if (t.n > 1) {
      for (let i = 1; i < t.n + 1; i++) {
        const beam = this.beamGen.generate();
        beam.move(vec(0, t.h - t.vs * i - t.beamAlong.h / 2));
        fig.push(beam);
      }
    }
  }
}
