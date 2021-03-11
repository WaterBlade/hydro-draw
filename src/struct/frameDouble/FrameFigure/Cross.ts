import { Line, Polyline, TextDraw, TextAlign, vec } from "@/draw";
import { BeamView, ColumnViewCross } from "@/struct/component";
import { Figure, FigureConfig } from "@/struct/utils";
import { FrameDoubleRebar } from "../FrameRebar";
import { FrameDoubleStruct } from "../FrameStruct";
import { FrameDoubleFigure } from "./FrameFigure";

export class FrameCross extends Figure {
  protected unitScale = 1;
  protected drawScale = 50;
  protected title = "垂直水流向立面钢筋图";
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
      new Polyline(-t.wCross / 2, 0)
        .lineBy(0, t.h)
        .lineBy(t.wCross, 0)
        .lineBy(0, -t.h)
        .greyLine(),
      new Polyline(-t.wCross / 2 + t.col.w, 0)
        .lineBy(0, t.h - t.topCross.h - t.topCross.ha)
        .lineBy(t.topCross.ha, t.topCross.ha)
        .lineBy(t.hsCross - t.col.w - 2 * t.topCross.ha, 0)
        .lineBy(t.topCross.ha, -t.topCross.ha)
        .lineBy(0, -t.h + t.topCross.h + t.topCross.ha)
        .greyLine()
    );

    const w = t.hsCross - t.col.w;
    const x0 = -w / 2;
    const ha = t.beamCross.ha;

    for (let i = 1; i < t.n + 1; i++) {
      const y0 = t.h - i * t.vs;
      const y1 = y0 - t.beamCross.h;
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
        vec(-t.wCross / 2 - t.col.w, 0),
        vec(t.wCross / 2 + t.col.w, 0)
      ).greyLine(),
      new Line(
        vec(-t.wCross / 2 - t.col.w, -t.found.h),
        vec(t.wCross / 2 + t.col.w, -t.found.h)
      ).greyLine()
    );
  }
  protected buildNote(): void {
    const t = this.struct;
    const { along, sTopCross, sBeamCross, sCol } = this.figures;
    const fig = this.fig;
    const { left, right } = fig.outline.getBoundingBox();
    fig.push(fig.breakline(vec(left, 0), vec(left, -t.found.h)));
    fig.push(fig.breakline(vec(right, 0), vec(right, -t.found.h)));
    const { top, bottom } = fig.getBoundingBox();
    fig.push(
      fig.sectSymbol(
        along.id,
        vec(-t.wCross / 2, bottom - fig.h),
        vec(-t.wCross / 2, top + fig.h)
      )
    );

    fig.push(
      fig.sectSymbol(
        sTopCross.id,
        vec(0, t.h - t.topCross.h - 3 * fig.h),
        vec(0, top + fig.h)
      )
    );
    if (t.n > 0) {
      const y = t.h - t.vs - t.beamCross.h;
      fig.push(
        fig.sectSymbol(
          sBeamCross.id,
          vec(0, y - 2 * fig.h),
          vec(0, y + t.beamCross.h + 2 * fig.h)
        )
      );
    }
    const y = t.h - 6 * fig.h;
    fig.push(
      fig.sectSymbol(
        sCol.id,
        vec(-t.wCross / 2 - fig.h, y),
        vec(-t.wCross / 2 + t.col.w + fig.h, y)
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
      dim.dim(t.topCross.h).dim(t.h - t.topCross.h);
    } else {
      dim.dim(t.topCross.h).dim(t.hsCross - t.topCross.h);
      for (let i = 1; i < n; i++) {
        dim.dim(t.beamCross.h).dim(t.hsCross - t.beamCross.h);
      }
      dim.dim(t.beamCross.h).dim(t.h - n * t.hsCross - t.beamCross.h);
    }
    dim.next().dim(t.h).dim(t.found.h);

    // draw space dim
    dim.vLeft(left, t.h);
    for (const l of t.col.partition()) {
      dim.dim(l);
    }

    dim
      .hTop(-t.wCross / 2, top + fig.h)
      .dim(t.col.w)
      .dim(t.hsCross - t.col.w)
      .dim(t.col.w)
      .next()
      .dim(t.wCross);
    fig.push(dim.generate());
  }
  protected colGen = new ColumnViewCross(
    this.fig,
    this.struct.col,
    this.rebars.col
  );
  protected beamGen = new BeamView(
    this.fig,
    this.struct.beamCross,
    this.rebars.beamCross
  );
  protected topBeamGen = new BeamView(
    this.fig,
    this.struct.topCross,
    this.rebars.topCross
  );
  protected buildRebar(): void {
    const t = this.struct;
    const fig = this.fig;
    // col
    const left = this.colGen.generate();
    left.move(vec(-t.hsCross / 2, 0));
    const right = left.mirrorByVAxis();
    fig.push(left, right);
    // topCross
    const topCross = this.topBeamGen.generate();
    topCross.move(vec(0, t.h - t.topCross.h / 2));
    fig.push(topCross);
    // beam
    if (t.n > 1) {
      for (let i = 1; i < t.n + 1; i++) {
        const beam = this.beamGen.generate();
        beam.move(vec(0, t.h - t.vs * i - t.beamCross.h / 2));
        fig.push(beam);
      }
    }
  }
}
