import { Line, Polyline, Text, TextAlign, toRadian, vec } from "@/draw";
import { FigureContent } from "@/struct/utils";
import { Figure } from "../../utils/Figure";
import { PileRebar } from "../PileRebar";
import { PileStruct } from "../PileStruct";

export class Ele extends Figure{
  initFigure(): this {
    this.fig = new FigureContent();
    this.fig
      .resetScale(1, 50)
      .setTitle("桩身结构钢筋图")
      .displayScale()
      .keepTitlePos()
      .centerAligned();
    this.container.record(this.fig);
    return this;
  }
  build(t: PileStruct, rebars: PileRebar): void {
    this.buildOutline(t);
    this.buildRebar(t, rebars);
    this.buildNote();
    this.buildDim(t, rebars);
  }
  buildOutline(t: PileStruct): this {
    const fig = this.fig;
    const s = 500;
    fig.addOutline(
      new Polyline(-t.d / 2, t.hs)
        .lineBy(0, -t.hs - t.h)
        .arcBy(t.d, 0, 60)
        .lineBy(0, t.hs + t.h)
        .close()
        .greyLine(),
      new Line(vec(-t.d / 2, 0), vec(-t.d / 2 - s, 0)).greyLine(),
      new Line(vec(t.d / 2, 0), vec(t.d / 2 + s, 0)).greyLine(),
      new Line(vec(-t.d / 2 - s, t.hp), vec(t.d / 2 + s, t.hp)).greyLine()
    );
    return this;
  }
  buildNote(): this {
    const fig = this.fig
    const { left, right, top } = fig.outline.getBoundingBox();
    fig.breakline(vec(left, 0), vec(left, top));
    fig.breakline(vec(right, 0), vec(right, top));
    return this;
  }
  buildDim(t: PileStruct, rebars: PileRebar): this {
    const fig = this.fig;
    const dim = fig.dimBuilder();
    const bar = rebars.stir;
    const right = fig.getBoundingBox().right + fig.h;
    const bottom = fig.getBoundingBox().bottom;
    dim.vRight(right + 0.5 * fig.h, t.hs);
    if (t.hs > 0) {
      dim.dim(t.hs);
    }
    const ln = rebars.info.denseFactor * t.d;
    dim
      .dim(ln)
      .dim(t.h - ln, `H-${ln}`)
      .next()
      .skip(t.hs)
      .dim(t.h, "桩长H");

    dim.hBottom(-t.d / 2, bottom - fig.h).dim(t.d);
    fig.push(
      dim.generate(),
      new Text(
        `间距${bar.denseSpace}`,
        vec(right, -0.5 * ln),
        fig.h,
        TextAlign.BottomCenter,
        90
      ),
      new Text(
        `间距${bar.space}`,
        vec(right, (-t.h - ln) / 2),
        fig.h,
        TextAlign.BottomCenter,
        90
      )
    );
    return this;
  }

  buildRebar(t: PileStruct, rebars: PileRebar): this {
    this.drawMain(t, rebars);
    this.drawFix(t, rebars);
    this.drawStir(t, rebars);
    this.drawRib(t, rebars);
    return this;
  }

  protected drawMain(t: PileStruct, rebars: PileRebar): void {
    const bar = rebars.main;
    const fig = this.fig;
    const xs = bar.pos(t);
    const n = xs.length;
    const da = (2 * t.topAngle) / (n - 1);
    const h0 =
      bar.diameter * rebars.info.anchorFactor * Math.cos(toRadian(t.topAngle));
    let a = -t.topAngle;
    const rebar = fig.planeRebar();
    const y0 = h0 + t.hs;
    const h = t.hs + t.h;

    for (const x of xs) {
      const l0 = h0 * Math.tan(toRadian(a));
      const x0 = x + l0;
      rebar.rebar(new Polyline(x0, y0).lineBy(-l0, -h0).lineBy(0, -h));
      a += da;
    }
    rebar
      .spec(bar.spec)
      .leaderNote(
        vec(-t.d / 2 - 2 * fig.h, -5.5 * rebars.stir.denseSpace),
        vec(1, 0)
      );
    fig.push(rebar.generate());
  }
  protected drawFix(t: PileStruct, rebars: PileRebar): void {
    const fig = this.fig;
    const as = rebars.info.as;
    const bar = rebars.fix;
    const ys = bar.pos(t);
    for (const y of ys) {
      const left = new Polyline(-t.d / 2 + as, y + 50 + as)
        .lineBy(-as, -as)
        .lineBy(0, -100)
        .lineBy(as, -as);
      const right = left.mirrorByVAxis();
      fig.push(
        fig
          .planeRebar()
          .rebar(left, right)
          .spec(bar.spec, rebars.info.fixCount, bar.space)
          .leaderNote(vec(-t.d / 2 - fig.h, y), vec(1, 0))
          .generate()
      );
    }
  }
  protected drawRib(t: PileStruct, rebars: PileRebar): void {
    const bar = rebars.rib;
    const fig = this.fig;
    const as = rebars.info.as;
    const lines = bar.pos(t).map(
      (y) => new Line(vec(-t.d / 2 + as, y), vec(t.d / 2 - as, y))
    );
    fig.push(
      fig
        .planeRebar()
        .rebar(...lines)
        .spec(bar.spec, lines.length, bar.space)
        .leaderNote(vec(t.d / 3, t.hp + 2 * fig.h), vec(0, 1), vec(1, 0))
        .generate()
    );
  }
  protected drawStir(t: PileStruct, rebars: PileRebar): void {
    const fig = this.fig;
    const as = rebars.info.as;
    const bar = rebars.stir;
    const left = -t.d / 2 + as;
    const right = t.d / 2 - as;

    const ys = bar.pos(t);
    const rebar = fig.planeRebar();
    for (let i = 1; i < ys.length; i++) {
      const mid = (ys[i - 1] + ys[i]) / 2;
      rebar.rebar(
        new Polyline(left, ys[i - 1]).lineTo(right, mid).lineTo(left, ys[i])
      );
    }
    fig.push(
      rebar
        .spec(bar.spec, 0, bar.space, bar.denseSpace)
        .leaderNote(vec(-t.d / 3, t.hp + 2 * fig.h), vec(0, 1), vec(-1, 0))
        .generate()
    );
  }
  protected drawTopStir(t: PileStruct, rebars: PileRebar): void {
    const bar = rebars.stirTop;
    const fig = this.fig;
    const lines = bar.shape(t, rebars.main);
    fig.push(
      fig
        .planeRebar()
        .rebar(...lines)
        .spec(bar.spec, lines.length, bar.space)
        .leaderNote(vec(0, t.hp + 6 * fig.h), vec(0, 1), vec(-1, 0))
        .generate()
    );
  }
}
