import {
  Line,
  Polyline,
  RebarDraw,
  Side,
  vec,
} from "@/draw";
import { Figure, FigureContent } from "@/struct/utils";
import { TopBeamStruct } from "./TopBeamStruct";
import { TopBeamRebar } from "./TopBeamRebar";

export class TopBeamSect extends Figure {
  initFigure(): void {
    this.fig = new FigureContent();
    const { id, title } = this.container.sectId;
    this.fig
      .resetScale(1, 25)
      .setTitle(title)
      .setId(id)
      .displayScale()
      .centerAligned()
      .keepTitlePos();
    this.container.record(this.fig);
  }
  build(t: TopBeamStruct, rebars: TopBeamRebar): void {
    this.buildOutline(t);
    this.buildRebar(t, rebars);
    this.buildDim(t);
  }
  protected buildOutline(t: TopBeamStruct): void {
    this.fig.addOutline(
      new Polyline(-t.w / 2, t.h / 2)
        .lineBy(t.w, 0)
        .lineBy(0, -t.hd)
        .lineBy(-t.ws, -t.hs)
        .lineBy(-t.wb, 0)
        .lineBy(-t.ws, t.hs)
        .lineBy(0, t.hd)
        .greyLine()
    );
  }
  protected buildRebar(t: TopBeamStruct, rebars: TopBeamRebar): void {
    this.drawBot(t, rebars);
    this.drawTop(t, rebars);
    this.drawMid(t, rebars);
    this.drawStirAndTendon(t, rebars);
  }
  protected buildDim(t: TopBeamStruct): void {
    const fig = this.fig;
    const { right, bottom } = fig.getBoundingBox();
    const dim = fig.dimBuilder();
    dim.vRight(right + fig.h, t.h / 2).dim(t.hd).dim(t.hs).next().dim(t.h);
    dim.hBottom(-t.w / 2, bottom - fig.h).dim(t.ws).dim(t.wb).dim(t.ws).next().dim(t.w);
    fig.push(dim.generate());
  }
  protected drawBot(t: TopBeamStruct, rebars: TopBeamRebar): void {
    const fig = this.fig;
    const bar = rebars.bot;
    const as = rebars.info.as;
    fig.push(
      fig
        .sparsePointRebar()
        .points(
          ...new Line(
            vec(-t.wb / 2 + as + fig.r, -t.h / 2 + as + fig.r),
            vec(t.wb / 2 - as - fig.r, -t.h / 2 + as + fig.r)
          ).divideByCount(bar.singleCount - 1).points
        )
        .spec(bar.spec, bar.singleCount)
        .parallelLeader(vec(t.w/2+fig.h, -t.h/2-fig.h), vec(1, 0))
        .generate()
    );
  }
  protected drawTop(t: TopBeamStruct, rebars: TopBeamRebar): void {
    const fig = this.fig;
    const bar = rebars.top;
    const as = rebars.info.as;
    fig.push(
      fig
        .sparsePointRebar()
        .points(
          ...new Line(
            vec(-t.w / 2 + as + fig.r, t.h / 2 - as - fig.r),
            vec(t.w / 2 - as - fig.r, t.h / 2 - as - fig.r)
          ).divideByCount(bar.singleCount - 1).points
        )
        .spec(bar.spec, bar.singleCount)
        .parallelLeader(vec(t.w/2+2*fig.h, t.h/2+fig.h), vec(1, 0))
        .generate()
    );
  }
  protected drawMid(t: TopBeamStruct, rebars: TopBeamRebar): void {
    const fig = this.fig;
    const bar = rebars.mid;
    const left = fig
      .sparsePointRebar()
      .points(...bar.pos(t, fig.r))
      .spec(bar.spec, bar.singleCount)
      .jointLeader(vec(-t.w/2-fig.h, 0), vec(-t.w/2-fig.h, 0), vec(-1, 0))
      .generate();
    const right = left.mirrorByVAxis();
    fig.push(left, right);
  }
  protected drawStirAndTendon(t: TopBeamStruct, rebars: TopBeamRebar): void {
    const fig = this.fig;
    const bar = rebars.stir;
    const as = rebars.info.as;
    const pts = rebars.mid.pos(t);
    fig.push(
      fig
        .planeRebar()
        .rebar(
          new Polyline(-t.w/2, t.h/2)
            .lineBy(t.w, 0)
            .lineBy(0, -t.hd)
            .lineBy(-t.ws, -t.hs)
            .lineBy(-t.wb, 0)
            .lineBy(-t.ws, t.hs)
            .close()
            .offset(as, Side.Right)
        )
        .spec(bar.spec)
        .leaderNote(vec(0, t.h/2+3*fig.h), vec(0, 1), vec(-1, 0))
        .generate()
    );
    const rebar = fig
      .planeRebar()
      .spec(rebars.tendon.spec, 0, rebars.tendon.space);

    for (const pt of pts) {
      const l = RebarDraw.hLineHook(Math.abs(pt.x)*2, fig.r);
      l.move(vec(0, pt.y));
      rebar.rebar(l);
    }
    fig.push(
      rebar
        .leaderNote(vec(0, -t.h/2-3*fig.h), vec(0, 1), vec(-1, 0))
        .generate()
    );
  }
}
