import {
  divideByCount,
  Line,
  Polyline,
  RebarDraw,
  Side,
  sum,
  vec,
} from "@/draw";
import { Figure, FigureContent } from "@/struct/utils";
import { BeamStruct } from "./BeamStruct";
import { BeamRebar } from "./BeamRebar";

export class BeamSect extends Figure {
  initFigure(): void {
    this.fig = new FigureContent();
    const { id, title } = this.container.sectId;
    this.fig
      .resetScale(1, 20)
      .setTitle(title)
      .setId(id)
      .displayScale()
      .centerAligned()
      .keepTitlePos();
    this.container.record(this.fig);
  }
  build(t: BeamStruct, rebars: BeamRebar): void {
    this.buildOutline(t);
    this.buildRebar(t, rebars);
    this.buildDim(t);
  }
  protected buildOutline(t: BeamStruct): void {
    this.fig.addOutline(
      new Polyline(-t.w / 2, t.h / 2)
        .lineBy(t.w, 0)
        .lineBy(0, -t.h)
        .lineBy(-t.w, 0)
        .lineBy(0, t.h)
        .greyLine()
    );
  }
  protected buildRebar(t: BeamStruct, rebars: BeamRebar): void {
    this.drawBot(t, rebars);
    this.drawTop(t, rebars);
    this.drawMid(t, rebars);
    this.drawStirAndTendon(t, rebars);
  }
  protected buildDim(t: BeamStruct): void {
    const fig = this.fig;
    const { right, bottom } = fig.getBoundingBox();
    const dim = fig.dimBuilder();
    dim.vRight(right + fig.h, t.h / 2).dim(t.h);
    dim.hBottom(-t.w / 2, bottom - fig.h).dim(t.w);
    fig.push(dim.generate());
  }
  protected drawBot(t: BeamStruct, rebars: BeamRebar): void {
    const fig = this.fig;
    const bar = rebars.bot;
    const as = rebars.info.as;
    fig.push(
      fig
        .linePointRebar()
        .line(
          new Line(
            vec(-t.w / 2 + as + fig.r, -t.h / 2 + as + fig.r),
            vec(t.w / 2 - as - fig.r, -t.h / 2 + as + fig.r)
          ).divideByCount(bar.singleCount - 1)
        )
        .spec(bar.spec, bar.singleCount)
        .offset(2 * fig.h + as, Side.Right)
        .onlineNote()
        .generate()
    );
  }
  protected drawTop(t: BeamStruct, rebars: BeamRebar): void {
    const fig = this.fig;
    const bar = rebars.top;
    const as = rebars.info.as;
    fig.push(
      fig
        .linePointRebar()
        .line(
          new Line(
            vec(-t.w / 2 + as + fig.r, t.h / 2 - as - fig.r),
            vec(t.w / 2 - as - fig.r, t.h / 2 - as - fig.r)
          ).divideByCount(bar.singleCount - 1)
        )
        .spec(bar.spec, bar.singleCount)
        .offset(2 * fig.h + as)
        .onlineNote()
        .generate()
    );
  }
  protected drawMid(t: BeamStruct, rebars: BeamRebar): void {
    const fig = this.fig;
    const bar = rebars.mid;
    const as = rebars.info.as;
    const left = fig
      .linePointRebar()
      .line(
        new Line(
          vec(-t.w / 2 + as + fig.r, -t.h / 2 + as + fig.r),
          vec(-t.w / 2 + as + fig.r, t.h / 2 - as - fig.r)
        )
          .divideByCount(bar.singleCount + 1)
          .removeBothPt()
      )
      .spec(bar.spec, bar.singleCount)
      .offset(2 * fig.h + as)
      .onlineNote()
      .generate();
    const right = left.mirrorByVAxis();
    fig.push(left, right);
  }
  protected drawStirAndTendon(t: BeamStruct, rebars: BeamRebar): void {
    const fig = this.fig;
    const bar = rebars.stir;
    const as = rebars.info.as;
    const ys = divideByCount(
      -t.h / 2 + as + fig.r,
      t.h / 2 - as - fig.r,
      rebars.mid.singleCount + 1
    );
    const y = sum(...ys.slice(-2)) * 0.5;
    fig.push(
      fig
        .planeRebar()
        .rebar(RebarDraw.stir(t.h - 2 * as, t.w - 2 * as, fig.r))
        .spec(bar.spec)
        .leaderNote(vec(-t.w / 2 - 2 * fig.h, y), vec(1, 0))
        .generate()
    );
    const rebar = fig
      .planeRebar()
      .spec(rebars.tendon.spec, 0, rebars.tendon.space);

    for (const y of ys.slice(1, -1)) {
      const l = RebarDraw.hLineHook(t.w - 2 * as, fig.r);
      l.move(vec(0, y));
      rebar.rebar(l);
    }
    fig.push(
      rebar
        .cross(
          new Polyline(0, -t.h / 2).lineTo(0, y).lineBy(t.w / 2 + fig.h, 0)
        )
        .note()
        .generate()
    );
  }
}
