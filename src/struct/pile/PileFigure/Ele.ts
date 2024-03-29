import { Line, Polyline, TextDraw, TextAlign, toRadian, vec } from "@/draw";
import { Figure, FigureConfig } from "@/struct/utils";
import { PileRebar } from "../PileRebar";
import { PileStruct } from "../PileStruct";
import { PileFigure } from "./PileFigure";

export class Ele extends Figure{
  constructor(protected struct: PileStruct, protected rebars: PileRebar, protected figures: PileFigure){super();}
  protected unitScale = 1;
  protected drawScale = 50;
  protected title = '桩身结构钢筋图';
  protected config = new FigureConfig(true, true);
  protected draw(): void {
    this.buildOutline();
    this.buildRebar();
    this.buildNote();
    this.buildDim();
  }
  protected buildOutline(): void {
    const t = this.struct;
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
  }
  protected buildNote(): void {
    const fig = this.fig;
    const t = this.struct;
    const y = -3000;
    const { left, right, top } = fig.outline.getBoundingBox();
    fig.push(fig.breakline(vec(left, 0), vec(left, top)));
    fig.push(fig.breakline(vec(right, 0), vec(right, top)));
    fig.push(fig.sectSymbol(this.figures.sect.id, vec(-t.d/2 - fig.h, y), vec(t.d/2 + fig.h, y)));
  }
  protected buildDim(): this {
    const t = this.struct;
    const rebars = this.rebars;
    const fig = this.fig;
    const dim = fig.dimBuilder();
    const bar = rebars.stir;
    const right = fig.getBoundingBox().right + fig.h;
    const bottom = fig.getBoundingBox().bottom;
    dim.vRight(right + 0.5 * fig.h, t.hs);
    if (t.hs > 0) {
      dim.dim(t.hs);
    }
    const ln = rebars.denseFactor * t.d;
    dim
      .dim(ln)
      .dim(t.h - ln, `H-${ln}`)
      .next()
      .skip(t.hs)
      .dim(t.h, "桩长H");

    dim.hBottom(-t.d / 2, bottom - fig.h).dim(t.d);
    fig.push(
      dim.generate(),
      new TextDraw(
        `间距${bar.denseSpace}`,
        vec(right, -0.5 * ln),
        fig.h,
        TextAlign.BottomCenter,
        90
      ),
      new TextDraw(
        `间距${bar.space}`,
        vec(right, (-t.h - ln) / 2),
        fig.h,
        TextAlign.BottomCenter,
        90
      )
    );
    return this;
  }

  protected buildRebar(): void {
    this.drawMain();
    this.drawFix();
    this.drawStir();
    this.drawRib();
    this.drawTopStir();
  }

  protected drawMain(): void {
    const t = this.struct;
    const rebars = this.rebars;
    const bar = rebars.main;
    const fig = this.fig;
    const xs = bar.pos();
    const n = xs.length;
    const da = (2 * t.topAngle) / (n - 1);
    const h0 =
      bar.diameter * rebars.anchorFactor * Math.cos(toRadian(t.topAngle));
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
      .spec(bar)
      .leaderNote(
        vec(-t.d / 2 - 2 * fig.h, -5.5 * rebars.stir.denseSpace),
        vec(1, 0)
      );
    fig.push(rebar.generate());
  }
  protected drawFix(): void {
    const t = this.struct;
    const rebars = this.rebars;
    const fig = this.fig;
    const as = rebars.as;
    const bar = rebars.fix;
    const ys = bar.pos();
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
          .spec(bar).count(rebars.fixCount).space(bar.space)
          .leaderNote(vec(-t.d / 2 - fig.h, y), vec(1, 0))
          .generate()
      );
    }
  }
  protected drawRib(): void {
    const t = this.struct;
    const rebars = this.rebars;
    const bar = rebars.rib;
    const fig = this.fig;
    const as = rebars.as;
    const lines = bar
      .pos()
      .map((y) => new Line(vec(-t.d / 2 + as, y), vec(t.d / 2 - as, y)));
    fig.push(
      fig
        .planeRebar()
        .rebar(...lines)
        .spec(bar).space(bar.space)
        .leaderNote(vec(t.d / 3, t.hp + 2 * fig.h), vec(0, 1), vec(1, 0))
        .generate()
    );
  }
  protected drawStir(): void {
    const t = this.struct;
    const rebars = this.rebars;
    const fig = this.fig;
    const as = rebars.as;
    const bar = rebars.stir;
    const left = -t.d / 2 + as;
    const right = t.d / 2 - as;

    const ys = bar.pos();
    const rebar = fig.planeRebar();
    for (let i = 1; i < ys.length; i++) {
      const mid = (ys[i - 1] + ys[i]) / 2;
      rebar.rebar(
        new Polyline(left, ys[i - 1]).lineTo(right, mid).lineTo(left, ys[i])
      );
    }
    fig.push(
      rebar
        .spec(bar).space(bar.space, bar.denseSpace)
        .leaderNote(vec(-t.d / 3, t.hp + 2 * fig.h), vec(0, 1), vec(-1, 0))
        .generate()
    );
  }
  protected drawTopStir(): void {
    const t = this.struct;
    const rebars = this.rebars;
    const bar = rebars.stirTop;
    const fig = this.fig;
    const lines = bar.shape();
    fig.push(
      fig
        .planeRebar()
        .rebar(...lines)
        .spec(bar).count(lines.length).space(bar.space)
        .leaderNote(vec(0, t.hp + 6 * fig.h), vec(0, 1), vec(-1, 0))
        .generate()
    );
  }
}
